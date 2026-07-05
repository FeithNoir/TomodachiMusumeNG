import { CharacterStats } from '@core/interfaces/character-stats.interface';
import { LocalizedText } from '@core/interfaces/localized-text.interface';

/** Visual representation — emoji now, image path later. */
export interface PetVisual {
  type: 'emoji' | 'image';
  value: string;
}

export interface PetSpecies {
  id: string;
  name: LocalizedText;
  defaultVisual: PetVisual;
  baseStats: Partial<CharacterStats>;
}

export interface Pet {
  id: string;
  speciesId: string;
  name: string;
  visual: PetVisual;
  baseStats: CharacterStats;
  /** Bonuses from training, food, and potions (no equipment). */
  bonusStats: Partial<CharacterStats>;
  hatchedAt: number;
}

export interface EggDefinition {
  id: string;
  speciesId: string;
  visual: PetVisual;
  name: LocalizedText;
}
