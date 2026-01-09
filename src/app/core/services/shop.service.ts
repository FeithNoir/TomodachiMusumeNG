import { Injectable, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { InventoryService } from './inventory.service';
import { masterItemList } from '../data/item-database';
import { shopInventory } from '../data/shop-data'; // Assuming shopInventory is an array of item IDs

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  public availableShopItems = computed(() => {
    return shopInventory.map(itemId => masterItemList[itemId]);
  });

  constructor(
    private gameStateService: GameStateService,
    private inventoryService: InventoryService
  ) { }

  /**
   * Attempts to buy an item from the shop.
   * @param itemId The ID of the item to buy.
   * @param quantity The quantity to buy. Defaults to 1.
   * @returns True if the purchase was successful, false otherwise.
   */
  buyItem(itemId: string, quantity: number = 1): boolean {
    const itemData = masterItemList[itemId];
    if (!itemData || !itemData.buyPrice) {
      console.error(`Attempted to buy non-existent or non-purchasable item: ${itemId}`);
      return false;
    }

    const totalCost = itemData.buyPrice * quantity;
    if (this.gameStateService.money() < totalCost) {
      console.warn('Insufficient funds to buy item.');
      // TODO: Notify user
      return false;
    }

    // Check if inventory can hold the item
    if (!this.inventoryService.addItem(itemId, quantity)) {
      // addItem already handles notifications for full inventory/stack
      return false;
    }

    this.gameStateService.updateMoney(-totalCost);
    return true;
  }

  /**
   * Attempts to sell an item to the shop.
   * @param itemId The ID of the item to sell.
   * @param quantity The quantity to sell. Defaults to 1.
   * @returns True if the sale was successful, false otherwise.
   */
  sellItem(itemId: string, quantity: number = 1): boolean {
    const itemData = masterItemList[itemId];
    if (!itemData || !itemData.sellPrice) {
      console.error(`Attempted to sell non-existent or non-sellable item: ${itemId}`);
      return false;
    }

    const currentQuantity = this.inventoryService.getItemQuantity(itemId);
    if (currentQuantity < quantity) {
      console.warn('Not enough items in inventory to sell.');
      // TODO: Notify user
      return false;
    }

    // Prevent selling the last equipped item
    const equippedItems = Object.values(this.gameStateService.equipped());
    if (equippedItems.includes(itemId) && currentQuantity === quantity) {
      console.warn('Cannot sell the last unit of an equipped item.');
      // TODO: Notify user
      return false;
    }

    if (!this.inventoryService.removeItem(itemId, quantity)) {
      // removeItem already handles notifications for not enough items
      return false;
    }

    const totalGain = itemData.sellPrice * quantity;
    this.gameStateService.updateMoney(totalGain);
    return true;
  }
}