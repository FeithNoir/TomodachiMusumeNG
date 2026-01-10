import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { CharacterService } from '../../core/services/character.service';
import { GameStateService } from '../../core/services/game-state.service';
import { masterItemList } from '../../core/data/item-database';
import { Item, EquippableItemCategory, LocalizedText } from '../../core/interfaces/item.interface';

// Definimos un tipo para manejar funciones que devuelven texto traducido
type TextFunction = (...args: any[]) => LocalizedText;

const UI_TEXTS: Record<string, LocalizedText | TextFunction> = {
  inventoryTitle: { es: "Inventario", en: "Inventory" },
  close: { es: "Cerrar", en: "Close" },
  itemUsed: { es: "Objeto Usado", en: "Item Used" },
  // Las funciones devuelven un objeto LocalizedText
  itemUsedMsg: (name: string) => ({ es: `Has usado ${name}.`, en: `You used ${name}.` }),
  cannotEquip: { es: "No Equipable", en: "Cannot Equip" },
  cannotEquipMsg: { es: "Este objeto no se puede equipar.", en: "This item cannot be equipped." },
  insufficientAffinity: { es: "Afinidad Insuficiente", en: "Insufficient Affinity" },
  insufficientAffinityMsg: (req: number) => ({ es: `Necesitas ${req} de afinidad para equipar esto.`, en: `You need ${req} affinity to equip this.` }),
  braPantsusUnequipMsg: (req: number) => ({ es: `No se lo quiere quitar... (necesita ${req} de afinidad).`, en: `She doesn't want to take it off... (needs ${req} affinity).` }),
  inventorySlots: { es: "Ranuras", en: "Slots" }
};

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  private inventoryService = inject(InventoryService);
  private characterService = inject(CharacterService);
  private gameStateService = inject(GameStateService);

  @Output() close = new EventEmitter<void>();

  public inventory = this.inventoryService.inventory;
  public equipped = this.characterService.equipped;
  public language = this.gameStateService.language;
  public maxInventorySlots = 20;

  constructor() { }

  // 1. Método getText arreglado
  getText(key: string, ...args: any[]): string {
    const currentLang = this.language() as keyof LocalizedText;
    const textEntry = UI_TEXTS[key];

    if (textEntry) {
      if (typeof textEntry === 'function') {
        // TypeScript necesita ayuda aquí. Casteamos a 'any' o invocamos directamente.
        // Al usar (textEntry as Function)(...args), permitimos el spread.
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

  // 2. NUEVO Helper para obtener el nombre del ítem y limpiar el HTML
  getItemName(itemId: string): string {
    const item = this.getItemData(itemId);
    const currentLang = this.language() as keyof LocalizedText;
    return item?.name[currentLang] || item?.name['en'] || 'Unknown Item';
  }

  isEquipped(itemId: string): boolean {
    return Object.values(this.equipped()).includes(itemId);
  }

  handleItemClick(itemId: string): void {
    const itemData = this.getItemData(itemId);
    if (!itemData) return; // Seguridad extra

    const itemType = itemData.type;

    if (itemType === 'consumable') {
      this.useConsumable(itemId);
      return;
    }

    const EQUIPABLE_TYPES: EquippableItemCategory[] = ['top', 'bottom', 'suit', 'head', 'stockings', 'bra', 'pantsus', 'hands', 'weapon'];
    if (!EQUIPABLE_TYPES.includes(itemType as EquippableItemCategory)) {
      console.warn(this.getText('cannotEquipMsg'));
      return;
    }

    const isCurrentlyEquipped = this.isEquipped(itemId);
    const affinityReq = itemData.requiredAffinity || 0;

    if (isCurrentlyEquipped) {
      if ((itemType === 'bra' || itemType === 'pantsus') && this.characterService.affinity() < affinityReq) {
        console.warn(this.getText('braPantsusUnequipMsg', affinityReq));
        return;
      }
      this.characterService.unequipItem(itemType as EquippableItemCategory);
    } else {
      if (itemType !== 'bra' && itemType !== 'pantsus' && this.characterService.affinity() < affinityReq) {
        console.warn(this.getText('insufficientAffinityMsg', affinityReq));
        return;
      }
      this.characterService.equipItem(itemId);
    }
  }

  private useConsumable(itemId: string): void {
    const itemData = this.getItemData(itemId);
    // Nota: find devuelve Item | undefined, asegurate que inventoryService tenga el tipo correcto
    const itemInInventory = this.inventoryService.inventory().find((i: any) => i.id === itemId);

    if (!itemInInventory) return;

    if (itemData.effects?.energy) {
      this.gameStateService.updateEnergy(itemData.effects.energy);
    }

    this.inventoryService.removeItem(itemId, 1);

    // Usamos el helper getItemName aquí también para consistencia
    console.log(this.getText('itemUsedMsg', this.getItemName(itemId)));
  }

  onClose(): void {
    this.close.emit();
  }
}
