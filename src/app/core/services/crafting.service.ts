import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { InventoryService } from './inventory.service';
import { recipes } from '../data/recipe-database';
import { masterItemList } from '../data/item-database';

@Injectable({
  providedIn: 'root'
})
export class CraftingService {

  constructor(
    private gameStateService: GameStateService,
    private inventoryService: InventoryService
  ) { }

  /**
   * Attempts to craft an item based on the provided ingredients.
   * @param ingredientIds An array of item IDs representing the ingredients in the crafting slots.
   * @returns The ID of the crafted item if successful, null otherwise.
   */
  attemptCraft(ingredientIds: string[]): string | null {
    const ingredientsInSlots = ingredientIds.filter(id => id !== null).reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    let craftedItem: string | null = null;

    for (const recipeId in recipes) {
      const recipe = recipes[recipeId];
      const requiredIngredients = recipe.ingredients.reduce((acc, ing) => ({ ...acc, [ing.id]: ing.quantity }), {} as { [key: string]: number });

      // Check if the ingredients match
      const requiredKeys = Object.keys(requiredIngredients);
      const providedKeys = Object.keys(ingredientsInSlots);

      // Ensure same number of unique ingredients and same quantities
      if (requiredKeys.length === providedKeys.length &&
          requiredKeys.every(key => requiredIngredients[key] === ingredientsInSlots[key])) {

        // Verify player has all required ingredients in inventory
        const hasAllIngredients = recipe.ingredients.every(ing =>
          this.inventoryService.hasItem(ing.id, ing.quantity)
        );

        if (hasAllIngredients) {
          craftedItem = recipe.result;
          // Found a match and player has ingredients, break and craft
          break;
        }
      }
    }

    if (craftedItem) {
      // Consume ingredients from inventory
      Object.entries(ingredientsInSlots).forEach(([itemId, quantity]) => {
        this.inventoryService.removeItem(itemId, quantity);
      });

      // Add crafted item to inventory
      this.inventoryService.addItem(craftedItem, 1);

      // Learn the recipe if it's a new one
      const craftedItemData = masterItemList[craftedItem];
      if (craftedItemData.recipeId && !this.gameStateService.gameState().knownRecipes.includes(craftedItemData.recipeId)) {
        this.gameStateService.addKnownRecipe(craftedItemData.recipeId);
      }

      return craftedItem;
    } else {
      return null;
    }
  }
}