export interface CharacterStats {
  attack: number;
  defense: number;
  magic: number;
  health: number;
  luck: number;
}

export type StatKey = keyof CharacterStats;

export const STAT_KEYS: StatKey[] = ['attack', 'defense', 'magic', 'health', 'luck'];

export const EMPTY_CHARACTER_STATS: CharacterStats = {
  attack: 0,
  defense: 0,
  magic: 0,
  health: 0,
  luck: 0,
};
