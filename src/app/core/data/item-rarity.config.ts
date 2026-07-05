import { MissionDifficulty } from '@core/interfaces/mission-definition.interface';

export type ItemRarity = MissionDifficulty;

export interface ItemRarityMeta {
  color: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
}

/** Shared rarity palette for missions, items, and eggs. */
export const ITEM_RARITY_META: Record<ItemRarity, ItemRarityMeta> = {
  common: {
    color: '#d1d5db',
    borderColor: 'rgba(209, 213, 219, 0.55)',
    glowColor: 'rgba(209, 213, 219, 0.2)',
    bgGradient: 'linear-gradient(145deg, rgba(45, 20, 5, 0.82) 0%, rgba(209, 213, 219, 0.12) 100%)',
  },
  uncommon: {
    color: '#22c55e',
    borderColor: 'rgba(34, 197, 94, 0.55)',
    glowColor: 'rgba(34, 197, 94, 0.2)',
    bgGradient: 'linear-gradient(145deg, rgba(45, 20, 5, 0.82) 0%, rgba(34, 197, 94, 0.14) 100%)',
  },
  rare: {
    color: '#3b82f6',
    borderColor: 'rgba(59, 130, 246, 0.55)',
    glowColor: 'rgba(59, 130, 246, 0.22)',
    bgGradient: 'linear-gradient(145deg, rgba(45, 20, 5, 0.82) 0%, rgba(59, 130, 246, 0.16) 100%)',
  },
  epic: {
    color: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.55)',
    glowColor: 'rgba(168, 85, 247, 0.22)',
    bgGradient: 'linear-gradient(145deg, rgba(45, 20, 5, 0.82) 0%, rgba(168, 85, 247, 0.16) 100%)',
  },
  legendary: {
    color: '#fbbf24',
    borderColor: 'rgba(251, 191, 36, 0.65)',
    glowColor: 'rgba(251, 191, 36, 0.28)',
    bgGradient: 'linear-gradient(145deg, rgba(45, 20, 5, 0.82) 0%, rgba(251, 191, 36, 0.18) 100%)',
  },
};

/** Explicit rarity tags for catalog items. */
export const ITEM_RARITY_MAP: Record<string, ItemRarity> = {
  cheap_shirt: 'common',
  cheap_pants: 'common',
  good_shirt: 'uncommon',
  good_pants: 'uncommon',
  casual_top: 'uncommon',
  mini_skirt: 'uncommon',
  neko_ears: 'uncommon',
  bra_1: 'common',
  bra_2: 'uncommon',
  pantsus_1: 'common',
  pantsus_2: 'uncommon',
  maid_diadema: 'rare',
  maid_top: 'rare',
  maid_skirt: 'rare',
  maid_stocks: 'rare',
  maid_guantelets: 'rare',
  leather_shirt: 'uncommon',
  leather_skirt: 'uncommon',
  leather_guantelets: 'uncommon',
  leather_stocks: 'uncommon',
  steel_armor: 'rare',
  steel_skirt: 'rare',
  steel_guantelets: 'rare',
  steel_stocks: 'rare',
  scale_armor: 'epic',
  scale_skirt: 'epic',
  scale_guantelets: 'epic',
  scale_stocks: 'epic',
  bunny_suit: 'epic',
  bunny_ears: 'epic',
  bunny_stocks: 'epic',
  east_suit: 'legendary',
  east_stocks: 'legendary',
  leotard: 'legendary',
  wooden_sword: 'common',
  iron_sword: 'rare',
  steel_sword: 'epic',
  energy_drink: 'uncommon',
  wood_plank: 'common',
  iron_ore: 'common',
  steel_ingot: 'uncommon',
  recipe_steel_sword: 'rare',
};

export function getItemRarity(itemId: string): ItemRarity {
  return ITEM_RARITY_MAP[itemId] ?? 'common';
}

export function getItemRarityClass(itemId: string): string {
  return `item-rarity--${getItemRarity(itemId)}`;
}

export function getItemRarityStyle(itemId: string): Record<string, string> {
  const meta = ITEM_RARITY_META[getItemRarity(itemId)];
  return {
    '--rarity-color': meta.color,
    '--rarity-border': meta.borderColor,
    '--rarity-glow': meta.glowColor,
    '--rarity-bg': meta.bgGradient,
  };
}

export function shouldShowItemRarity(itemId: string, type?: string): boolean {
  if (!type) {
    return itemId in ITEM_RARITY_MAP;
  }
  return ['top', 'bottom', 'suit', 'head', 'stockings', 'hands', 'weapon', 'bra', 'pantsus', 'consumable', 'material', 'recipe'].includes(type);
}
