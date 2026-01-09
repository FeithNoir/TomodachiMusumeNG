import { masterItemList } from './item-database';

// --- FUNCIÓN DE CÁLCULO DE PRECIOS ---
// Base: 100, Factor: 1.5. Nivel 1: 100, Nivel 2: ~183, Nivel 3: ~294
function calculatePrice(basePrice: number, level: number): number {
  return Math.floor(basePrice * Math.log(level + 1) * 1.5);
}

// --- BASE DE DATOS DE LA TIENDA ---
export const shopInventory: string[] = [];
Object.keys(masterItemList).forEach(id => {
  const item = masterItemList[id];
  // Asignar precios dinámicos a ropa y armas no crafteables
  if (item.type === 'top' || item.type === 'bottom' || item.type === 'weapon') {
    // Assuming recipes are not yet imported or available here for a direct check
    // This logic will need to be refined once recipes are properly integrated
    // For now, we'll just assign prices
    let itemLevel = 1;
    if (id.includes('good')) itemLevel = 3;
    if (id.includes('iron')) itemLevel = 5;
    item.buyPrice = calculatePrice(100, itemLevel);
    item.sellPrice = Math.floor(item.buyPrice / 3);
    shopInventory.push(id);
  }
  // Añadir sets temáticos y otros objetos a la tienda manualmente
  if (['suit', 'head', 'stockings', 'consumable'].includes(item.type)) {
    // Precios fijos para estos
    if (item.buyPrice === undefined) {
      item.buyPrice = 500;
      item.sellPrice = 150;
    }
    shopInventory.push(id);
  }
});

// Export the function if it needs to be used elsewhere
export { calculatePrice };
