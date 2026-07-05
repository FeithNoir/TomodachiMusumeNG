import { GameState } from '@core/interfaces/game-state.interface';
import {
  DEFAULT_CHARACTER_NAME,
  DEFAULT_EXPRESSION,
  DEFAULT_GUILD_NAME,
  DEFAULT_LANGUAGE,
  DEFAULT_PET_SLOT_CAPACITY,
  DEFAULT_PLAYER_NAME,
  EMPTY_EQUIPPED,
  GAME_VERSION,
} from '@core/data/game-config';

export const INITIAL_GAME_STATE: GameState = {
  version: GAME_VERSION,
  language: DEFAULT_LANGUAGE,
  affinity: 10,
  money: 100,
  energy: 100,
  satiety: 0,
  playerName: DEFAULT_PLAYER_NAME,
  guildName: DEFAULT_GUILD_NAME,
  hasCompletedIntro: false,
  knownRecipes: ['wood_sword_recipe', 'leather_shirt_recipe'],
  inventory: [
    { id: 'cheap_shirt', quantity: 1 },
    { id: 'cheap_pants', quantity: 1 },
    { id: 'bra_1', quantity: 1 },
    { id: 'pantsus_1', quantity: 1 },
    { id: 'wood_plank', quantity: 4 },
    { id: 'steel_ingot', quantity: 2 },
  ],
  equipped: {
    top: 'cheap_shirt',
    bottom: 'cheap_pants',
    suit: null,
    head: null,
    stockings: null,
    bra: 'bra_1',
    pantsus: 'pantsus_1',
    hands: null,
    weapon: null,
  },
  expression: { ...DEFAULT_EXPRESSION },
  characterName: DEFAULT_CHARACTER_NAME,
  pets: [],
  petSlotCapacity: DEFAULT_PET_SLOT_CAPACITY,
  activeMission: null,
  missionBoardSeed: Date.now(),
  missionFlags: [],
};

export function cloneInitialGameState(): GameState {
  return JSON.parse(JSON.stringify(INITIAL_GAME_STATE)) as GameState;
}

export function normalizeGameState(raw: Partial<GameState>): GameState {
  const defaults = cloneInitialGameState();
  return {
    ...defaults,
    ...raw,
    equipped: { ...defaults.equipped, ...raw.equipped },
    expression: { ...defaults.expression, ...raw.expression },
    inventory: raw.inventory ?? defaults.inventory,
    knownRecipes: raw.knownRecipes ?? defaults.knownRecipes,
    pets: raw.pets ?? defaults.pets,
    petSlotCapacity: raw.petSlotCapacity ?? defaults.petSlotCapacity,
    activeMission: raw.activeMission ?? null,
    missionBoardSeed: raw.missionBoardSeed ?? defaults.missionBoardSeed,
    missionFlags: raw.missionFlags ?? defaults.missionFlags,
  };
}

export function createEmptyEquippedState(): GameState['equipped'] {
  return { ...EMPTY_EQUIPPED };
}

export function createDefaultExpression(): GameState['expression'] {
  return {
    eyes: DEFAULT_EXPRESSION.eyes,
    mouth: DEFAULT_EXPRESSION.mouth,
  };
}
