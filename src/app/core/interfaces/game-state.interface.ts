import { ActiveMission } from '@core/interfaces/mission-definition.interface';
import { CharacterStats } from '@core/interfaces/character-stats.interface';
import { Pet, IncubatingEgg } from '@core/interfaces/pet.interface';
import { ActiveTemporaryEffect } from '@core/interfaces/temporary-effect.interface';

export interface GameState {
  version: string;
  language: string;
  affinity: number;
  money: number;
  energy: number;
  satiety: number;
  playerName: string;
  guildName: string;
  hasCompletedIntro: boolean;
  inventory: { id: string; quantity: number }[];
  equipped: {
    top: string | null;
    bottom: string | null;
    suit: string | null;
    head: string | null;
    stockings: string | null;
    bra: string | null;
    pantsus: string | null;
    hands: string | null;
    weapon: string | null;
  };
  knownRecipes: string[];
  expression: { eyes: string; mouth: string };
  characterName: string;
  pets: Pet[];
  incubatingEggs: IncubatingEgg[];
  petSlotCapacity: number;
  inventorySlotCapacity: number;
  activeMissions: ActiveMission[];
  /** Best distance (meters) in the runner minigame. */
  runnerHighScoreMeters: number;
  /** Endurance tiers already granted from runner (1 per 2000m of high score). */
  runnerEnduranceGranted: number;
  /** Permanent stat bonuses from training minigames. */
  trainingStatBonus: Partial<CharacterStats>;
  /** Timed stat boosts on Eleanora from food and potions. */
  characterTemporaryEffects: ActiveTemporaryEffect[];
  /** Tutorial ids the player has seen. */
  seenTutorials: string[];
  /** Seed for deterministic random mission slots between sessions. */
  missionBoardSeed: number;
  /** Unlocked conditional / one-time mission ids. */
  missionFlags: string[];
  /** Completed one-time date event ids. */
  completedDateEvents: string[];
}
