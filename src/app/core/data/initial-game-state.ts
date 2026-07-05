import { GameState } from '@core/interfaces/game-state.interface';
import {
  DEFAULT_CHARACTER_NAME,
  DEFAULT_EXPRESSION,
  DEFAULT_GUILD_NAME,
  DEFAULT_LANGUAGE,
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
  inventory: [
    { id: 'cheap_shirt', quantity: 1 },
    { id: 'cheap_pants', quantity: 1 },
    { id: 'bra_1', quantity: 1 },
    { id: 'pantsus_1', quantity: 1 },
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
  knownRecipes: [],
  expression: { ...DEFAULT_EXPRESSION },
  characterName: DEFAULT_CHARACTER_NAME,
};

export function cloneInitialGameState(): GameState {
  return JSON.parse(JSON.stringify(INITIAL_GAME_STATE)) as GameState;
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
