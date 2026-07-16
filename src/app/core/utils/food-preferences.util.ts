import { FoodPreferences } from '@core/interfaces/food-preferences.interface';
import { PET_FOOD_PREFERENCE_POOL } from '@core/data/food-preferences.config';

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickUnique(pool: string[], count: number, rng: () => number): string[] {
  const copy = [...pool];
  const picked: string[] = [];
  while (picked.length < count && copy.length > 0) {
    const index = Math.floor(rng() * copy.length);
    picked.push(copy.splice(index, 1)[0]);
  }
  return picked;
}

export function generatePetFoodPreferences(petId: string): FoodPreferences {
  const seed = hashSeed(petId);
  let state = seed;
  const rng = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };

  const likes = pickUnique(PET_FOOD_PREFERENCE_POOL, 2 + Math.floor(rng() * 2), rng);
  const dislikePool = PET_FOOD_PREFERENCE_POOL.filter(id => !likes.includes(id));
  const dislikes = pickUnique(dislikePool, 1 + Math.floor(rng() * 2), rng);

  return { likes, dislikes };
}

export function resolveFoodPreference(
  itemId: string,
  preferences: FoodPreferences
): 'liked' | 'disliked' | 'neutral' {
  if (preferences.likes.includes(itemId)) {
    return 'liked';
  }
  if (preferences.dislikes.includes(itemId)) {
    return 'disliked';
  }
  return 'neutral';
}
