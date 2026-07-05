import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { CharacterService } from './character.service';
import { InventoryService } from './inventory.service';
import { ItemCatalogService } from './item-catalog.service';
import { LocalizationService } from './localization.service';
import { shopInventory } from '../data/shop-data';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);
  private characterService = inject(CharacterService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);

  public availableShopItems = computed(() => shopInventory);

  buyItem(itemId: string, quantity: number = 1): boolean {
    const itemData = this.itemCatalog.getItem(itemId);
    if (!itemData?.buyPrice) {
      return false;
    }

    const totalCost = itemData.buyPrice * quantity;
    if (this.gameStateService.money() < totalCost) {
      console.warn(this.localization.t('fundsInsufficientMsg'));
      return false;
    }

    if (!this.inventoryService.addItem(itemId, quantity)) {
      return false;
    }

    this.gameStateService.updateMoney(-totalCost);
    return true;
  }

  sellItem(itemId: string, quantity: number = 1): boolean {
    const itemData = this.itemCatalog.getItem(itemId);
    if (!itemData?.sellPrice) {
      return false;
    }

    const currentQuantity = this.inventoryService.getItemQuantity(itemId);
    if (currentQuantity < quantity) {
      return false;
    }

    const equippedItems = Object.values(this.characterService.equipped());
    if (equippedItems.includes(itemId) && currentQuantity === quantity) {
      return false;
    }

    if (!this.inventoryService.removeItem(itemId, quantity)) {
      return false;
    }

    const totalGain = itemData.sellPrice * quantity;
    this.gameStateService.updateMoney(totalGain);
    return true;
  }
}
