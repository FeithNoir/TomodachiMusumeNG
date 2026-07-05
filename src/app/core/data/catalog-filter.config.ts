export interface CatalogFilterTab {
  id: string;
  labelKey: string;
}

export const INVENTORY_FILTER_TABS: CatalogFilterTab[] = [
  { id: 'all', labelKey: 'tabAll' },
  { id: 'consumable', labelKey: 'tabConsumables' },
  { id: 'material', labelKey: 'tabMaterials' },
  { id: 'recipe', labelKey: 'tabRecipes' },
  { id: 'armor', labelKey: 'tabArmor' },
];

export const SHOP_FILTER_TABS: CatalogFilterTab[] = [
  { id: 'all', labelKey: 'tabAll' },
  { id: 'upgrades', labelKey: 'shopTabUpgrades' },
  { id: 'weapons', labelKey: 'shopTabWeapons' },
  { id: 'armor', labelKey: 'tabArmor' },
  { id: 'consumables', labelKey: 'tabConsumables' },
];
