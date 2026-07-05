import { PET_SLOT_UPGRADE_ITEM_ID, PET_SLOT_UPGRADE_PRICE } from '@core/data/game-config';

/** Special shop listings not tied to masterItemList entries. */
export const SHOP_SPECIAL_ITEMS: {
  id: string;
  nameKey: string;
  buyPrice: number;
  emoji: string;
}[] = [
  {
    id: PET_SLOT_UPGRADE_ITEM_ID,
    nameKey: 'shopPetSlotUpgrade',
    buyPrice: PET_SLOT_UPGRADE_PRICE,
    emoji: '🏠',
  },
];

export const SHOP_SPECIAL_IDS = SHOP_SPECIAL_ITEMS.map(item => item.id);

export function isShopSpecialItem(itemId: string): boolean {
  return SHOP_SPECIAL_IDS.includes(itemId);
}
