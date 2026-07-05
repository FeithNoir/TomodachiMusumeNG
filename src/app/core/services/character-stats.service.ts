import { Injectable, computed, inject } from '@angular/core';
import { BASE_CHARACTER_STATS } from '@core/data/base-character-stats';
import { ITEM_STAT_META } from '@core/data/item-stat-overrides';
import { masterItemList } from '@core/data/item-database';
import {
  CharacterStats,
  EMPTY_CHARACTER_STATS,
  STAT_KEYS,
} from '@core/interfaces/character-stats.interface';
import { CharacterService } from '@core/services/character.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterStatsService {
  private characterService = inject(CharacterService);
  private itemCatalog = inject(ItemCatalogService);

  public baseStats = computed(() => ({ ...BASE_CHARACTER_STATS }));

  public bonusStats = computed(() => this.calculateBonusStats(this.characterService.equipped()));

  public totalStats = computed(() => this.mergeStats(this.baseStats(), this.bonusStats()));

  /** Endurance defines the energy pool cap (base + gear). */
  public maxEnergy = computed(() => this.totalStats().endurance);

  calculateBonusStats(equipped: Record<string, string | null>): CharacterStats {
    const bonus = { ...EMPTY_CHARACTER_STATS };

    for (const itemId of Object.values(equipped)) {
      if (!itemId) {
        continue;
      }

      const itemStats = this.itemCatalog.getItemStats(itemId);
      for (const key of STAT_KEYS) {
        bonus[key] += itemStats[key] ?? 0;
      }
    }

    return bonus;
  }

  calculateTotalStats(equipped: Record<string, string | null>): CharacterStats {
    return this.mergeStats(BASE_CHARACTER_STATS, this.calculateBonusStats(equipped));
  }

  mergeStats(base: CharacterStats, bonus: Partial<CharacterStats>): CharacterStats {
    const merged = { ...base };
    for (const key of STAT_KEYS) {
      merged[key] += bonus[key] ?? 0;
    }
    return merged;
  }

  getItemStatsForItem(itemId: string): Partial<CharacterStats> {
    return this.itemCatalog.getItemStats(itemId);
  }
}
