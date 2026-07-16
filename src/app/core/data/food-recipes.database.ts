import { Recipe } from '@core/interfaces/recipe.interface';

export const FOOD_AND_POTION_RECIPES: { [key: string]: Recipe } = {
  rice_bowl_recipe: {
    result: 'rice_bowl',
    ingredients: [{ id: 'rice', quantity: 2 }],
  },
  vegetable_soup_recipe: {
    result: 'vegetable_soup',
    ingredients: [
      { id: 'potato', quantity: 1 },
      { id: 'carrot', quantity: 1 },
      { id: 'onion', quantity: 1 },
    ],
  },
  chicken_rice_recipe: {
    result: 'chicken_rice',
    ingredients: [
      { id: 'rice', quantity: 2 },
      { id: 'chicken', quantity: 1 },
      { id: 'carrot', quantity: 1 },
    ],
  },
  fried_potatoes_recipe: {
    result: 'fried_potatoes',
    ingredients: [{ id: 'potato', quantity: 2 }, { id: 'seeds', quantity: 1 }],
  },
  fruit_salad_recipe: {
    result: 'fruit_salad',
    ingredients: [
      { id: 'apple', quantity: 1 },
      { id: 'banana', quantity: 1 },
      { id: 'avocado', quantity: 1 },
    ],
  },
  chocolate_bar_recipe: {
    result: 'chocolate_bar',
    ingredients: [
      { id: 'cocoa', quantity: 2 },
      { id: 'sugar_cane', quantity: 1 },
      { id: 'seeds', quantity: 1 },
    ],
  },
  health_potion_recipe: {
    result: 'health_potion',
    ingredients: [{ id: 'seeds', quantity: 2 }, { id: 'apple', quantity: 1 }],
  },
  strength_potion_recipe: {
    result: 'strength_potion',
    ingredients: [{ id: 'meat', quantity: 1 }, { id: 'seeds', quantity: 2 }],
  },
  agility_potion_recipe: {
    result: 'agility_potion',
    ingredients: [{ id: 'carrot', quantity: 2 }, { id: 'seeds', quantity: 2 }],
  },
  energy_potion_recipe: {
    result: 'energy_potion',
    ingredients: [
      { id: 'sugar_cane', quantity: 1 },
      { id: 'seeds', quantity: 2 },
      { id: 'tomato', quantity: 1 },
    ],
  },
  master_elixir_recipe: {
    result: 'master_elixir',
    ingredients: [
      { id: 'health_potion', quantity: 1 },
      { id: 'strength_potion', quantity: 1 },
      { id: 'agility_potion', quantity: 1 },
      { id: 'cocoa', quantity: 1 },
    ],
  },
};
