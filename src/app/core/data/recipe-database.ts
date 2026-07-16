import { Recipe } from '@core/interfaces/recipe.interface';
import { FOOD_AND_POTION_RECIPES } from '@core/data/food-recipes.database';

export const recipes: { [key: string]: Recipe } = {
  'steel_sword_recipe': {
    result: 'steel_sword',
    ingredients: [
      { id: 'steel_ingot', quantity: 3 },
      { id: 'wood_plank', quantity: 1 },
    ]
  },
  'wood_sword_recipe': {
    result: 'wooden_sword',
    ingredients: [
      { id: 'wood_plank', quantity: 3 },
      { id: 'steel_ingot', quantity: 1 },
    ]
  },
  'leather_shirt_recipe': {
    result: 'leather_shirt',
    ingredients: [
      { id: 'wood_plank', quantity: 2 }
    ]
  },
  'leather_skirt_recipe': {
    result: 'leather_skirt',
    ingredients: [{ id: 'wood_plank', quantity: 2 }],
  },
  'bread_recipe': {
    result: 'bread',
    ingredients: [{ id: 'wheat', quantity: 2 }],
  },
  'steak_recipe': {
    result: 'grilled_steak',
    ingredients: [{ id: 'meat', quantity: 2 }, { id: 'wheat', quantity: 1 }],
  },
  'omelette_recipe': {
    result: 'omelette',
    ingredients: [{ id: 'eggs', quantity: 2 }, { id: 'wheat', quantity: 1 }],
  },
  'guacamole_recipe': {
    result: 'guacamole',
    ingredients: [{ id: 'avocado', quantity: 2 }],
  },
  ...FOOD_AND_POTION_RECIPES,
};
