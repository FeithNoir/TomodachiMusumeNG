import { Injectable, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Item } from '../interfaces/item.interface';
import { masterItemList } from '../data/item-database';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly MAX_INVENTORY_SLOTS = 20;
  private readonly MAX_STACK_SIZE = 10;

  // Expose inventory as a computed signal from GameStateService
  public inventory = computed(() => this.gameStateService.inventory());

  constructor(private gameStateService: GameStateService) { }

  /**
   * Adds an item to the inventory.
   * @param itemId The ID of the item to add.
   * @param quantity The quantity to add. Defaults to 1.
   * @returns True if the item was added, false otherwise (e.g., inventory full, stack full).
   */
  addItem(itemId: string, quantity: number = 1): boolean {
    const currentInventory = this.gameStateService.gameState().inventory;
    const itemData = masterItemList[itemId];

    if (!itemData) {
      console.error(`Attempted to add non-existent item: ${itemId}`);
      return false;
    }

    const existingItemIndex = currentInventory.findIndex(item => item.id === itemId);

    if (existingItemIndex !== -1) {
      // Item already exists, try to stack
      const existingItem = currentInventory[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity <= this.MAX_STACK_SIZE) {
        const updatedInventory = [...currentInventory];
        updatedInventory[existingItemIndex] = { ...existingItem, quantity: newQuantity };
        this.gameStateService.updateInventory(updatedInventory);
        return true;
      } else {
        // Stack is full
        console.warn(`Stack for ${itemData.name.en} is full.`);
        // TODO: Notify user
        return false;
      }
    } else {
      // Item does not exist, add as a new slot
      if (currentInventory.length < this.MAX_INVENTORY_SLOTS) {
        const updatedInventory = [...currentInventory, { id: itemId, quantity }];
        this.gameStateService.updateInventory(updatedInventory);
        return true;
      } else {
        // Inventory slots are full
        console.warn('Inventory is full. No space for new item type.');
        // TODO: Notify user
        return false;
      }
    }
  }

  /**
   * Removes an item from the inventory.
   * @param itemId The ID of the item to remove.
   * @param quantity The quantity to remove. Defaults to 1.
   * @returns True if items were removed, false otherwise (e.g., not enough items).
   */
  removeItem(itemId: string, quantity: number = 1): boolean {
    const currentInventory = this.gameStateService.gameState().inventory;
    const existingItemIndex = currentInventory.findIndex(item => item.id === itemId);

    if (existingItemIndex === -1) {
      console.warn(`Attempted to remove non-existent item from inventory: ${itemId}`);
      return false;
    }

    const existingItem = currentInventory[existingItemIndex];
    if (existingItem.quantity < quantity) {
      console.warn(`Not enough ${masterItemList[itemId].name.en} to remove.`);
      // TODO: Notify user
      return false;
    }

    const updatedInventory = [...currentInventory];
    if (existingItem.quantity - quantity <= 0) {
      // Remove item completely if quantity drops to 0 or less
      updatedInventory.splice(existingItemIndex, 1);
    } else {
      // Decrease quantity
      updatedInventory[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity - quantity };
    }

    this.gameStateService.updateInventory(updatedInventory);
    return true;
  }

  /**
   * Checks if the player has a certain quantity of an item.
   * @param itemId The ID of the item to check.
   * @param quantity The required quantity. Defaults to 1.
   * @returns True if the player has the required quantity, false otherwise.
   */
  hasItem(itemId: string, quantity: number = 1): boolean {
    const currentInventory = this.gameStateService.gameState().inventory;
    const item = currentInventory.find(i => i.id === itemId);
    return item ? item.quantity >= quantity : false;
  }

  /**
   * Gets the quantity of a specific item in the inventory.
   * @param itemId The ID of the item.
   * @returns The quantity of the item, or 0 if not found.
   */
  getItemQuantity(itemId: string): number {
    const currentInventory = this.gameStateService.gameState().inventory;
    const item = currentInventory.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  }
}