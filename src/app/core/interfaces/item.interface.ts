export type { LocalizedText } from './localized-text.interface';
import type { LocalizedText } from './localized-text.interface';
import type { CharacterStats } from './character-stats.interface';
import type { TemporaryStatBoost } from './temporary-effect.interface';

// Definimos un tipo cerrado para las categorías.
// Esto evita errores tipográficos (ej: escribir 'wepon' en lugar de 'weapon').
export type EquippableItemCategory = | 'bra' | 'pantsus' | 'top' | 'bottom' | 'suit' | 'head' | 'stockings' | 'hands' | 'weapon';

export type ItemCategory = EquippableItemCategory | 'consumable' | 'material' | 'recipe';

// Interfaz para los efectos (opcional)
export interface ItemEffects {
  missionBonus?: {
    nothingChance: number;
    itemChance: number;
  };
  energy?: number;
  satiety?: number;
  temporaryBoost?: TemporaryStatBoost;
}

// Interfaz principal del Ítem
export interface Item {
  id: string; // Es importante que el objeto sepa su propio ID
  name: LocalizedText;
  type: ItemCategory;
  path: string;
  requiredAffinity?: number;
  effects?: ItemEffects;
  stats?: Partial<CharacterStats>;
  armorSet?: string;
  buyPrice?: number;
  sellPrice?: number;
  recipeId?: string;
  /** Optional emoji placeholder when no image asset exists. */
  emoji?: string;
}

// Interfaz para la colección maestra (Diccionario)
export interface ItemCollection {
  [key: string]: Item;
}
