import { ItemRarity } from '@core/data/item-rarity.config';

export const EGG_INCUBATION_MS: Record<ItemRarity, number> = {
  common: 60_000,
  uncommon: 180_000,
  rare: 600_000,
  epic: 1_800_000,
  legendary: 3_600_000,
};

export function getEggIncubationMs(rarity: ItemRarity): number {
  return EGG_INCUBATION_MS[rarity];
}
