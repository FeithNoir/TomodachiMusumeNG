import {
  INVENTORY_SLOT_UPGRADE_ITEM_ID,
  INVENTORY_SLOT_UPGRADE_PRICE,
  PET_SLOT_UPGRADE_ITEM_ID,
  PET_SLOT_UPGRADE_PRICE,
} from '@core/data/game-config';

export type ShopSpecialItemType = 'pet_slot' | 'inventory_slot' | 'egg';

export interface ShopSpecialItem {
  id: string;
  nameKey: string;
  buyPrice: number;
  emoji: string;
  type: ShopSpecialItemType;
  eggId?: string;
}

/** Special shop listings not tied to masterItemList entries. */
export const SHOP_SPECIAL_ITEMS: ShopSpecialItem[] = [
  {
    id: 'common_egg',
    nameKey: 'shopCommonEgg',
    buyPrice: 350,
    emoji: '🥚',
    type: 'egg',
    eggId: 'common_egg',
  },
  {
    id: PET_SLOT_UPGRADE_ITEM_ID,
    nameKey: 'shopPetSlotUpgrade',
    buyPrice: PET_SLOT_UPGRADE_PRICE,
    emoji: '🏠',
    type: 'pet_slot',
  },
  {
    id: INVENTORY_SLOT_UPGRADE_ITEM_ID,
    nameKey: 'shopInventorySlotUpgrade',
    buyPrice: INVENTORY_SLOT_UPGRADE_PRICE,
    emoji: '🎒',
    type: 'inventory_slot',
  },
];

export const SHOP_SPECIAL_IDS = SHOP_SPECIAL_ITEMS.map(item => item.id);

export function isShopSpecialItem(itemId: string): boolean {
  return SHOP_SPECIAL_IDS.includes(itemId);
}

export function isShopEggItem(itemId: string): boolean {
  return SHOP_SPECIAL_ITEMS.some(item => item.id === itemId && item.type === 'egg');
}
