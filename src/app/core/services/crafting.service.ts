import { inject, Injectable } from '@angular/core';
import { recipes } from '@core/data/recipe-database';
import { CraftSlotEntry } from '@core/interfaces/craft-slot.interface';
import { Recipe } from '@core/interfaces/recipe.interface';
import { GameStateService } from '@core/services/game-state.service';
import { InventoryService } from '@core/services/inventory.service';
import { masterItemList } from '@core/data/item-database';
import { ItemCatalogService } from '@core/services/item-catalog.service';

@Injectable({
  providedIn: 'root',
})
export class CraftingService {
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);
  private itemCatalog = inject(ItemCatalogService);

  getKnownRecipes(): { recipeId: string; recipe: Recipe }[] {
    return this.gameStateService
      .gameState()
      .knownRecipes.map(recipeId => ({ recipeId, recipe: recipes[recipeId] }))
      .filter(entry => entry.recipe);
  }

  getRecipe(recipeId: string): Recipe | undefined {
    return recipes[recipeId];
  }

  buildSlotsFromRecipe(recipeId: string): CraftSlotEntry[] | null {
    const recipe = recipes[recipeId];
    if (!recipe) {
      return null;
    }

    return recipe.ingredients.map(ing => ({
      itemId: ing.id,
      requiredQty: ing.quantity,
    }));
  }

  attemptCraftFromSlots(slots: CraftSlotEntry[]): string | null {
    const filled = slots.filter(slot => slot.itemId && slot.requiredQty > 0);
    if (filled.length === 0) {
      return null;
    }

    const ingredientsInSlots = filled.reduce(
      (acc, slot) => {
        acc[slot.itemId] = (acc[slot.itemId] || 0) + slot.requiredQty;
        return acc;
      },
      {} as Record<string, number>
    );

    let craftedItem: string | null = null;
    let matchedRecipeId: string | null = null;

    for (const recipeId in recipes) {
      const recipe = recipes[recipeId];
      const requiredIngredients = recipe.ingredients.reduce(
        (acc, ing) => ({ ...acc, [ing.id]: ing.quantity }),
        {} as Record<string, number>
      );

      const requiredKeys = Object.keys(requiredIngredients);
      const providedKeys = Object.keys(ingredientsInSlots);

      if (
        requiredKeys.length === providedKeys.length &&
        requiredKeys.every(key => requiredIngredients[key] === ingredientsInSlots[key])
      ) {
        const hasAllIngredients = recipe.ingredients.every(ing =>
          this.inventoryService.hasItem(ing.id, ing.quantity)
        );

        if (hasAllIngredients) {
          craftedItem = recipe.result;
          matchedRecipeId = recipeId;
          break;
        }
      }
    }

    if (!craftedItem) {
      return null;
    }

    for (const slot of filled) {
      this.inventoryService.removeItem(slot.itemId, slot.requiredQty);
    }

    this.inventoryService.addItem(craftedItem, 1);

    const craftedItemData = masterItemList[craftedItem];
    if (craftedItemData?.recipeId && !this.gameStateService.gameState().knownRecipes.includes(craftedItemData.recipeId)) {
      this.gameStateService.addKnownRecipe(craftedItemData.recipeId);
    }

    if (matchedRecipeId && !this.gameStateService.gameState().knownRecipes.includes(matchedRecipeId)) {
      this.gameStateService.addKnownRecipe(matchedRecipeId);
    }

    return craftedItem;
  }

  /** @deprecated Prefer attemptCraftFromSlots */
  attemptCraft(ingredientIds: string[]): string | null {
    const slots: CraftSlotEntry[] = ingredientIds
      .filter((id): id is string => id !== null)
      .map(id => ({ itemId: id, requiredQty: 1 }));
    return this.attemptCraftFromSlots(slots);
  }

  getResultName(recipeId: string): string {
    const recipe = recipes[recipeId];
    if (!recipe) {
      return recipeId;
    }
    return this.itemCatalog.getItemName(recipe.result, this.gameStateService.language());
  }
}
