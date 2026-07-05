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
  MissionDefinition,
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
    const check = this.evaluateRequirements(definition);

    return {
      definition,
      durationMs,
      meetsRequirements: check.ok,
      lockedReasonKey: check.reasonKey,
    };
  }

  private evaluateRequirements(definition: MissionDefinition): { ok: boolean; reasonKey?: string } {
    for (const condition of definition.conditions ?? []) {
      if (!this.meetsCondition(condition)) {
        return { ok: false, reasonKey: 'missionLockedCondition' };
      }
    }

    if (definition.statRequirements?.length) {
      const stats = this.characterStats.totalStats();
      const failed = definition.statRequirements.some(req => stats[req.stat] < req.minValue);
      if (failed) {
        return { ok: false, reasonKey: 'missionLockedStats' };
      }
    }

    return { ok: true };
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
