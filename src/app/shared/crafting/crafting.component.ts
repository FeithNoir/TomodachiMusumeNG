import { Component, computed, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import {
  CraftSlotDisplay,
  CraftSlotEntry,
  formatCraftQtyLabel,
  resolveCraftQtyState,
} from '@core/interfaces/craft-slot.interface';
import { CraftingService } from '@core/services/crafting.service';
import { InventoryService } from '@core/services/inventory.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';

const EMPTY_SLOTS: (CraftSlotEntry | null)[] = [null, null, null, null];

@Component({
  selector: 'app-crafting',
  standalone: true,
  imports: [],
  templateUrl: './crafting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './crafting.component.css',
})
export class CraftingComponent {
  private craftingService = inject(CraftingService);
  private inventoryService = inject(InventoryService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  @Output() close = new EventEmitter<void>();

  public craftingSlots = signal<(CraftSlotEntry | null)[]>([...EMPTY_SLOTS]);
  public showRecipeModal = signal(false);

  readonly getText = this.localization.t.bind(this.localization);

  public knownRecipes = computed(() => this.craftingService.getKnownRecipes());

  getRecipeResultName(recipeId: string): string {
    return this.craftingService.getResultName(recipeId);
  }

  public materialsInInventory = computed(() =>
    this.inventoryService.inventory().filter(item => this.itemCatalog.getItem(item.id)?.type === 'material')
  );

  public slotDisplays = computed((): CraftSlotDisplay[] =>
    this.craftingSlots().map(entry => {
      if (!entry) {
        return { entry: null, owned: 0, state: 'none', label: '' };
      }

      const owned = this.inventoryService.getItemQuantity(entry.itemId);
      const state = resolveCraftQtyState(owned, entry.requiredQty);
      return {
        entry,
        owned,
        state,
        label: formatCraftQtyLabel(owned, entry.requiredQty, state),
      };
    })
  );

  getItemName(itemId: string | null): string {
    return this.localization.itemName(itemId);
  }

  getItemPath(itemId: string | null): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  qtyClass(state: CraftSlotDisplay['state']): string {
    return `craft-qty--${state}`;
  }

  slotImageClass(state: CraftSlotDisplay['state']): string {
    return state === 'none' ? 'craft-slot-img--missing' : '';
  }

  toggleRecipeModal(): void {
    this.showRecipeModal.update(v => !v);
  }

  closeRecipeModal(): void {
    this.showRecipeModal.set(false);
  }

  applyRecipe(recipeId: string): void {
    const slots = this.craftingService.buildSlotsFromRecipe(recipeId);
    if (!slots) {
      return;
    }

    const padded: (CraftSlotEntry | null)[] = [...slots];
    while (padded.length < 4) {
      padded.push(null);
    }

    this.craftingSlots.set(padded.slice(0, 4));
    this.closeRecipeModal();
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
      updatedSlots[emptySlotIndex] = { itemId, requiredQty: 1 };
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
    const filled = this.craftingSlots().filter((slot): slot is CraftSlotEntry => slot !== null);
    const craftedItemId = this.craftingService.attemptCraftFromSlots(filled);

    if (craftedItemId) {
      this.notifications.success(this.getText('craftSuccessMsg', this.getItemName(craftedItemId)));
    } else {
      this.notifications.warning(this.getText('craftFailMsg'));
    }

    this.craftingSlots.set([...EMPTY_SLOTS]);
  }

  onClose(): void {
    this.close.emit();
  }
}
