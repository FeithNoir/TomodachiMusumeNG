export interface FoodPreferences {
  likes: string[];
  dislikes: string[];
}

export type FoodPreferenceResult = 'liked' | 'disliked' | 'neutral';
