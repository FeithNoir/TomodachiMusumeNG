import { Component, computed, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { CharacterService } from '@core/services/character.service';
import { CharacterStatsService } from '@core/services/character-stats.service';
import { InventoryService } from '@core/services/inventory.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { EQUIPMENT_SLOT_DEFINITIONS } from '@core/data/equipment-slots';
import { STAT_KEYS, StatKey } from '@core/interfaces/character-stats.interface';
import { EquipResult } from '@core/interfaces/notification.interface';
import { EquippableItemCategory } from '@core/interfaces/item.interface';
import { isEquippableCategory } from '@core/data/equippable-categories';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [],
  templateUrl: './equipment.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './equipment.component.css',
})
export class EquipmentComponent {
  private characterService = inject(CharacterService);
  private characterStatsService = inject(CharacterStatsService);
  private inventoryService = inject(InventoryService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  @Output() close = new EventEmitter<void>();

  public equipped = this.characterService.equipped;
  public stats = this.characterStatsService.totalStats;
  public statKeys = STAT_KEYS;
  public slots = EQUIPMENT_SLOT_DEFINITIONS;

  readonly getText = this.localization.t.bind(this.localization);

  public equippableInventoryItems = computed(() =>
    this.inventoryService.inventory().filter(entry => {
      const type = this.itemCatalog.getItem(entry.id)?.type;
      return type ? isEquippableCategory(type) : false;
    })
  );

  getItemName(itemId: string | null): string {
    return this.itemCatalog.getItemName(itemId);
  }

  getItemPath(itemId: string | null): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  getStatLabel(key: StatKey): string {
    return this.getText(`stat${key.charAt(0).toUpperCase()}${key.slice(1)}`);
  }

  isEquipped(itemId: string): boolean {
    return Object.values(this.equipped()).includes(itemId);
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

  handleInventoryEquip(itemId: string): void {
    const result = this.characterService.equipItem(itemId);
    this.showEquipResult(result, itemId);
  }

  private showEquipResult(result: EquipResult, itemId: string): void {
    if (result.ok) {
      this.notifications.success(this.getText('itemEquippedMsg', this.getItemName(itemId)));
      return;
    }

    switch (result.reason) {
      case 'not_equippable':
        this.notifications.warning(this.getText('cannotEquipMsg'));
        break;
      case 'insufficient_affinity':
        this.notifications.warning(this.getText('insufficientAffinityMsg', result.requiredAffinity ?? 0));
        break;
      default:
        this.notifications.error(this.getText('itemNotFoundMsg'));
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
