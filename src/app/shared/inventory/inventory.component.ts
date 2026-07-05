import { Component, computed, inject, signal, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

import { ARMOR_SET_LABELS } from '@core/data/armor-sets';
import { INVENTORY_FILTER_TABS } from '@core/data/catalog-filter.config';
import { isEquippableCategory } from '@core/data/equippable-categories';
import { recipes } from '@core/data/recipe-database';
import { ItemCategory } from '@core/interfaces/item.interface';
import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';
import { InventoryService } from '@core/services/inventory.service';
import { InventoryUiService } from '@core/services/inventory-ui.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { EquipResult } from '@core/interfaces/notification.interface';
import { resolveLocalizedText } from '@core/utils/localization.util';
import { CatalogFilterComponent } from '@shared/catalog-filter/catalog-filter.component';

type InventoryTab = 'all' | 'consumable' | 'material' | 'recipe' | 'armor';

interface ArmorSetGroup {
  setId: string;
  label: string;
  items: { id: string; quantity: number }[];
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CatalogFilterComponent],
  templateUrl: './inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {
  private inventoryService = inject(InventoryService);
  private gameStateService = inject(GameStateService);
  private characterService = inject(CharacterService);
  private inventoryUi = inject(InventoryUiService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  @Input() embedded = false;
  @Output() close = new EventEmitter<void>();

  public inventory = this.inventoryService.inventory;
  public money = this.gameStateService.money;
  public equipped = this.characterService.equipped;
  public maxInventorySlots = this.inventoryService.maxSlots;
  public filterTabs = INVENTORY_FILTER_TABS;
  public equipMode = this.inventoryUi.equipMode;
  public activeTab = signal<InventoryTab>('all');
  public searchQuery = signal('');

  readonly getText = this.localization.t.bind(this.localization);

  private storableCategories: ItemCategory[] = ['consumable', 'material', 'recipe'];

  public filteredInventory = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const tab = this.activeTab();

    return this.inventory().filter(entry => {
      const item = this.itemCatalog.getItem(entry.id);
      if (!item) {
        return false;
      }

      if (tab === 'recipe') {
        return item.type === 'recipe';
      }

      if (tab === 'armor') {
        return isEquippableCategory(item.type);
      }

      if (tab === 'consumable' || tab === 'material') {
        if (item.type !== tab) {
          return false;
        }
      } else if (tab === 'all') {
        const allowed =
          this.storableCategories.includes(item.type) || isEquippableCategory(item.type);
        if (!allowed) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      const localizedName = this.getItemName(entry.id).toLowerCase();
      return localizedName.includes(query) || entry.id.toLowerCase().includes(query);
    });
  });

  public armorSetGroups = computed((): ArmorSetGroup[] => {
    const lang = this.gameStateService.language();
    const map = new Map<string, { id: string; quantity: number }[]>();

    for (const entry of this.inventory()) {
      const item = this.itemCatalog.getItem(entry.id);
      if (!item || !isEquippableCategory(item.type)) {
        continue;
      }

      const setId = this.itemCatalog.getArmorSet(entry.id) ?? 'misc';
      const list = map.get(setId) ?? [];
      list.push(entry);
      map.set(setId, list);
    }

    return [...map.entries()]
      .map(([setId, items]) => ({
        setId,
        label: resolveLocalizedText(ARMOR_SET_LABELS[setId] ?? ARMOR_SET_LABELS['misc'], lang),
        items,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  public knownRecipeEntries = computed(() => {
    const known = this.gameStateService.gameState().knownRecipes;
    return known.map(recipeId => ({
      recipeId,
      recipe: recipes[recipeId],
      itemName: this.getRecipeResultName(recipeId),
    })).filter(entry => entry.recipe);
  });

  setTab(tab: string): void {
    this.activeTab.set(tab as InventoryTab);
  }

  updateSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  getItemName(itemId: string): string {
    return this.localization.itemName(itemId);
  }

  getItemPath(itemId: string): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  getItemEmoji(itemId: string): string | null {
    return this.itemCatalog.getItem(itemId)?.emoji ?? null;
  }

  getRarityClass(itemId: string): string {
    return this.itemCatalog.getItemRarityClass(itemId);
  }

  getRarityStyle(itemId: string): Record<string, string> | null {
    return this.itemCatalog.getItemRarityStyle(itemId);
  }

  isEquipped(itemId: string): boolean {
    return Object.values(this.equipped()).includes(itemId);
  }

  getRecipeResultName(recipeId: string): string {
    const recipe = recipes[recipeId];
    if (!recipe) {
      return recipeId;
    }
    return this.getItemName(recipe.result);
  }

  handleItemClick(itemId: string): void {
    const itemData = this.itemCatalog.getItem(itemId);
    if (!itemData) {
      return;
    }

    if (this.equipMode() && isEquippableCategory(itemData.type)) {
      this.equipItem(itemId);
      return;
    }

    if (itemData.type === 'consumable') {
      this.useConsumable(itemId);
      return;
    }

    if (isEquippableCategory(itemData.type)) {
      this.notifications.info(this.getText('enableEquipModeHint'));
      return;
    }

    if (itemData.type === 'recipe') {
      this.notifications.info(this.getText('recipeAtWorkbenchHint'));
    }
  }

  private equipItem(itemId: string): void {
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

  private useConsumable(itemId: string): void {
    const itemData = this.itemCatalog.getItem(itemId);
    const itemInInventory = this.inventoryService.inventory().find(item => item.id === itemId);

    if (!itemData || !itemInInventory) {
      return;
    }

    if (itemData.effects?.energy) {
      this.gameStateService.updateEnergy(itemData.effects.energy);
    }

    if (itemData.effects?.satiety) {
      this.gameStateService.updateSatiety(itemData.effects.satiety);
    }

    this.inventoryService.removeItem(itemId, 1);
    this.notifications.success(this.getText('itemUsedMsg', this.getItemName(itemId)));
  }

  onClose(): void {
    if (this.embedded) {
      return;
    }
    this.inventoryUi.reset();
    this.close.emit();
  }
}
