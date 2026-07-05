export interface MissionReward {
  moneyEarned: number;
  itemsFound: { id: string; quantity: number }[];
  recipesFound: string[];
  messageKey: string;
}
