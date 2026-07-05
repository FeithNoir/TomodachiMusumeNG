import { Component, computed, inject, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';

import { CharacterService } from '@core/services/character.service';
import { CharacterStatsService } from '@core/services/character-stats.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { InventoryUiService } from '@core/services/inventory-ui.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { EQUIPMENT_SLOT_DEFINITIONS } from '@core/data/equipment-slots';
import { STAT_KEYS, StatKey } from '@core/interfaces/character-stats.interface';
import { EquippableItemCategory } from '@core/interfaces/item.interface';
import { StatBarComponent } from '@shared/stat-bar/stat-bar.component';
import { InventoryComponent } from '@shared/inventory/inventory.component';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [StatBarComponent, InventoryComponent],
  templateUrl: './equipment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './equipment.component.css',
})
export class EquipmentComponent {
  private characterService = inject(CharacterService);
  private characterStatsService = inject(CharacterStatsService);
  private itemCatalog = inject(ItemCatalogService);
  private inventoryUi = inject(InventoryUiService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  @Output() close = new EventEmitter<void>();

  public equipped = this.characterService.equipped;
  public totalStats = this.characterStatsService.totalStats;
  public baseStats = this.characterStatsService.baseStats;
  public statKeys = STAT_KEYS;
  public slots = EQUIPMENT_SLOT_DEFINITIONS;
  public showInventoryPicker = signal(false);

  readonly getText = this.localization.t.bind(this.localization);

  panelClass = computed(() =>
    this.showInventoryPicker()
      ? 'modal-container--xl equipment-panel--with-inventory'
      : 'modal-container--lg'
  );

  getItemName(itemId: string | null): string {
    return this.localization.itemName(itemId);
  }

  getItemPath(itemId: string | null): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  getRarityClass(itemId: string | null): string {
    return itemId ? this.itemCatalog.getItemRarityClass(itemId) : '';
  }

  getRarityStyle(itemId: string | null): Record<string, string> | null {
    return itemId ? this.itemCatalog.getItemRarityStyle(itemId) : null;
  }

  getStatLabel(key: StatKey): string {
    return this.getText(`stat${key.charAt(0).toUpperCase()}${key.slice(1)}`);
  }

  handleEquippedSlotClick(slot: EquippableItemCategory): void {
    const itemId = this.equipped()[slot];
    if (!itemId) {
      return;
    }

    const itemData = this.itemCatalog.getItem(itemId);
    if (!itemData) {
      return;
    }

    const affinityReq = itemData.requiredAffinity || 0;
    if ((slot === 'bra' || slot === 'pantsus') && this.characterService.affinity() < affinityReq) {
      this.notifications.warning(this.getText('braPantsusUnequipMsg', affinityReq));
      return;
    }

    this.characterService.unequipItem(slot);
    this.notifications.info(this.getText('itemUnequippedMsg', this.getItemName(itemId)));
  }

  toggleInventoryPicker(): void {
    const next = !this.showInventoryPicker();
    this.showInventoryPicker.set(next);
    if (next) {
      this.inventoryUi.openForEquip();
    } else {
      this.inventoryUi.reset();
    }
  }

  onClose(): void {
    this.inventoryUi.reset();
    this.close.emit();
  }
}
