import { Component, computed, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';
import { GameStateService } from '../../core/services/game-state.service';
import { CharacterService } from '../../core/services/character.service';
import { InventoryService } from '../../core/services/inventory.service';
import { ItemCatalogService } from '../../core/services/item-catalog.service';
import { LocalizationService } from '../../core/services/localization.service';
import { Item } from '../../core/interfaces/item.interface';

type ShopViewMode = 'market' | 'buy' | 'sell' | 'sell-confirm';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  private shopService = inject(ShopService);
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);
  private characterService = inject(CharacterService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);

  @Output() closeShop = new EventEmitter<void>();

  public viewMode = signal<ShopViewMode>('market');
  public selectedItemToSell = signal<{ item: Item; quantity: number } | null>(null);
  public sellQuantityInput = signal<number>(1);
  public maxSellQuantity = signal<number>(1);

  public availableShopItems = this.shopService.availableShopItems;

  public sellableInventoryItems = computed(() =>
    this.inventoryService.inventory().filter(item => this.itemCatalog.getItem(item.id)?.sellPrice !== undefined)
  );

  public money = this.gameStateService.money;
  public Math = Math;
  readonly getText = this.localization.t.bind(this.localization);

  getItemData(itemId: string): Item | undefined {
    return this.itemCatalog.getItem(itemId);
  }

  getItemName(itemId: string): string {
    return this.itemCatalog.getItemName(itemId);
  }

  getItemPath(itemId: string): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  openMarket(): void {
    this.viewMode.set('market');
  }

  openBuy(): void {
    this.viewMode.set('buy');
  }

  openSell(): void {
    this.viewMode.set('sell');
  }

  openSellConfirmation(itemId: string): void {
    const itemInInventory = this.inventoryService.inventory().find(i => i.id === itemId);
    const itemData = this.getItemData(itemId);

    if (!itemInInventory || !itemData?.sellPrice) {
      return;
    }

    let maxQuantity = itemInInventory.quantity;
    const equippedItems = Object.values(this.characterService.equipped());
    if (equippedItems.includes(itemId)) {
      maxQuantity--;
    }

    if (maxQuantity < 1) {
      console.warn(this.getText('noSellEquippedMsg'));
      return;
    }

    this.selectedItemToSell.set({ item: itemData, quantity: itemInInventory.quantity });
    this.maxSellQuantity.set(maxQuantity);
    this.sellQuantityInput.set(1);
    this.viewMode.set('sell-confirm');
  }

  buyItem(itemId: string): void {
    if (this.shopService.buyItem(itemId, 1)) {
      console.log(this.getText('buySuccessMsg', this.getItemName(itemId)));
    }
  }

  confirmSell(): void {
    const itemToSell = this.selectedItemToSell();
    const quantity = this.sellQuantityInput();

    if (!itemToSell || quantity <= 0 || quantity > this.maxSellQuantity()) {
      console.warn(this.getText('invalidQuantityMsg'));
      return;
    }

    if (this.shopService.sellItem(itemToSell.item.id, quantity)) {
      const totalGain = itemToSell.item.sellPrice! * quantity;
      console.log(this.getText('sellSuccessMsg', quantity, this.getItemName(itemToSell.item.id), totalGain));
      this.viewMode.set('sell');
    }
  }

  onClose(): void {
    this.closeShop.emit();
    this.viewMode.set('market');
  }
}
