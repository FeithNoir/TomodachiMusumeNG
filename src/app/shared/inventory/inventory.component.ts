import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { InventoryService } from '@core/services/inventory.service';
import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { INVENTORY_MAX_SLOTS } from '@core/data/game-config';
import { isEquippableCategory } from '@core/data/equippable-categories';
import { Item } from '@core/interfaces/item.interface';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [],
  templateUrl: './inventory.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {
  private inventoryService = inject(InventoryService);
  private characterService = inject(CharacterService);
  private gameStateService = inject(GameStateService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  public inventory = this.inventoryService.inventory;
  public equipped = this.characterService.equipped;
  public maxInventorySlots = INVENTORY_MAX_SLOTS;
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

  isEquipped(itemId: string): boolean {
    return Object.values(this.equipped()).includes(itemId);
  }

  handleItemClick(itemId: string): void {
    const itemData = this.getItemData(itemId);
    if (!itemData) {
      return;
    }

    const itemType = itemData.type;

    if (itemType === 'consumable') {
      this.useConsumable(itemId);
      return;
    }

    if (!isEquippableCategory(itemType)) {
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
      this.characterService.unequipItem(itemType);
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
    const itemInInventory = this.inventoryService.inventory().find(item => item.id === itemId);

    if (!itemData || !itemInInventory) {
      return;
    }

    if (itemData.effects?.energy) {
      this.gameStateService.updateEnergy(itemData.effects.energy);
    }

    this.inventoryService.removeItem(itemId, 1);
    console.log(this.getText('itemUsedMsg', this.getItemName(itemId)));
  }

  onClose(): void {
    this.close.emit();
  }
}
