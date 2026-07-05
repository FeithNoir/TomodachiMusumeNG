import { Injectable, computed, inject } from '@angular/core';
import { PET_SLOT_UPGRADE_ITEM_ID, INVENTORY_SLOT_UPGRADE_ITEM_ID, INVENTORY_SLOT_UPGRADE_AMOUNT } from '@core/data/game-config';
import { isShopSpecialItem, SHOP_SPECIAL_ITEMS } from '@core/data/shop-special-items';
import { shopInventory } from '@core/data/shop-catalog';
import '@core/data/shop-data';
import { GameStateService } from '@core/services/game-state.service';
import { CharacterService } from '@core/services/character.service';
import { InventoryService } from '@core/services/inventory.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { PetService } from '@core/services/pet.service';

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
  private petService = inject(PetService);

  public availableShopItems = computed(() => [
    ...shopInventory,
    ...SHOP_SPECIAL_ITEMS.map(item => item.id),
  ]);

  buyItem(itemId: string, quantity: number = 1): boolean {
    if (isShopSpecialItem(itemId)) {
      return this.buySpecialItem(itemId);
    }

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
    if (equippedItems.includes(itemId)) {
      return false;
    }

    if (!this.inventoryService.removeItem(itemId, quantity)) {
      return false;
    }

    const totalGain = itemData.sellPrice * quantity;
    this.gameStateService.updateMoney(totalGain);
    return true;
  }

  getSpecialShopItem(itemId: string) {
    return SHOP_SPECIAL_ITEMS.find(item => item.id === itemId);
  }

  private buySpecialItem(itemId: string): boolean {
    const special = this.getSpecialShopItem(itemId);
    if (!special) {
      return false;
    }

    if (this.gameStateService.money() < special.buyPrice) {
      this.notifications.warning(this.localization.t('fundsInsufficientMsg'));
      return false;
    }

    if (itemId === PET_SLOT_UPGRADE_ITEM_ID) {
      this.gameStateService.updateMoney(-special.buyPrice);
      this.petService.expandSlotCapacity();
      return true;
    }

    if (itemId === INVENTORY_SLOT_UPGRADE_ITEM_ID) {
      this.gameStateService.updateMoney(-special.buyPrice);
      this.expandInventoryCapacity();
      return true;
    }

    if (special.type === 'egg' && special.eggId) {
      this.gameStateService.updateMoney(-special.buyPrice);
      return this.petService.acquireEgg(special.eggId);
    }

    return false;
  }

  private expandInventoryCapacity(amount: number = INVENTORY_SLOT_UPGRADE_AMOUNT): void {
    this.gameStateService.updateState(state => ({
      ...state,
      inventorySlotCapacity: state.inventorySlotCapacity + amount,
    }));
    this.notifications.success(this.localization.t('inventorySlotExpandedMsg'));
  }
}
