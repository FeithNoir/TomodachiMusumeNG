import { EquippableItemCategory } from '@core/interfaces/item.interface';

export const EQUIPPABLE_ITEM_CATEGORIES: readonly EquippableItemCategory[] = [ 'bra', 'pantsus', 'top', 'bottom', 'suit', 'head', 'stockings', 'hands', 'weapon', ];

export function isEquippableCategory(type: string): type is EquippableItemCategory {
  return (EQUIPPABLE_ITEM_CATEGORIES as readonly string[]).includes(type);
}
