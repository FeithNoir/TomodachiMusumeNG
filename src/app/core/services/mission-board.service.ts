import { Injectable, computed, inject } from '@angular/core';
import {
  MISSION_ALWAYS_AVAILABLE,
  MISSION_DEFINITIONS,
  MISSION_RANDOM_POOL,
  MISSION_RANDOM_SLOT_COUNT,
} from '@core/data/mission-database';
import { getMissionDurationMs } from '@core/data/mission-difficulty.config';
import {
  MissionBoardEntry,
  MissionCondition,
  MissionConditionStatus,
  MissionDefinition,
  MissionStatRequirementStatus,
} from '@core/interfaces/mission-definition.interface';
import { CharacterStatsService } from '@core/services/character-stats.service';
import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class MissionBoardService {
  private gameState = inject(GameStateService);
  private characterStats = inject(CharacterStatsService);
  private characterService = inject(CharacterService);

  readonly boardEntries = computed(() => this.buildBoard());

  private buildBoard(): MissionBoardEntry[] {
    const entries: MissionDefinition[] = [...MISSION_ALWAYS_AVAILABLE];
    entries.push(...this.pickRandomMissions());
    entries.push(...this.getConditionalMissions());

    const unique = new Map<string, MissionDefinition>();
    for (const mission of entries) {
      unique.set(mission.id, mission);
    }

    return [...unique.values()].map(definition => this.toBoardEntry(definition));
  }

  getDefinition(missionId: string): MissionDefinition | undefined {
    return MISSION_DEFINITIONS[missionId];
  }

  private toBoardEntry(definition: MissionDefinition): MissionBoardEntry {
    const durationMs = getMissionDurationMs(definition.difficulty, definition.durationMs);
    const statStatuses = this.buildStatStatuses(definition);
    const conditionStatuses = this.buildConditionStatuses(definition);
    const currentEnergy = this.gameState.energy();
    const energyMet = currentEnergy >= definition.energyCost;

    const statsOk = statStatuses.every(s => s.met);
    const conditionsOk = conditionStatuses.every(c => c.met);
    const meetsRequirements = statsOk && conditionsOk;

    return {
      definition,
      durationMs,
      meetsRequirements,
      lockedReasonKey: !conditionsOk
        ? 'missionLockedCondition'
        : !statsOk
          ? 'missionLockedStats'
          : undefined,
      statStatuses,
      conditionStatuses,
      energyCost: definition.energyCost,
      currentEnergy,
      energyMet,
    };
  }

  private buildStatStatuses(definition: MissionDefinition): MissionStatRequirementStatus[] {
    const stats = this.characterStats.totalStats();
    return (definition.statRequirements ?? []).map(req => ({
      stat: req.stat,
      required: req.minValue,
      current: stats[req.stat],
      met: stats[req.stat] >= req.minValue,
    }));
  }

  private buildConditionStatuses(definition: MissionDefinition): MissionConditionStatus[] {
    return (definition.conditions ?? []).map(condition => {
      const current = this.getConditionCurrent(condition);
      const required = condition.minValue ?? 0;
      return {
        type: condition.type,
        current,
        required,
        met: this.meetsCondition(condition),
      };
    });
  }

  private getConditionCurrent(condition: MissionCondition): number {
    switch (condition.type) {
      case 'affinity':
        return this.characterService.affinity();
      case 'stat':
        return condition.stat
          ? this.characterStats.totalStats()[condition.stat]
          : 0;
      default:
        return 0;
    }
  }

  private meetsCondition(condition: MissionCondition): boolean {
    switch (condition.type) {
      case 'affinity':
        return this.characterService.affinity() >= (condition.minValue ?? 0);
      case 'stat': {
        if (!condition.stat) {
          return true;
        }
        const stats = this.characterStats.totalStats();
        return stats[condition.stat] >= (condition.minValue ?? 0);
      }
      case 'flag':
        return condition.flag
          ? this.gameState.gameState().missionFlags.includes(condition.flag)
          : true;
      default:
        return true;
    }
  }

  private pickRandomMissions(): MissionDefinition[] {
    const seed = this.gameState.gameState().missionBoardSeed;
    const pool = [...MISSION_RANDOM_POOL];
    const picked: MissionDefinition[] = [];

    for (let i = 0; i < MISSION_RANDOM_SLOT_COUNT && pool.length > 0; i++) {
      const index = this.weightedIndex(pool, seed + i * 9973);
      picked.push(pool[index]);
      pool.splice(index, 1);
    }

    return picked;
  }

  private weightedIndex(missions: MissionDefinition[], seed: number): number {
    const totalWeight = missions.reduce((sum, m) => sum + (m.randomWeight ?? 1), 0);
    let roll = Math.abs(seed % totalWeight);

    for (let i = 0; i < missions.length; i++) {
      roll -= missions[i].randomWeight ?? 1;
      if (roll < 0) {
        return i;
      }
    }

    return 0;
  }

  private getConditionalMissions(): MissionDefinition[] {
    return Object.values(MISSION_DEFINITIONS).filter(m => {
      if (m.spawnType !== 'conditional') {
        return false;
      }
      return (m.conditions ?? []).every(c => this.meetsCondition(c));
    });
  }

  refreshRandomBoard(): void {
    this.gameState.updateState(state => ({
      ...state,
      missionBoardSeed: Date.now(),
    }));
  }
}
