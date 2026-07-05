import { Injectable, computed, inject, signal } from '@angular/core';
import { COMPANION_MISSION_ID } from '@core/data/game-config';
import { getMissionDurationMs, MISSION_DIFFICULTY_META } from '@core/data/mission-difficulty.config';
import { MISSION_REWARD_TABLES } from '@core/data/mission-rewards.config';
import {
  ActiveMission,
  MissionAssigneeOption,
  MissionDefinition,
  MissionRewardRoll,
  MissionStatRequirement,
} from '@core/interfaces/mission-definition.interface';
import { CharacterStats, StatKey } from '@core/interfaces/character-stats.interface';
import { PetVisual } from '@core/interfaces/pet.interface';
import { CharacterStatsService } from '@core/services/character-stats.service';
import { GameEventService } from '@core/services/game-event.service';
import { GameStateService } from '@core/services/game-state.service';
import { InventoryService } from '@core/services/inventory.service';
import { MissionBoardService } from '@core/services/mission-board.service';
import { PetService } from '@core/services/pet.service';
import { PetStatsService } from '@core/services/pet-stats.service';
import { GAME_EVENT_TYPES } from '@core/interfaces/game-event.interface';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  private gameState = inject(GameStateService);
  private inventoryService = inject(InventoryService);
  private characterStats = inject(CharacterStatsService);
  private petStats = inject(PetStatsService);
  private petService = inject(PetService);
  private missionBoard = inject(MissionBoardService);
  private gameEvents = inject(GameEventService);

  private clock = signal(Date.now());

  readonly activeMissions = computed(() => this.getRunningMissions());

  /** @deprecated Use activeMissions — first running mission for legacy UI. */
  readonly activeMission = computed(() => this.activeMissions()[0] ?? null);

  readonly isMissionInProgress = computed(() => {
    this.clock();
    return this.activeMissions().length > 0;
  });

  readonly isCharacterAway = computed(() => {
    this.clock();
    return this.activeMissions().some(
      m => m.assigneeType === 'character' && m.assigneeId === COMPANION_MISSION_ID
    );
  });

  readonly missionProgress = computed(() => {
    this.clock();
    const mission = this.activeMission();
    if (!mission) {
      return 0;
    }
    const total = mission.endsAt - mission.startedAt;
    if (total <= 0) {
      return 100;
    }
    const elapsed = Date.now() - mission.startedAt;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  });

  tickClock(): void {
    this.clock.set(Date.now());
  }

  getRunningMissions(): ActiveMission[] {
    const now = Date.now();
    return this.gameState.gameState().activeMissions.filter(m => now < m.endsAt);
  }

  getBusyAssigneeIds(): Set<string> {
    return new Set(this.getRunningMissions().map(m => m.assigneeId));
  }

  buildAssigneeOptions(definition: MissionDefinition): MissionAssigneeOption[] {
    const options: MissionAssigneeOption[] = [];
    const busyIds = this.getBusyAssigneeIds();

    if (definition.allowCharacter) {
      const stats = this.characterStats.totalStats();
      const energyOk = this.gameState.energy() >= definition.energyCost;
      const statsOk = this.meetsRequirements(stats, definition.statRequirements);
      const available = !busyIds.has(COMPANION_MISSION_ID) && energyOk && statsOk;

      options.push({
        type: 'character',
        id: COMPANION_MISSION_ID,
        label: this.gameState.gameState().characterName,
        visual: null,
        stats,
        available,
        unavailableReasonKey: !energyOk
          ? 'noEnergy'
          : !statsOk
            ? 'missionLockedStats'
            : 'missionAssigneeBusy',
      });
    }

    if (definition.allowPets) {
      for (const { pet, total } of this.petStats.petsWithStats()) {
        const statsOk = this.meetsRequirements(total, definition.statRequirements);
        const available = !busyIds.has(pet.id) && statsOk;

        options.push({
          type: 'pet',
          id: pet.id,
          label: pet.name,
          visual: pet.visual,
          stats: total,
          available,
          unavailableReasonKey: !statsOk ? 'missionLockedStats' : 'missionAssigneeBusy',
        });
      }
    }

    return options;
  }

  startMission(
    missionId: string,
    assigneeType: 'character' | 'pet',
    assigneeId: string
  ): boolean {
    const definition = this.getDefinition(missionId);
    if (!definition) {
      return false;
    }

    const options = this.buildAssigneeOptions(definition);
    const assignee = options.find(o => o.type === assigneeType && o.id === assigneeId);
    if (!assignee?.available) {
      return false;
    }

    if (assigneeType === 'character') {
      this.gameState.updateEnergy(-definition.energyCost);
    }

    const durationMs = getMissionDurationMs(definition.difficulty, definition.durationMs);
    const startedAt = Date.now();
    const active: ActiveMission = {
      missionId,
      assigneeType,
      assigneeId,
      startedAt,
      endsAt: startedAt + durationMs,
    };

    this.gameState.updateState(state => ({
      ...state,
      activeMissions: [...state.activeMissions, active],
    }));
    this.gameState.saveGame();
    this.gameEvents.emit(GAME_EVENT_TYPES.MISSION_STARTED, active);
    return true;
  }

  tickActiveMission(): MissionRewardRoll | null {
    const rewards = this.tickAllCompletedMissions();
    return rewards.length > 0 ? rewards[rewards.length - 1] : null;
  }

  tickAllCompletedMissions(): MissionRewardRoll[] {
    const now = Date.now();
    const expired = this.gameState.gameState().activeMissions.filter(m => now >= m.endsAt);
    const rewards: MissionRewardRoll[] = [];

    for (const mission of expired) {
      const reward = this.completeMission(mission);
      if (reward) {
        rewards.push(reward);
      }
    }

    return rewards;
  }

  completeActiveMission(): MissionRewardRoll | null {
    const mission = this.activeMission();
    if (!mission) {
      return null;
    }
    return this.completeMission(mission);
  }

  private completeMission(mission: ActiveMission): MissionRewardRoll | null {
    const definition = this.getDefinition(mission.missionId);
    const reward = definition
      ? this.rollRewards(definition.rewardTableId)
      : this.emptyReward();

    this.applyRewards(reward);
    this.gameState.updateState(state => ({
      ...state,
      activeMissions: state.activeMissions.filter(
        m => !(m.assigneeId === mission.assigneeId && m.startedAt === mission.startedAt)
      ),
      missionFlags: state.missionFlags.includes(mission.missionId)
        ? state.missionFlags
        : [...state.missionFlags, mission.missionId],
    }));

    this.gameEvents.emit(GAME_EVENT_TYPES.MISSION_COMPLETED, { mission, reward });
    return reward;
  }

  getDefinition(missionId: string): MissionDefinition | undefined {
    return this.missionBoard.getDefinition(missionId);
  }

  cancelBoardIfAway(): boolean {
    return this.isCharacterAway();
  }

  formatDuration(ms: number): string {
    const totalSec = Math.ceil(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min <= 0) {
      return `${sec}s`;
    }
    return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
  }

  getDifficultyMeta(difficulty: MissionDefinition['difficulty']) {
    return MISSION_DIFFICULTY_META[difficulty];
  }

  getAssigneeVisual(option: MissionAssigneeOption): PetVisual | null {
    if (option.visual) {
      return option.visual;
    }
    return { type: 'emoji', value: '👧' };
  }

  getSpeciesVisualForPet(petId: string): PetVisual | null {
    const pet = this.petStats.getPetById(petId);
    return pet?.visual ?? null;
  }

  private meetsRequirements(
    stats: CharacterStats,
    requirements?: MissionStatRequirement[]
  ): boolean {
    if (!requirements?.length) {
      return true;
    }
    return requirements.every(req => stats[req.stat] >= req.minValue);
  }

  private rollRewards(tableId: string): MissionRewardRoll {
    const table = MISSION_REWARD_TABLES[tableId];
    if (!table) {
      return this.emptyReward();
    }

    if (Math.random() * 100 < table.nothingChance) {
      return { ...this.emptyReward(), messageKey: 'missionReturnNothing' };
    }

    const roll: MissionRewardRoll = {
      moneyEarned: 0,
      itemsFound: [],
      recipesFound: [],
      eggsFound: [],
      messageKey: 'missionReturn',
    };

    for (const entry of table.entries) {
      if (Math.random() * 100 >= entry.chance) {
        continue;
      }

      switch (entry.type) {
        case 'money':
          roll.moneyEarned += this.randomBetween(entry.minMoney ?? 0, entry.maxMoney ?? 0);
          break;
        case 'item':
          if (entry.id) {
            roll.itemsFound.push({ id: entry.id, quantity: entry.quantity ?? 1 });
          }
          break;
        case 'recipe':
          if (entry.id) {
            roll.recipesFound.push(entry.id);
          }
          break;
        case 'egg':
          if (entry.id) {
            roll.eggsFound.push(entry.id);
          }
          break;
      }
    }

    return roll;
  }

  private applyRewards(reward: MissionRewardRoll): void {
    if (reward.moneyEarned > 0) {
      this.gameState.updateMoney(reward.moneyEarned);
    }

    for (const item of reward.itemsFound) {
      this.inventoryService.addItem(item.id, item.quantity);
    }

    for (const recipeId of reward.recipesFound) {
      this.gameState.addKnownRecipe(recipeId);
    }

    for (const eggId of reward.eggsFound) {
      this.petService.acquireEgg(eggId);
    }
  }

  private randomBetween(min: number, max: number): number {
    if (max <= min) {
      return min;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private emptyReward(): MissionRewardRoll {
    return {
      moneyEarned: 0,
      itemsFound: [],
      recipesFound: [],
      eggsFound: [],
      messageKey: 'missionReturnNothing',
    };
  }
}
