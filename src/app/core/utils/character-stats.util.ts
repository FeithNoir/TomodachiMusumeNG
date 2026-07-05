import { BASE_CHARACTER_STATS } from '@core/data/base-character-stats';
import {
  CharacterStats,
  EMPTY_CHARACTER_STATS,
  STAT_KEYS,
} from '@core/interfaces/character-stats.interface';

export type ItemStatsResolver = (itemId: string) => Partial<CharacterStats>;

export function calculateEquipmentBonusStats(
  equipped: Record<string, string | null>,
  getItemStats: ItemStatsResolver
): CharacterStats {
  const bonus = { ...EMPTY_CHARACTER_STATS };

  for (const itemId of Object.values(equipped)) {
    if (!itemId) {
      continue;
    }

    const itemStats = getItemStats(itemId);
    for (const key of STAT_KEYS) {
      bonus[key] += itemStats[key] ?? 0;
    }
  }

  return bonus;
}

export function mergeCharacterStats(
  base: CharacterStats,
  bonus: Partial<CharacterStats>
): CharacterStats {
  const merged = { ...base };
  for (const key of STAT_KEYS) {
    merged[key] += bonus[key] ?? 0;
  }
  return merged;
}

export function calculateTotalStats(
  equipped: Record<string, string | null>,
  trainingStatBonus: Partial<CharacterStats>,
  getItemStats: ItemStatsResolver
): CharacterStats {
  const equipmentBonus = calculateEquipmentBonusStats(equipped, getItemStats);
  const combinedBonus: Partial<CharacterStats> = { ...equipmentBonus };

  for (const key of STAT_KEYS) {
    combinedBonus[key] = (combinedBonus[key] ?? 0) + (trainingStatBonus[key] ?? 0);
  }

  return mergeCharacterStats(BASE_CHARACTER_STATS, combinedBonus);
}

export function calculateMaxEnergy(
  equipped: Record<string, string | null>,
  trainingStatBonus: Partial<CharacterStats>,
  getItemStats: ItemStatsResolver
): number {
  return calculateTotalStats(equipped, trainingStatBonus, getItemStats).endurance;
}
