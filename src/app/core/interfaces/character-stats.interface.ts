export interface CharacterStats {
  attack: number;
  defense: number;
  magic: number;
  health: number;
  luck: number;
  endurance: number;
  stealth: number;
}

export type StatKey = keyof CharacterStats;

export const STAT_KEYS: StatKey[] = [
  'attack',
  'defense',
  'magic',
  'health',
  'luck',
  'endurance',
  'stealth',
];

export const EMPTY_CHARACTER_STATS: CharacterStats = {
  attack: 0,
  defense: 0,
  magic: 0,
  health: 0,
  luck: 0,
  endurance: 0,
  stealth: 0,
};
