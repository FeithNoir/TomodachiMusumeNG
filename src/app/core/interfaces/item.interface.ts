// Reutilizamos la interfaz de idioma si ya la tienes en otro archivo,
// o la definimos aquí si prefieres mantenerlo autocontenido.
export interface LocalizedText {
  es: string;
  en: string;
  [key: string]: string; // Add index signature
}

// Definimos un tipo cerrado para las categorías.
// Esto evita errores tipográficos (ej: escribir 'wepon' en lugar de 'weapon').
export type EquippableItemCategory =
  | 'bra'
  | 'pantsus'
  | 'top'
  | 'bottom'
  | 'suit'
  | 'head'
  | 'stockings'
  | 'hands'
  | 'weapon';

export type ItemCategory = EquippableItemCategory | 'consumable' | 'material' | 'recipe';

// Interfaz para los efectos (opcional)
export interface ItemEffects {
  missionBonus?: {
    nothingChance: number;
    itemChance: number;
  };
  energy?: number;
}

// Interfaz principal del Ítem
export interface Item {
  id: string; // Es importante que el objeto sepa su propio ID
  name: LocalizedText;
  type: ItemCategory;
  path: string;
  requiredAffinity?: number;
  effects?: ItemEffects;
  buyPrice?: number;
  sellPrice?: number;
  recipeId?: string;
}

// Interfaz para la colección maestra (Diccionario)
export interface ItemCollection {
  [key: string]: Item;
}
