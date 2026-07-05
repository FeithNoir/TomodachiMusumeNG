import { Component, computed, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { CraftingService } from '@core/services/crafting.service';
import { InventoryService } from '@core/services/inventory.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { Item } from '@core/interfaces/item.interface';

@Component({
  selector: 'app-crafting',
  standalone: true,
  imports: [],
  templateUrl: './crafting.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './crafting.component.css',
})
export class CraftingComponent {
  private craftingService = inject(CraftingService);
  private inventoryService = inject(InventoryService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  @Output() close = new EventEmitter<void>();

  public craftingSlots = signal<(string | null)[]>([null, null, null, null]);
  readonly getText = this.localization.t.bind(this.localization);

  public materialsInInventory = computed(() =>
    this.inventoryService.inventory().filter(item => this.itemCatalog.getItem(item.id)?.type === 'material')
  );

  getItemName(itemId: string | null): string {
    return this.itemCatalog.getItemName(itemId);
  }

  getItemData(itemId: string | null): Item | undefined {
    return itemId ? this.itemCatalog.getItem(itemId) : undefined;
  }

  getItemPath(itemId: string | null): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  addToCraftingSlot(itemId: string): void {
    const currentSlots = this.craftingSlots();
    const emptySlotIndex = currentSlots.findIndex(slot => slot === null);

    if (emptySlotIndex === -1) {
      this.notifications.warning(this.getText('slotsFullMsg'));
      return;
    }

    if (this.inventoryService.getItemQuantity(itemId) > 0) {
      const updatedSlots = [...currentSlots];
      updatedSlots[emptySlotIndex] = itemId;
      this.craftingSlots.set(updatedSlots);
    } else {
      this.notifications.warning(this.getText('noMaterials'));
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
    const ingredients = this.craftingSlots().filter((id): id is string => id !== null);
    const craftedItemId = this.craftingService.attemptCraft(ingredients);

    if (craftedItemId) {
      this.notifications.success(this.getText('craftSuccessMsg', this.getItemName(craftedItemId)));
    } else {
      this.notifications.warning(this.getText('craftFailMsg'));
    }

    this.craftingSlots.set([null, null, null, null]);
  }

  onClose(): void {
    this.close.emit();
  }
}
