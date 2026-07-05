import { Injectable, computed, inject } from '@angular/core';
import { INVENTORY_MAX_STACK_SIZE } from '@core/data/game-config';
import { GameStateService } from '@core/services/game-state.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private gameStateService = inject(GameStateService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  public inventory = computed(() => this.gameStateService.inventory());
  public maxSlots = computed(() => this.gameStateService.gameState().inventorySlotCapacity);

  addItem(itemId: string, quantity: number = 1): boolean {
    const currentInventory = this.gameStateService.gameState().inventory;
    const itemData = this.itemCatalog.getItem(itemId);
    const maxSlots = this.maxSlots();

    if (!itemData) {
      console.error(
        `Attempted to add non-existent item: ${itemId}. ` +
          'Ensure the id exists in masterItemList and matches recipe/mission references.'
      );
      return false;
    }

    const existingItemIndex = currentInventory.findIndex(item => item.id === itemId);

    if (existingItemIndex !== -1) {
      const existingItem = currentInventory[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity <= INVENTORY_MAX_STACK_SIZE) {
        const updatedInventory = [...currentInventory];
        updatedInventory[existingItemIndex] = { ...existingItem, quantity: newQuantity };
        this.gameStateService.updateInventory(updatedInventory);
        return true;
      }

      this.notifications.warning(
        this.localization.t('stackFullMsg', this.localization.itemName(itemId))
      );
      return false;
    }

    if (currentInventory.length < maxSlots) {
      const updatedInventory = [...currentInventory, { id: itemId, quantity }];
      this.gameStateService.updateInventory(updatedInventory);
      return true;
    }

    this.notifications.warning(this.localization.t('inventoryFullMsg'));
    return false;
  }

  removeItem(itemId: string, quantity: number = 1): boolean {
    const currentInventory = this.gameStateService.gameState().inventory;
    const existingItemIndex = currentInventory.findIndex(item => item.id === itemId);

    if (existingItemIndex === -1) {
      return false;
    }

    const existingItem = currentInventory[existingItemIndex];

    if (existingItem.quantity < quantity) {
      return false;
    }

    const updatedInventory = [...currentInventory];
    if (existingItem.quantity - quantity <= 0) {
      updatedInventory.splice(existingItemIndex, 1);
    } else {
      updatedInventory[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity - quantity };
    }

    this.gameStateService.updateInventory(updatedInventory);
    return true;
  }

  hasItem(itemId: string, quantity: number = 1): boolean {
    const currentInventory = this.gameStateService.gameState().inventory;
    const item = currentInventory.find(i => i.id === itemId);
    return item ? item.quantity >= quantity : false;
  }

  getItemQuantity(itemId: string): number {
    const currentInventory = this.gameStateService.gameState().inventory;
    const item = currentInventory.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  }
}
