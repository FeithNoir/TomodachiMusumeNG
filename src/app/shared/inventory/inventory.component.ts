import { Component, computed, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InventoryService } from '@core/services/inventory.service';
import { GameStateService } from '@core/services/game-state.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { INVENTORY_MAX_SLOTS } from '@core/data/game-config';
import { Item, ItemCategory } from '@core/interfaces/item.interface';

type InventoryTab = 'all' | 'consumable' | 'material';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inventory.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {
  private inventoryService = inject(InventoryService);
  private gameStateService = inject(GameStateService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  @Output() close = new EventEmitter<void>();

  public inventory = this.inventoryService.inventory;
  public maxInventorySlots = INVENTORY_MAX_SLOTS;
  public activeTab = signal<InventoryTab>('all');
  public searchQuery = signal('');

  readonly getText = this.localization.t.bind(this.localization);

  private storableCategories: ItemCategory[] = ['consumable', 'material', 'recipe'];

  public filteredInventory = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const tab = this.activeTab();

    return this.inventory().filter(entry => {
      const item = this.itemCatalog.getItem(entry.id);
      if (!item || !this.storableCategories.includes(item.type)) {
        return false;
      }

      if (tab !== 'all' && item.type !== tab) {
        return false;
      }

      if (!query) {
        return true;
      }

      const localizedName = this.getItemName(entry.id).toLowerCase();
      return localizedName.includes(query) || entry.id.toLowerCase().includes(query);
    });
  });

  setTab(tab: InventoryTab): void {
    this.activeTab.set(tab);
  }

  getItemName(itemId: string): string {
    return this.itemCatalog.getItemName(itemId);
  }

  getItemPath(itemId: string): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  handleItemClick(itemId: string): void {
    const itemData = this.itemCatalog.getItem(itemId);
    if (!itemData) {
      return;
    }

    if (itemData.type === 'consumable') {
      this.useConsumable(itemId);
      return;
    }

    this.notifications.info(this.getText('openEquipmentHint'));
  }

  private useConsumable(itemId: string): void {
    const itemData = this.itemCatalog.getItem(itemId);
    const itemInInventory = this.inventoryService.inventory().find(item => item.id === itemId);

    if (!itemData || !itemInInventory) {
      return;
    }

    if (itemData.effects?.energy) {
      this.gameStateService.updateEnergy(itemData.effects.energy);
    }

    this.inventoryService.removeItem(itemId, 1);
    this.notifications.success(this.getText('itemUsedMsg', this.getItemName(itemId)));
  }

  onClose(): void {
    this.close.emit();
  }
}
