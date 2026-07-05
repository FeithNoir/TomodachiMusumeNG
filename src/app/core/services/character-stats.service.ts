import { Injectable, computed, inject } from '@angular/core';
import { BASE_CHARACTER_STATS } from '@core/data/base-character-stats';
import { masterItemList } from '@core/data/item-database';
import {
  CharacterStats,
  EMPTY_CHARACTER_STATS,
  STAT_KEYS,
} from '@core/interfaces/character-stats.interface';
import { CharacterService } from '@core/services/character.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterStatsService {
  private characterService = inject(CharacterService);

  public totalStats = computed(() => this.calculateTotalStats(this.characterService.equipped()));

  calculateTotalStats(equipped: Record<string, string | null>): CharacterStats {
    const totals: CharacterStats = { ...BASE_CHARACTER_STATS };

    for (const itemId of Object.values(equipped)) {
      if (!itemId) {
        continue;
      }

      const itemStats = masterItemList[itemId]?.stats;
      if (!itemStats) {
        continue;
      }

      for (const key of STAT_KEYS) {
        totals[key] += itemStats[key] ?? 0;
      }
    }

    return totals;
  }

  mergeStats(base: CharacterStats, bonus: Partial<CharacterStats>): CharacterStats {
    const merged = { ...base };
    for (const key of STAT_KEYS) {
      merged[key] += bonus[key] ?? 0;
    }
    return merged;
  }

  emptyStats(): CharacterStats {
    return { ...EMPTY_CHARACTER_STATS };
  }
}
