import { generatePetFoodPreferences } from '@core/utils/food-preferences.util';
import { GameState } from '@core/interfaces/game-state.interface';
import { ActiveMission } from '@core/interfaces/mission-definition.interface';
import {
  DEFAULT_CHARACTER_NAME,
  DEFAULT_EXPRESSION,
  DEFAULT_GUILD_NAME,
  DEFAULT_LANGUAGE,
  DEFAULT_PET_SLOT_CAPACITY,
  INVENTORY_MAX_SLOTS,
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
  incubatingEggs: [],
  petSlotCapacity: DEFAULT_PET_SLOT_CAPACITY,
  inventorySlotCapacity: INVENTORY_MAX_SLOTS,
  activeMissions: [],
  runnerHighScoreMeters: 0,
  runnerEnduranceGranted: 0,
  trainingStatBonus: {},
  characterTemporaryEffects: [],
  seenTutorials: [],
  missionBoardSeed: Date.now(),
  missionFlags: [],
  completedDateEvents: [],
};

export function cloneInitialGameState(): GameState {
  return JSON.parse(JSON.stringify(INITIAL_GAME_STATE)) as GameState;
}

export function normalizeGameState(raw: Partial<GameState> & { activeMission?: ActiveMission | null }): GameState {
  const defaults = cloneInitialGameState();
  const legacyMission = raw.activeMission;
  const activeMissions =
    raw.activeMissions ??
    (legacyMission ? [legacyMission] : defaults.activeMissions);

  return {
    ...defaults,
    ...raw,
    equipped: { ...defaults.equipped, ...raw.equipped },
    expression: { ...defaults.expression, ...raw.expression },
    inventory: raw.inventory ?? defaults.inventory,
    knownRecipes: raw.knownRecipes ?? defaults.knownRecipes,
    pets: (raw.pets ?? defaults.pets).map(pet => ({
      ...pet,
      bond: pet.bond ?? 50,
      foodPreferences: pet.foodPreferences ?? generatePetFoodPreferences(pet.id),
      temporaryEffects: pet.temporaryEffects ?? [],
    })),
    incubatingEggs: raw.incubatingEggs ?? defaults.incubatingEggs,
    petSlotCapacity: raw.petSlotCapacity ?? defaults.petSlotCapacity,
    inventorySlotCapacity: raw.inventorySlotCapacity ?? defaults.inventorySlotCapacity,
    activeMissions,
    runnerHighScoreMeters: raw.runnerHighScoreMeters ?? defaults.runnerHighScoreMeters,
    runnerEnduranceGranted: raw.runnerEnduranceGranted ?? defaults.runnerEnduranceGranted,
    trainingStatBonus: raw.trainingStatBonus ?? defaults.trainingStatBonus,
    characterTemporaryEffects: raw.characterTemporaryEffects ?? defaults.characterTemporaryEffects,
    seenTutorials: raw.seenTutorials ?? defaults.seenTutorials,
    missionBoardSeed: raw.missionBoardSeed ?? defaults.missionBoardSeed,
    missionFlags: raw.missionFlags ?? defaults.missionFlags,
    completedDateEvents: raw.completedDateEvents ?? defaults.completedDateEvents,
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
