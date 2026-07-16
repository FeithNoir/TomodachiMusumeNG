import { FoodPreferences } from '@core/interfaces/food-preferences.interface';

/** Eleanora's fixed taste profile — item ids. */
export const ELEANORA_FOOD_PREFERENCES: FoodPreferences = {
  likes: ['omelette', 'guacamole', 'fruit_salad', 'chocolate_bar', 'chicken_rice'],
  dislikes: ['grilled_steak', 'fried_potatoes', 'energy_drink'],
};

/** Pool used to roll random pet preferences on hatch. */
export const PET_FOOD_PREFERENCE_POOL = [
  'bread',
  'omelette',
  'grilled_steak',
  'guacamole',
  'fruit_salad',
  'vegetable_soup',
  'chicken_rice',
  'chocolate_bar',
  'fried_potatoes',
  'rice_bowl',
  'apple',
  'banana',
  'carrot',
  'potato',
  'meat',
  'eggs',
];

export const FEEDING_AFFINITY_LIKED = 3;
export const FEEDING_AFFINITY_DISLIKED = -2;
export const FEEDING_PET_BOND_LIKED = 5;
export const FEEDING_PET_BOND_DISLIKED = -3;
