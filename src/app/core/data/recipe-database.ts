import { Recipe } from '../interfaces/recipe.interface';

export const recipes: { [key: string]: Recipe } = {
  'steel_sword_recipe': {
    result: 'steel_sword',
    ingredients: [
      { id: 'steel_ingot', quantity: 3 },
      { id: 'wood_plank', quantity: 1 },
    ]
  },
  'wood_sword_recipe': {
    result: 'wood_sword',
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
    ingredients:
      [
        { id: 'wood_plank', quantity: 2 }
      ]
  },
  // Aquí se podrían añadir más recetas...
};
