import { CharacterStats } from '@core/interfaces/character-stats.interface';

/** Fallback / supplemental stats and set tags for equippable items. */
export interface ItemStatMeta {
  stats?: Partial<CharacterStats>;
  armorSet?: string;
}

export const ITEM_STAT_META: Record<string, ItemStatMeta> = {
  cheap_shirt: { stats: { defense: 1 }, armorSet: 'casual' },
  cheap_pants: { stats: { defense: 1 }, armorSet: 'casual' },
  good_shirt: { stats: { defense: 3, health: 5 }, armorSet: 'casual' },
  good_pants: { stats: { defense: 2, health: 5 }, armorSet: 'casual' },
  casual_top: { stats: { defense: 2, stealth: 1 }, armorSet: 'casual' },
  mini_skirt: { stats: { defense: 1, stealth: 2 }, armorSet: 'casual' },
  bra_1: { stats: { stealth: 1 }, armorSet: 'intimate' },
  bra_2: { stats: { stealth: 2, luck: 1 }, armorSet: 'intimate' },
  pantsus_1: { stats: { stealth: 1 }, armorSet: 'intimate' },
  pantsus_2: { stats: { stealth: 2 }, armorSet: 'intimate' },
  bunny_suit: { stats: { defense: 4, luck: 3, stealth: 2 }, armorSet: 'bunny' },
  bunny_ears: { stats: { luck: 2 }, armorSet: 'bunny' },
  bunny_stocks: { stats: { stealth: 1 }, armorSet: 'bunny' },
  east_suit: { stats: { defense: 5, magic: 4 }, armorSet: 'east' },
  east_stocks: { stats: { magic: 1, stealth: 1 }, armorSet: 'east' },
  leotard: { stats: { defense: 3, endurance: 5 }, armorSet: 'misc' },
  maid_diadema: { stats: { magic: 2, luck: 1 }, armorSet: 'maid' },
  maid_top: { stats: { defense: 4, magic: 2 }, armorSet: 'maid' },
  maid_skirt: { stats: { defense: 3, stealth: 1 }, armorSet: 'maid' },
  maid_stocks: { stats: { stealth: 2 }, armorSet: 'maid' },
  maid_guantelets: { stats: { defense: 2, attack: 1 }, armorSet: 'maid' },
  neko_ears: { stats: { luck: 2, stealth: 1 }, armorSet: 'misc' },
  leather_shirt: { stats: { defense: 6, endurance: 4 }, armorSet: 'leather' },
  leather_skirt: { stats: { defense: 4, stealth: 2 }, armorSet: 'leather' },
  leather_guantelets: { stats: { defense: 3, attack: 2 }, armorSet: 'leather' },
  leather_stocks: { stats: { defense: 2 }, armorSet: 'leather' },
  steel_armor: { stats: { defense: 14, health: 12, endurance: 5 }, armorSet: 'steel' },
  steel_skirt: { stats: { defense: 8, health: 6 }, armorSet: 'steel' },
  steel_guantelets: { stats: { defense: 5, attack: 3 }, armorSet: 'steel' },
  steel_stocks: { stats: { defense: 4 }, armorSet: 'steel' },
  scale_armor: { stats: { defense: 18, magic: 4, health: 10 }, armorSet: 'scale' },
  scale_skirt: { stats: { defense: 10, magic: 2 }, armorSet: 'scale' },
  scale_guantelets: { stats: { defense: 6, attack: 4 }, armorSet: 'scale' },
  scale_stocks: { stats: { defense: 5, stealth: 1 }, armorSet: 'scale' },
  wooden_sword: { stats: { attack: 4 } },
  iron_sword: { stats: { attack: 12, luck: 2 } },
  steel_sword: { stats: { attack: 20, luck: 3, endurance: 2 } },
};
