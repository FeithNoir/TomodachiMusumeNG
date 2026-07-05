export interface MissionRewardTableEntry {
  type: 'money' | 'item' | 'recipe' | 'egg';
  id?: string;
  quantity?: number;
  /** 0–100 chance to roll this entry when the mission succeeds. */
  chance: number;
  minMoney?: number;
  maxMoney?: number;
}

export interface MissionRewardTable {
  id: string;
  nothingChance: number;
  entries: MissionRewardTableEntry[];
}

export const MISSION_REWARD_TABLES: Record<string, MissionRewardTable> = {
  common_loot: {
    id: 'common_loot',
    nothingChance: 25,
    entries: [
      { type: 'money', chance: 100, minMoney: 10, maxMoney: 25 },
      { type: 'item', id: 'wood_plank', quantity: 1, chance: 40 },
    ],
  },
  uncommon_loot: {
    id: 'uncommon_loot',
    nothingChance: 20,
    entries: [
      { type: 'money', chance: 100, minMoney: 20, maxMoney: 45 },
      { type: 'item', id: 'steel_ingot', quantity: 1, chance: 35 },
    ],
  },
  rare_loot: {
    id: 'rare_loot',
    nothingChance: 15,
    entries: [
      { type: 'money', chance: 100, minMoney: 35, maxMoney: 70 },
      { type: 'item', id: 'wood_plank', quantity: 2, chance: 50 },
      { type: 'egg', id: 'forest_egg', chance: 8 },
    ],
  },
  epic_loot: {
    id: 'epic_loot',
    nothingChance: 10,
    entries: [
      { type: 'money', chance: 100, minMoney: 60, maxMoney: 120 },
      { type: 'item', id: 'steel_ingot', quantity: 2, chance: 45 },
      { type: 'egg', id: 'ruins_egg', chance: 12 },
    ],
  },
  legendary_loot: {
    id: 'legendary_loot',
    nothingChance: 5,
    entries: [
      { type: 'money', chance: 100, minMoney: 100, maxMoney: 200 },
      { type: 'egg', id: 'dragon_egg', chance: 25 },
    ],
  },
  random_event_loot: {
    id: 'random_event_loot',
    nothingChance: 30,
    entries: [
      { type: 'money', chance: 100, minMoney: 15, maxMoney: 40 },
      { type: 'item', id: 'wood_plank', quantity: 1, chance: 30 },
      { type: 'egg', id: 'forest_egg', chance: 5 },
    ],
  },
};
