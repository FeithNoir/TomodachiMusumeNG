import { Injectable, computed, inject } from '@angular/core';
import { BASE_CHARACTER_STATS } from '@core/data/base-character-stats';
import {
  CharacterStats,
  STAT_KEYS,
} from '@core/interfaces/character-stats.interface';
import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { TemporaryEffectService } from '@core/services/temporary-effect.service';
import {
  calculateEquipmentBonusStats,
  calculateTotalStats,
  mergeCharacterStats,
} from '@core/utils/character-stats.util';

@Injectable({
  providedIn: 'root',
})
export class CharacterStatsService {
  private characterService = inject(CharacterService);
  private gameState = inject(GameStateService);
  private itemCatalog = inject(ItemCatalogService);
  private tempEffects = inject(TemporaryEffectService);

  public baseStats = computed(() => ({ ...BASE_CHARACTER_STATS }));

  public bonusStats = computed(() => {
    const equipmentBonus = calculateEquipmentBonusStats(
      this.characterService.equipped(),
      id => this.itemCatalog.getItemStats(id)
    );
    const training = this.gameState.gameState().trainingStatBonus;
    const temporary = this.tempEffects.getCharacterTemporaryBonus();
    const merged = { ...equipmentBonus };
    for (const key of STAT_KEYS) {
      merged[key] += training[key] ?? 0;
      merged[key] += temporary[key] ?? 0;
    }
    return merged;
  });

  public totalStats = computed(() => this.mergeStats(this.baseStats(), this.bonusStats()));

  /** Endurance defines the energy pool cap (base + gear). */
  public maxEnergy = computed(() => this.totalStats().endurance);

  calculateBonusStats(equipped: Record<string, string | null>): CharacterStats {
    return calculateEquipmentBonusStats(equipped, id => this.itemCatalog.getItemStats(id));
  }

  calculateTotalStats(equipped: Record<string, string | null>): CharacterStats {
    return calculateTotalStats(
      equipped,
      this.gameState.gameState().trainingStatBonus,
      id => this.itemCatalog.getItemStats(id)
    );
  }

  mergeStats(base: CharacterStats, bonus: Partial<CharacterStats>): CharacterStats {
    return mergeCharacterStats(base, bonus);
  }

  getItemStatsForItem(itemId: string): Partial<CharacterStats> {
    return this.itemCatalog.getItemStats(itemId);
  }
}
