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
}
