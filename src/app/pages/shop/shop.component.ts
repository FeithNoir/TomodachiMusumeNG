import { Component, computed, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For ngModel
import { ShopService } from '../../core/services/shop.service';
import { GameStateService } from '../../core/services/game-state.service';
import { InventoryService } from '../../core/services/inventory.service';
import { masterItemList } from '../../core/data/item-database';
import { Item, LocalizedText } from '../../core/interfaces/item.interface';

type ShopViewMode = 'market' | 'buy' | 'sell' | 'sell-confirm';

// This would ideally come from a dedicated i18n service
const UI_TEXTS = {
  marketTitle: { es: "Mercado", en: "Market" },
  marketPrompt: { es: "¿Qué te gustaría hacer?", en: "What would you like to do?" },
  buy: { es: "Comprar", en: "Buy" },
  sell: { es: "Vender", en: "Sell" },
  buyTitle: { es: "Comprar Objetos", en: "Buy Items" },
  sellTitle: { es: "Vender Objetos", en: "Sell Items" },
  sellConfirmTitle: { es: "Vender Objeto", en: "Sell Item" },
  sellConfirmPrompt: { es: "¿Cuántos quieres vender?", en: "How many do you want to sell?" },
  confirmSell: { es: "Confirmar Venta", en: "Confirm Sale" },
  cancel: { es: "Cancelar", en: "Cancel" },
  close: { es: "Cerrar", en: "Close" },
  back: { es: "Volver", en: "Back" },
  fundsInsufficient: { es: "Fondos Insuficientes", en: "Insufficient Funds" },
  fundsInsufficientMsg: { es: "No tienes suficiente dinero para comprar esto.", en: "You don't have enough money to buy this." },
  inventoryFull: { es: "Inventario Lleno", en: "Inventory Full" },
  inventoryFullMsg: { es: "No tienes espacio para un nuevo tipo de objeto.", en: "You don't have space for a new type of item." },
  stackFull: { es: "Pila Llena", en: "Stack Full" },
  stackFullMsg: (name: string) => ({ es: `Ya tienes el máximo de ${name}.`, en: `You already have the maximum amount of ${name}.` }),
  buySuccess: { es: "Compra Exitosa", en: "Purchase Successful" },
  buySuccessMsg: (name: string) => ({ es: `¡Has comprado ${name}!`, en: `You bought ${name}!` }),
  sellSuccess: { es: "Venta Exitosa", en: "Sale Successful" },
  sellSuccessMsg: (qty: number, name: string, price: number) => ({ es: `¡Has vendido ${qty}x ${name} por $${price}!`, en: `You sold ${qty}x ${name} for $${price}!` }),
  noSellEquipped: { es: "No se puede vender", en: "Cannot Sell" },
  noSellEquippedMsg: { es: "No puedes vender la última unidad de un objeto que llevas equipado.", en: "You can't sell the last unit of an equipped item." },
  noItemsToSell: { es: "No tienes nada que vender.", en: "You have nothing to sell." },
  invalidQuantity: { es: "Cantidad Inválida", en: "Invalid Quantity" },
  invalidQuantityMsg: { es: "Por favor, introduce una cantidad válida para vender.", en: "Please enter a valid quantity to sell." }),
};

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

  public availableShopItems = this.shopService.availableShopItems;
  public sellableInventoryItems = computed(() => {
    return this.inventoryService.inventory().filter(item => masterItemList[item.id].sellPrice !== undefined);
  });
  public language = this.gameStateService.language;
  public money = this.gameStateService.money;

  constructor() { }

  getText(key: keyof typeof UI_TEXTS, ...args: any[]): string {
    const currentLang = this.language();
    const textEntry = UI_TEXTS[key];

    if (textEntry) {
      if (typeof textEntry === 'function') {
        return textEntry(...args)[currentLang as keyof LocalizedText] || textEntry(...args)['en'];
      } else {
        return textEntry[currentLang as keyof LocalizedText] || textEntry['en'];
      }
    }
    return key;
  }

  getItemData(itemId: string): Item {
    return masterItemList[itemId];
  }

  // --- View Mode Transitions ---
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

    if (!itemInInventory || !itemData.sellPrice) {
      console.error('Attempted to sell non-existent or non-sellable item.');
      return;
    }

    let maxQuantity = itemInInventory.quantity;
    // Prevent selling the last equipped item
    const equippedItems = Object.values(this.gameStateService.equipped());
    if (equippedItems.includes(itemId)) {
      maxQuantity--;
    }

    if (maxQuantity < 1) {
      // TODO: Show notification
      console.warn(this.getText('noSellEquippedMsg'));
      return;
    }

    this.selectedItemToSell.set({ item: itemData, quantity: itemInInventory.quantity });
    this.maxSellQuantity.set(maxQuantity);
    this.sellQuantityInput.set(1); // Default to 1
    this.viewMode.set('sell-confirm');
  }

  // --- Actions ---
  buyItem(itemId: string): void {
    const itemData = this.getItemData(itemId);
    if (this.shopService.buyItem(itemId, 1)) {
      // TODO: Show success notification
      console.log(this.getText('buySuccessMsg', itemData.name[this.language() as keyof LocalizedText]));
    } else {
      // ShopService already logs warnings for insufficient funds/inventory full
      // TODO: Show appropriate notification based on ShopService's internal warnings
    }
  }

  confirmSell(): void {
    const itemToSell = this.selectedItemToSell();
    const quantity = this.sellQuantityInput();

    if (!itemToSell || quantity <= 0 || quantity > this.maxSellQuantity()) {
      // TODO: Show notification
      console.warn(this.getText('invalidQuantityMsg'));
      return;
    }

    if (this.shopService.sellItem(itemToSell.item.id, quantity)) {
      const totalGain = itemToSell.item.sellPrice! * quantity;
      // TODO: Show success notification
      console.log(this.getText('sellSuccessMsg', quantity, itemToSell.item.name[this.language() as keyof LocalizedText], totalGain));
      this.viewMode.set('sell'); // Go back to sell list
    } else {
      // ShopService already logs warnings
      // TODO: Show appropriate notification
    }
  }

  onClose(): void {
    this.closeShop.emit();
    this.viewMode.set('market'); // Reset view mode on close
  }
}