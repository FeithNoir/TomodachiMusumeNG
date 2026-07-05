import { masterItemList } from '@core/data/item-database';
import { shopInventory } from '@core/data/shop-catalog';

function calculatePrice(basePrice: number, level: number): number {
  return Math.floor(basePrice * Math.log(level + 1) * 1.5);
}

/** Assign buy/sell prices to shop-listed catalog items. */
export function initializeShopPrices(): void {
  for (const id of shopInventory) {
    const item = masterItemList[id];
    if (!item || item.buyPrice !== undefined) {
      continue;
    }

    let itemLevel = 1;
    if (id.includes('good')) {
      itemLevel = 3;
    }
    if (id.includes('iron') || id.includes('steel') || id.includes('scale')) {
      itemLevel = 5;
    }
    if (id.includes('bunny') || id.includes('east') || id.includes('leotard')) {
      itemLevel = 6;
    }
    if (id.includes('maid')) {
      itemLevel = 4;
    }

    if (item.type === 'top' || item.type === 'bottom' || item.type === 'weapon') {
      item.buyPrice = calculatePrice(100, itemLevel);
      item.sellPrice = Math.floor(item.buyPrice / 3);
      continue;
    }

    if (['suit', 'head', 'stockings', 'hands', 'bra', 'pantsus', 'consumable'].includes(item.type)) {
      item.buyPrice = calculatePrice(120, itemLevel + 1);
      item.sellPrice = Math.floor(item.buyPrice / 3);
    }
  }
}

initializeShopPrices();

export { calculatePrice };
