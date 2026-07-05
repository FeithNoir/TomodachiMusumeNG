import { CharacterStats } from '@core/interfaces/character-stats.interface';

/** Eleanora's base stats before equipment. Endurance doubles as max energy pool. */
export const BASE_CHARACTER_STATS: CharacterStats = {
  attack: 8,
  defense: 5,
  magic: 6,
  health: 100,
  luck: 4,
  endurance: 100,
  stealth: 3,
};
