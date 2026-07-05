/** Global balance and persistence constants for Tomodachi Musume Ng. */
export const GAME_SAVE_KEY = 'tomodachiMusumeSave';
export const GAME_VERSION = '0.0.2';

export const GAME_LOOP_TICK_MS = 3_000;
export const MISSION_TICK_MS = 1_000;

export const ENERGY_MAX = 100;
export const SATIETY_MAX = 100;
export const AFFINITY_MAX = 100;

export const MISSION_ENERGY_COST = 10;

export const DEFAULT_PET_SLOT_CAPACITY = 2;
export const PET_SLOT_UPGRADE_ITEM_ID = 'pet_slot_upgrade';
export const PET_SLOT_UPGRADE_AMOUNT = 1;
export const PET_SLOT_UPGRADE_PRICE = 350;

export const COMPANION_MISSION_ID = 'eleanora';

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

export const EXPRESSION_EYES_IDLE = DEFAULT_EXPRESSION.eyes;
export const EXPRESSION_EYES_BLINK = '/assets/img/expressions/eyes_happy.png';
export const EXPRESSION_BLINK_MS = 150;
export const EXPRESSION_BLINK_MIN_MS = 3_000;
export const EXPRESSION_BLINK_MAX_MS = 7_000;

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
