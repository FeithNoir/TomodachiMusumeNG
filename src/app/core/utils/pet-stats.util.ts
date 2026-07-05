import { BASE_CHARACTER_STATS } from '@core/data/base-character-stats';
import {
  CharacterStats,
  EMPTY_CHARACTER_STATS,
  STAT_KEYS,
} from '@core/interfaces/character-stats.interface';
import { Pet } from '@core/interfaces/pet.interface';

export function mergePetStats(base: CharacterStats, bonus: Partial<CharacterStats>): CharacterStats {
  const merged = { ...base };
  for (const key of STAT_KEYS) {
    merged[key] += bonus[key] ?? 0;
  }
  return merged;
}

export function buildPetBaseStats(speciesPartial: Partial<CharacterStats>): CharacterStats {
  const base = { ...BASE_CHARACTER_STATS };
  for (const key of STAT_KEYS) {
    if (speciesPartial[key] !== undefined) {
      base[key] = speciesPartial[key]!;
    }
  }
  return base;
}

export function getPetTotalStats(pet: Pet): CharacterStats {
  return mergePetStats(pet.baseStats, pet.bonusStats);
}

export function createEmptyBonusStats(): Partial<CharacterStats> {
  return { ...EMPTY_CHARACTER_STATS };
}
