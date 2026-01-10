import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { InventoryService } from './inventory.service';
import { masterItemList } from '../data/item-database';
import { shopInventory } from '../data/shop-data';
import { LocalizedText } from '../interfaces/dialogue.interface';

type TextFunction = (...args: any[]) => LocalizedText;

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);

  // 1. Textos movidos al servicio
  private readonly UI_TEXTS: Record<string, LocalizedText | TextFunction> = {
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
    invalidQuantityMsg: { es: "Por favor, introduce una cantidad válida para vender.", en: "Please enter a valid quantity to sell." },
  };

  // Nota: availableShopItems ahora devuelve Items completos según tu código original
  // Si tu template espera IDs, deberías cambiar esto a: return shopInventory;
  public availableShopItems = computed(() => {
    // Esto devuelve Item[], asegúrate de que tu HTML use 'track item.id' si es así
    // o cámbialo a IDs si prefieres. Asumo que quieres IDs para ser consistente con el HTML anterior:
    return shopInventory;
  });

  constructor() { }

  /**
   * Obtiene el texto traducido según el idioma actual del juego.
   * Centraliza la lógica de traducción.
   */
  public getText(key: string, ...args: any[]): string {
    const currentLang = this.gameStateService.language() as keyof LocalizedText;
    const textEntry = this.UI_TEXTS[key];

    if (textEntry) {
      if (typeof textEntry === 'function') {
        const result = (textEntry as Function)(...args) as LocalizedText;
        return result[currentLang] || result['en'];
      } else {
        return textEntry[currentLang] || textEntry['en'];
      }
    }
    return key;
  }

  buyItem(itemId: string, quantity: number = 1): boolean {
    const itemData = masterItemList[itemId];
    if (!itemData || !itemData.buyPrice) return false;

    const totalCost = itemData.buyPrice * quantity;
    if (this.gameStateService.money() < totalCost) {
      console.warn(this.getText('fundsInsufficientMsg')); // Usamos el texto interno si queremos loguear
      return false;
    }

    if (!this.inventoryService.addItem(itemId, quantity)) return false;

    this.gameStateService.updateMoney(-totalCost);
    return true;
  }

  sellItem(itemId: string, quantity: number = 1): boolean {
    const itemData = masterItemList[itemId];
    if (!itemData || !itemData.sellPrice) return false;

    const currentQuantity = this.inventoryService.getItemQuantity(itemId);
    if (currentQuantity < quantity) return false;

    const equippedItems = Object.values(this.gameStateService.equipped());
    if (equippedItems.includes(itemId) && currentQuantity === quantity) return false;

    if (!this.inventoryService.removeItem(itemId, quantity)) return false;

    const totalGain = itemData.sellPrice * quantity;
    this.gameStateService.updateMoney(totalGain);
    return true;
  }
}
