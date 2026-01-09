import { Component, computed, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CraftingService } from '../../core/services/crafting.service';
import { InventoryService } from '../../core/services/inventory.service';
import { GameStateService } from '../../core/services/game-state.service';
import { masterItemList } from '../../core/data/item-database';
import { Item, LocalizedText } from '../../core/interfaces/item.interface';

// Helper type para funciones que devuelven texto
type TextFunction = (...args: any[]) => LocalizedText;

// 1. Tipado explícito para evitar errores de índice implícito
const UI_TEXTS: Record<string, LocalizedText | TextFunction> = {
  craftingTitle: { es: "Mesa de Trabajo", en: "Workbench" },
  craftingSlots: { es: "Ranuras de Creación", en: "Crafting Slots" },
  availableMaterials: { es: "Materiales Disponibles", en: "Available Materials" },
  emptySlot: { es: "Vacío", en: "Empty" },
  craftItem: { es: "Crear Objeto", en: "Craft Item" },
  close: { es: "Cerrar", en: "Close" },
  slotsFull: { es: "Ranuras Llenas", en: "Slots Full" },
  slotsFullMsg: { es: "No hay más espacio en la mesa de trabajo.", en: "No more space in the workbench." },
  noMaterials: { es: "No tienes materiales.", en: "You have no materials." },
  craftSuccess: { es: "¡Éxito!", en: "Success!" },
  craftSuccessMsg: (name: string) => ({ es: `Has creado ${name}.`, en: `You crafted ${name}.` }),
  craftFail: { es: "Fallo", en: "Failure" },
  craftFailMsg: { es: "Los ingredientes no producen nada.", en: "The ingredients don't produce anything." },
};

@Component({
  selector: 'app-crafting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crafting.component.html',
  styleUrl: './crafting.component.css'
})
export class CraftingComponent {
  private craftingService = inject(CraftingService);
  private inventoryService = inject(InventoryService);
  private gameStateService = inject(GameStateService);

  @Output() close = new EventEmitter<void>();

  public craftingSlots = signal<(string | null)[]>([null, null, null, null]);
  public language = this.gameStateService.language;

  public materialsInInventory = computed(() => {
    return this.inventoryService.inventory().filter(item => masterItemList[item.id].type === 'material');
  });

  constructor() { }

  // 2. getText corregido para aceptar strings genéricos y spread arguments
  getText(key: string, ...args: any[]): string {
    const currentLang = this.language() as keyof LocalizedText;
    const textEntry = UI_TEXTS[key];

    if (textEntry) {
      if (typeof textEntry === 'function') {
        // Casting explícito a Function para permitir spread arguments
        const result = (textEntry as Function)(...args) as LocalizedText;
        return result[currentLang] || result['en'];
      } else {
        return textEntry[currentLang] || textEntry['en'];
      }
    }
    return key;
  }

  getItemData(itemId: string): Item {
    return masterItemList[itemId];
  }

  // 3. NUEVO Helper para limpiar el HTML
  getItemName(itemId: string | null): string {
    if (!itemId) return '';
    const item = masterItemList[itemId];
    const currentLang = this.language() as keyof LocalizedText;
    return item?.name[currentLang] || item?.name['en'] || 'Unknown';
  }

  addToCraftingSlot(itemId: string): void {
    const currentSlots = this.craftingSlots();
    const emptySlotIndex = currentSlots.findIndex(slot => slot === null);

    if (emptySlotIndex === -1) {
      console.warn(this.getText('slotsFullMsg'));
      return;
    }

    if (this.inventoryService.getItemQuantity(itemId) > 0) {
      const updatedSlots = [...currentSlots];
      updatedSlots[emptySlotIndex] = itemId;
      this.craftingSlots.set(updatedSlots);
    } else {
      // Usamos el helper aquí también para evitar errores
      console.warn(`No ${this.getItemName(itemId)} in inventory.`);
    }
  }

  removeFromCraftingSlot(index: number): void {
    const currentSlots = this.craftingSlots();
    if (index >= 0 && index < currentSlots.length) {
      const updatedSlots = [...currentSlots];
      updatedSlots[index] = null;
      this.craftingSlots.set(updatedSlots);
    }
  }

  attemptCraft(): void {
    const ingredients = this.craftingSlots().filter(id => id !== null) as string[];
    const craftedItemId = this.craftingService.attemptCraft(ingredients);

    if (craftedItemId) {
      // Usamos el helper getItemName
      console.log(this.getText('craftSuccessMsg', this.getItemName(craftedItemId)));
    } else {
      console.warn(this.getText('craftFailMsg'));
    }

    this.craftingSlots.set([null, null, null, null]);
  }

  onClose(): void {
    this.close.emit();
  }
}
