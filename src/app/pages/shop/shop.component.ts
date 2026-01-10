import { Component, computed, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';
import { GameStateService } from '../../core/services/game-state.service';
import { InventoryService } from '../../core/services/inventory.service';
import { masterItemList } from '../../core/data/item-database';
import { Item, LocalizedText } from '../../core/interfaces/item.interface';

type ShopViewMode = 'market' | 'buy' | 'sell' | 'sell-confirm';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  private shopService = inject(ShopService);
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);

  @Output() closeShop = new EventEmitter<void>();

  public viewMode = signal<ShopViewMode>('market');
  public selectedItemToSell = signal<{ item: Item, quantity: number } | null>(null);
  public sellQuantityInput = signal<number>(1);
  public maxSellQuantity = signal<number>(1);

  // Nota: Si shopService devuelve IDs, esto está bien. Si devuelve objetos Item, el HTML debe ajustarse.
  public availableShopItems = this.shopService.availableShopItems;

  public sellableInventoryItems = computed(() => {
    return this.inventoryService.inventory().filter(item => masterItemList[item.id].sellPrice !== undefined);
  });

  // Mantenemos language aquí porque se usa en los helpers locales (getItemName)
  public language = this.gameStateService.language;
  public money = this.gameStateService.money;

  constructor() { }

  // --- MÉTODOS AUXILIARES ---

  /**
   * Delega la obtención de textos al servicio.
   * Esto mantiene el HTML limpio usando la misma sintaxis {{ getText(...) }}
   */
  getText(key: string, ...args: any[]): string {
    return this.shopService.getText(key, ...args);
  }

  getItemData(itemId: string): Item {
    return masterItemList[itemId];
  }

  getItemName(itemId: string): string {
    const item = masterItemList[itemId];
    const currentLang = this.language() as keyof LocalizedText;
    return item?.name[currentLang] || item?.name['en'] || itemId;
  }

  // --- TRANSICIONES DE VISTA ---

  openMarket(): void { this.viewMode.set('market'); }
  openBuy(): void { this.viewMode.set('buy'); }
  openSell(): void { this.viewMode.set('sell'); }

  openSellConfirmation(itemId: string): void {
    const itemInInventory = this.inventoryService.inventory().find(i => i.id === itemId);
    const itemData = this.getItemData(itemId);

    if (!itemInInventory || !itemData.sellPrice) return;

    let maxQuantity = itemInInventory.quantity;
    const equippedItems = Object.values(this.gameStateService.equipped());
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

  // --- ACCIONES ---

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
