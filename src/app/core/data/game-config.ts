/** Global balance and persistence constants for Tomodachi Musume Ng. */
export const GAME_SAVE_KEY = 'tomodachiMusumeSave';
export const GAME_VERSION = '0.0.1';

export const GAME_LOOP_TICK_MS = 3_000;

export const ENERGY_MAX = 100;
export const SATIETY_MAX = 100;
export const AFFINITY_MAX = 100;

export const MISSION_ENERGY_COST = 10;

export const INVENTORY_MAX_SLOTS = 20;
export const INVENTORY_MAX_STACK_SIZE = 10;

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_PLAYER_NAME = 'Jefe';
export const DEFAULT_GUILD_NAME = 'Oniriums';
export const DEFAULT_CHARACTER_NAME = 'Eleanora';

export const DEFAULT_EXPRESSION = {
  eyes: '/assets/img/expressions/eyes_1.png',
  mouth: '/assets/img/expressions/mouth_1.png',
} as const;

export const EMPTY_EQUIPPED = {
  top: null,
  bottom: null,
  suit: null,
  head: null,
  stockings: null,
  bra: null,
  pantsus: null,
  hands: null,
  weapon: null,
} as const;
