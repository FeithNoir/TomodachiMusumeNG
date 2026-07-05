import { CharacterStats, StatKey } from '@core/interfaces/character-stats.interface';
import { LocalizedText } from '@core/interfaces/localized-text.interface';
import { ItemRarity } from '@core/data/item-rarity.config';

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
  rarity: ItemRarity;
}

export interface IncubatingEgg {
  instanceId: string;
  eggId: string;
  acquiredAt: number;
  hatchAt: number;
}
