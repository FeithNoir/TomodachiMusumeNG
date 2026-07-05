import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from '@core/services/game-state.service';
import { CharacterService } from '@core/services/character.service';
import { InventoryService } from '@core/services/inventory.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { shopInventory } from '@core/data/shop-data';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);
  private characterService = inject(CharacterService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  public availableShopItems = computed(() => shopInventory);

  buyItem(itemId: string, quantity: number = 1): boolean {
    const itemData = this.itemCatalog.getItem(itemId);
    if (!itemData?.buyPrice) {
      return false;
    }

    const totalCost = itemData.buyPrice * quantity;
    if (this.gameStateService.money() < totalCost) {
      this.notifications.warning(this.localization.t('fundsInsufficientMsg'));
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
