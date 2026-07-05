/** Mission reward probabilities and loot tables. */
export const MISSION_NOTHING_CHANCE_PERCENT = 30;
export const MISSION_BASE_MONEY_REWARD = 20;

export interface MissionItemDrop {
  id: string;
  quantity: number;
  /** Roll succeeds when Math.random() is greater than this value (0–1). */
  dropChance: number;
}

export const MISSION_ITEM_DROPS: MissionItemDrop[] = [
  { id: 'wood_plank', quantity: 1, dropChance: 0.5 },
];
