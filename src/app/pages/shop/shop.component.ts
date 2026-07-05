import { Component, computed, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SHOP_FILTER_TABS } from '@core/data/catalog-filter.config';
import { SHOP_SETS } from '@core/data/shop-catalog';
import { ShopService } from '@core/services/shop.service';
import { GameStateService } from '@core/services/game-state.service';
import { CharacterService } from '@core/services/character.service';
import { InventoryService } from '@core/services/inventory.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { SHOP_SPECIAL_ITEMS, isShopSpecialItem } from '@core/data/shop-special-items';
import { Item } from '@core/interfaces/item.interface';
import { CatalogFilterComponent } from '@shared/catalog-filter/catalog-filter.component';

type ShopViewMode = 'market' | 'buy' | 'sell' | 'sell-confirm';

const ARMOR_SET_IDS = new Set([
  'casual',
  'intimate',
  'maid',
  'leather',
  'steel',
  'scale',
  'bunny',
  'east',
  'misc',
]);

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CatalogFilterComponent, FormsModule],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  private shopService = inject(ShopService);
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);
  private characterService = inject(CharacterService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  @Output() closeShop = new EventEmitter<void>();

  public viewMode = signal<ShopViewMode>('market');
  public selectedItemToSell = signal<{ item: Item; quantity: number } | null>(null);
  public sellQuantityInput = signal<number>(1);
  public maxSellQuantity = signal<number>(1);
  public shopFilterTab = signal('all');
  public shopSearchQuery = signal('');

  public availableShopItems = this.shopService.availableShopItems;
  public filterTabs = SHOP_FILTER_TABS;

  public visibleShopSets = computed(() => {
    const available = new Set(this.availableShopItems());
    const tab = this.shopFilterTab();
    const query = this.shopSearchQuery().trim().toLowerCase();

    return SHOP_SETS.map(set => ({
      ...set,
      label: this.localization.localized(set.name),
      itemIds: set.itemIds.filter(id => {
        if (!available.has(id)) {
          return false;
        }
        if (tab !== 'all') {
          if (tab === 'armor' && !ARMOR_SET_IDS.has(set.id)) {
            return false;
          }
          if (tab !== 'armor' && set.id !== tab) {
            return false;
          }
        }
        if (!query) {
          return true;
        }
        if (isShopSpecialItem(id)) {
          const special = SHOP_SPECIAL_ITEMS.find(item => item.id === id);
          return special ? this.getText(special.nameKey).toLowerCase().includes(query) : false;
        }
        const name = this.getItemName(id).toLowerCase();
        return name.includes(query) || id.toLowerCase().includes(query);
      }),
    })).filter(set => set.itemIds.length > 0);
  });

  public sellableInventoryItems = computed(() =>
    this.inventoryService.inventory().filter(item => {
      const itemData = this.itemCatalog.getItem(item.id);
      if (!itemData?.sellPrice) {
        return false;
      }
      const equippedIds = Object.values(this.characterService.equipped());
      return !equippedIds.includes(item.id);
    })
  );

  public money = this.gameStateService.money;
  public Math = Math;
  readonly getText = this.localization.t.bind(this.localization);

  getItemData(itemId: string): Item | undefined {
    return this.itemCatalog.getItem(itemId);
  }

  getItemName(itemId: string): string {
    return this.localization.itemName(itemId);
  }

  getItemPath(itemId: string): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  isSpecialItem(itemId: string): boolean {
    return isShopSpecialItem(itemId);
  }

  getSpecialItem(itemId: string) {
    return SHOP_SPECIAL_ITEMS.find(item => item.id === itemId);
  }

  getSpecialItemName(itemId: string): string {
    const special = this.getSpecialItem(itemId);
    return special ? this.getText(special.nameKey) : itemId;
  }

  getBuyPrice(itemId: string): number {
    const special = this.getSpecialItem(itemId);
    if (special) {
      return special.buyPrice;
    }
    return this.getItemData(itemId)?.buyPrice ?? 0;
  }

  getRarityClass(itemId: string): string {
    return this.itemCatalog.getItemRarityClass(itemId);
  }

  getRarityStyle(itemId: string): Record<string, string> | null {
    return this.itemCatalog.getItemRarityStyle(itemId);
  }

  openMarket(): void {
    this.viewMode.set('market');
  }

  openBuy(): void {
    this.viewMode.set('buy');
  }

  openSell(): void {
    this.viewMode.set('sell');
  }

  openSellConfirmation(itemId: string): void {
    const itemInInventory = this.inventoryService.inventory().find(i => i.id === itemId);
    const itemData = this.getItemData(itemId);
    const equippedIds = Object.values(this.characterService.equipped());

    if (!itemInInventory || !itemData?.sellPrice || equippedIds.includes(itemId)) {
      if (equippedIds.includes(itemId)) {
        this.notifications.warning(this.getText('noSellEquippedMsg'));
      }
      return;
    }

    this.selectedItemToSell.set({ item: itemData, quantity: itemInInventory.quantity });
    this.maxSellQuantity.set(itemInInventory.quantity);
    this.sellQuantityInput.set(1);
    this.viewMode.set('sell-confirm');
  }

  buyItem(itemId: string): void {
    if (this.shopService.buyItem(itemId, 1)) {
      const name = this.isSpecialItem(itemId)
        ? this.getSpecialItemName(itemId)
        : this.getItemName(itemId);
      this.notifications.success(this.getText('buySuccessMsg', name));
    }
  }

  confirmSell(): void {
    const itemToSell = this.selectedItemToSell();
    const quantity = this.sellQuantityInput();

    if (!itemToSell || quantity <= 0 || quantity > this.maxSellQuantity()) {
      this.notifications.warning(this.getText('invalidQuantityMsg'));
      return;
    }

    if (this.shopService.sellItem(itemToSell.item.id, quantity)) {
      const totalGain = itemToSell.item.sellPrice! * quantity;
      this.notifications.success(
        this.getText('sellSuccessMsg', quantity, this.getItemName(itemToSell.item.id), totalGain)
      );
      this.viewMode.set('sell');
    }
  }

  onClose(): void {
    this.closeShop.emit();
    this.viewMode.set('market');
  }

  onShopTabChange(tab: string): void {
    this.shopFilterTab.set(tab);
  }

  onShopSearchChange(query: string): void {
    this.shopSearchQuery.set(query);
  }
}
