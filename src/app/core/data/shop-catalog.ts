import { ARMOR_SET_LABELS } from '@core/data/armor-sets';
import {
  INVENTORY_SLOT_UPGRADE_ITEM_ID,
  PET_SLOT_UPGRADE_ITEM_ID,
} from '@core/data/game-config';
import { LocalizedText } from '@core/interfaces/localized-text.interface';

export interface ShopSetDefinition {
  id: string;
  name: LocalizedText;
  itemIds: string[];
}

/** Shop navigation groups — special upgrades first, then thematic gear sets. */
export const SHOP_SETS: ShopSetDefinition[] = [
  {
    id: 'upgrades',
    name: { es: 'Mejoras', en: 'Upgrades' },
    itemIds: ['common_egg', PET_SLOT_UPGRADE_ITEM_ID, INVENTORY_SLOT_UPGRADE_ITEM_ID],
  },
  {
    id: 'companions',
    name: { es: 'Compañeros', en: 'Companions' },
    itemIds: ['common_egg'],
  },
  {
    id: 'food_ingredients',
    name: { es: 'Ingredientes', en: 'Ingredients' },
    itemIds: ['wheat', 'meat', 'eggs', 'avocado'],
  },
  {
    id: 'food_meals',
    name: { es: 'Comidas', en: 'Meals' },
    itemIds: ['bread', 'grilled_steak', 'omelette', 'guacamole'],
  },
  {
    id: 'recipes',
    name: { es: 'Recetas', en: 'Recipes' },
    itemIds: ['recipe_bread', 'recipe_steak', 'recipe_omelette', 'recipe_steel_sword'],
  },
  {
    id: 'consumables',
    name: { es: 'Consumibles', en: 'Consumables' },
    itemIds: ['energy_drink'],
  },
  {
    id: 'weapons',
    name: { es: 'Armas', en: 'Weapons' },
    itemIds: ['wooden_sword', 'iron_sword'],
  },
  {
    id: 'casual',
    name: ARMOR_SET_LABELS['casual'],
    itemIds: ['cheap_shirt', 'cheap_pants', 'good_shirt', 'good_pants', 'casual_top', 'mini_skirt'],
  },
  {
    id: 'intimate',
    name: ARMOR_SET_LABELS['intimate'],
    itemIds: ['bra_1', 'bra_2', 'pantsus_1', 'pantsus_2'],
  },
  {
    id: 'maid',
    name: ARMOR_SET_LABELS['maid'],
    itemIds: ['maid_diadema', 'maid_top', 'maid_skirt', 'maid_stocks', 'maid_guantelets'],
  },
  {
    id: 'leather',
    name: ARMOR_SET_LABELS['leather'],
    itemIds: ['leather_shirt', 'leather_skirt', 'leather_guantelets', 'leather_stocks'],
  },
  {
    id: 'steel',
    name: ARMOR_SET_LABELS['steel'],
    itemIds: ['steel_armor', 'steel_skirt', 'steel_guantelets', 'steel_stocks'],
  },
  {
    id: 'scale',
    name: ARMOR_SET_LABELS['scale'],
    itemIds: ['scale_armor', 'scale_skirt', 'scale_guantelets', 'scale_stocks'],
  },
  {
    id: 'bunny',
    name: ARMOR_SET_LABELS['bunny'],
    itemIds: ['bunny_suit', 'bunny_ears', 'bunny_stocks'],
  },
  {
    id: 'east',
    name: ARMOR_SET_LABELS['east'],
    itemIds: ['east_suit', 'east_stocks'],
  },
  {
    id: 'misc',
    name: ARMOR_SET_LABELS['misc'],
    itemIds: ['neko_ears', 'leotard'],
  },
];

export const SHOP_SET_MAP = Object.fromEntries(SHOP_SETS.map(set => [set.id, set]));

export const shopInventory: string[] = SHOP_SETS.flatMap(set => set.itemIds);

export function getShopSetsWithAvailableItems(availableIds: string[]): ShopSetDefinition[] {
  const available = new Set(availableIds);
  return SHOP_SETS.map(set => ({
    ...set,
    itemIds: set.itemIds.filter(id => available.has(id)),
  })).filter(set => set.itemIds.length > 0);
}
