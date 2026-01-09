import { ItemCollection } from '../interfaces/item.interface';

export const masterItemList: ItemCollection = {
  // ---- Ropa Interior ----
  'bra_1': {
    id: 'bra_1',
    name: { es: 'Sujetador Básico', en: 'Basic Bra' },
    type: 'bra',
    path: './assets/img/bra/bra_1.png',
    requiredAffinity: 40
  },
  'bra_2': {
    id: 'bra_2',
    name: { es: 'Sujetador de Encaje', en: 'Lace Bra' },
    type: 'bra',
    path: './assets/img/bra/bra_2.png',
    requiredAffinity: 40
  },
  'pantsus_1': {
    id: 'pantsus_1',
    name: { es: 'Braguitas Básicas', en: 'Basic Panties' },
    type: 'pantsus',
    path: './assets/img/pantsus/pantsus_1.png',
    requiredAffinity: 40
  },
  'pantsus_2': {
    id: 'pantsus_2',
    name: { es: 'Braguitas de Lazo', en: 'Ribbon Panties' },
    type: 'pantsus',
    path: './assets/img/pantsus/pantsus_2.png',
    requiredAffinity: 40
  },

  // ---- Ropa Casual ----
  'cheap_shirt': {
    id: 'cheap_shirt',
    name: { es: 'Camisa Barata', en: 'Cheap Shirt' },
    type: 'top',
    path: './assets/img/tops/cheap_shirt.png'
  },
  'good_shirt': {
    id: 'good_shirt',
    name: { es: 'Camisa Buena', en: 'Good Shirt' },
    type: 'top',
    path: './assets/img/tops/good_shirt.png'
  },
  'casual_top': {
    id: 'casual_top',
    name: { es: 'Top Casual', en: 'Casual Top' },
    type: 'top',
    path: './assets/img/tops/casual_top.png'
  },
  'cheap_pants': {
    id: 'cheap_pants',
    name: { es: 'Pantalones Baratos', en: 'Cheap Pants' },
    type: 'bottom',
    path: './assets/img/bottoms/cheap_pants.png'
  },
  'good_pants': {
    id: 'good_pants',
    name: { es: 'Pantalones Buenos', en: 'Good Pants' },
    type: 'bottom',
    path: './assets/img/bottoms/good_pants.png'
  },
  'mini_skirt': {
    id: 'mini_skirt',
    name: { es: 'Mini Falda', en: 'Mini Skirt' },
    type: 'bottom',
    path: './assets/img/bottoms/mini_skirt.png'
  },

  // ---- Trajes y Sets Temáticos ----
  'bunny_suit': {
    id: 'bunny_suit',
    name: { es: 'Traje de Conejita', en: 'Bunny Suit' },
    type: 'suit',
    path: './assets/img/suits/bunny_suit.png',
    requiredAffinity: 70
  },
  'bunny_ears': {
    id: 'bunny_ears',
    name: { es: 'Orejas de Coneja', en: 'Bunny Ears' },
    type: 'head',
    path: './assets/img/head/bunny_ears.png',
    requiredAffinity: 70
  },
  'bunny_stocks': {
    id: 'bunny_stocks',
    name: { es: 'Medias de Conejita', en: 'Bunny Stockings' },
    type: 'stockings',
    path: './assets/img/stocks/bunny_stocks.png',
    requiredAffinity: 70
  },
  'east_suit': {
    id: 'east_suit',
    name: { es: 'Atuendo Oriental', en: 'Eastern Outfit' },
    type: 'suit',
    path: './assets/img/suits/east_suit.png',
    requiredAffinity: 70
  },
  'east_stocks': {
    id: 'east_stocks',
    name: { es: 'Medias Orientales', en: 'Eastern Stockings' },
    type: 'stockings',
    path: './assets/img/stocks/east_stocks.png',
    requiredAffinity: 70
  },
  'leotard': {
    id: 'leotard',
    name: { es: 'Leotardo', en: 'Leotard' },
    type: 'suit',
    path: './assets/img/suits/leotard.png',
    requiredAffinity: 80
  },
  'maid_diadema': {
    id: 'maid_diadema',
    name: { es: 'Diadema de Doncella', en: 'Maid Diadem' },
    type: 'head',
    path: './assets/img/head/maid_diadema.png',
    requiredAffinity: 50
  },
  'maid_top': {
    id: 'maid_top',
    name: { es: 'Top de Doncella', en: 'Maid Top' },
    type: 'top',
    path: './assets/img/tops/maid_top.png',
    requiredAffinity: 50
  },
  'maid_skirt': {
    id: 'maid_skirt',
    name: { es: 'Falda de Doncella', en: 'Maid Skirt' },
    type: 'bottom',
    path: './assets/img/bottoms/maid_skirt.png',
    requiredAffinity: 50
  },
  'maid_stocks': {
    id: 'maid_stocks',
    name: { es: 'Medias de Doncella', en: 'Maid Stockings' },
    type: 'stockings',
    path: './assets/img/stocks/maid_stocks.png',
    requiredAffinity: 50
  },
  'maid_guantelets': {
    id: 'maid_guantelets',
    name: { es: 'Guantes de Doncella', en: 'Maid Gauntlets' },
    type: 'hands',
    path: './assets/img/hands/maid_guantelets.png',
    requiredAffinity: 50
  },
  'neko_ears': {
    id: 'neko_ears',
    name: { es: 'Orejas de Gato', en: 'Cat Ears' },
    type: 'head',
    path: './assets/img/head/neko_ears.png'
  },

  // ---- Equipamiento de Cuero ----
  'leather_shirt': {
    id: 'leather_shirt',
    name: { es: 'Coraza de Cuero', en: 'Leather Cuirass' },
    type: 'top',
    path: './assets/img/tops/leather_shirt.png'
  },
  'leather_skirt': {
    id: 'leather_skirt',
    name: { es: 'Falda de Cuero', en: 'Leather Skirt' },
    type: 'bottom',
    path: './assets/img/bottoms/leather_skirt.png'
  },
  'leather_guantelets': {
    id: 'leather_guantelets',
    name: { es: 'Guanteletes de Cuero', en: 'Leather Gauntlets' },
    type: 'hands',
    path: './assets/img/hands/leather_guantelets.png'
  },
  'leather_stocks': {
    id: 'leather_stocks',
    name: { es: 'Medias de Cuero', en: 'Leather Stockings' },
    type: 'stockings',
    path: './assets/img/stocks/leatherStocks.png'
  },

  // ---- Equipamiento de Acero ----
  'steel_armor': {
    id: 'steel_armor',
    name: { es: 'Armadura de Acero', en: 'Steel Armor' },
    type: 'top',
    path: './assets/img/tops/steel_armor.png'
  },
  'steel_skirt': {
    id: 'steel_skirt',
    name: { es: 'Falda de Acero', en: 'Steel Skirt' },
    type: 'bottom',
    path: './assets/img/bottoms/steel_skirt.png'
  },
  'steel_guantelets': {
    id: 'steel_guantelets',
    name: { es: 'Guanteletes de Acero', en: 'Steel Gauntlets' },
    type: 'hands',
    path: './assets/img/hands/steel_guantelets.png'
  },
  'steel_stocks': {
    id: 'steel_stocks',
    name: { es: 'Mallas de Acero', en: 'Steel Stockings' },
    type: 'stockings',
    path: './assets/img/stocks/steel_stocks.png'
  },

  // ---- Equipamiento de Escamas ----
  'scale_armor': {
    id: 'scale_armor',
    name: { es: 'Coraza de Escamas', en: 'Scale Cuirass' },
    type: 'top',
    path: './assets/img/tops/scale_armor.png'
  },
  'scale_skirt': {
    id: 'scale_skirt',
    name: { es: 'Falda de Escamas', en: 'Scale Skirt' },
    type: 'bottom',
    path: './assets/img/bottoms/scale_skirt.png'
  },
  'scale_guantelets': {
    id: 'scale_guantelets',
    name: { es: 'Guanteletes de Escamas', en: 'Scale Gauntlets' },
    type: 'hands',
    path: './assets/img/hands/scale_guantelets.png'
  },
  'scale_stocks': {
    id: 'scale_stocks',
    name: { es: 'Medias de Escamas', en: 'Scale Stockings' },
    type: 'stockings',
    path: './assets/img/stocks/scale_stocks.png'
  },

  // ---- Armas ----
  'wooden_sword': {
    id: 'wooden_sword',
    name: { es: 'Espada de Madera', en: 'Wooden Sword' },
    type: 'weapon',
    path: './assets/img/items/sword_wood.png',
    effects: { missionBonus: { nothingChance: -0.05, itemChance: 0.05 } }
  },
  'iron_sword': {
    id: 'iron_sword',
    name: { es: 'Espada de Hierro', en: 'Iron Sword' },
    type: 'weapon',
    path: './assets/img/items/sword_iron.png',
    effects: { missionBonus: { nothingChance: -0.15, itemChance: 0.15 } }
  },
  'steel_sword': {
    id: 'steel_sword',
    name: { es: 'Espada de Acero', en: 'Steel Sword' },
    type: 'weapon',
    path: './assets/img/items/sword_steel.png',
    effects: { missionBonus: { nothingChance: -0.25, itemChance: 0.25 } }
  },

  // ---- Consumibles ----
  'energy_drink': {
    id: 'energy_drink',
    name: { es: 'Bebida Energética', en: 'Energy Drink' },
    type: 'consumable',
    path: './assets/img/items/energy_drink.png',
    effects: { energy: 25 }
  },

  // ---- Materiales ----
  'wood_plank': {
    id: 'wood_plank',
    name: { es: 'Tabla de Madera', en: 'Wood Plank' },
    type: 'material',
    path: './assets/img/items/wood.png'
  },
  'iron_ore': {
    id: 'iron_ore',
    name: { es: 'Mena de Hierro', en: 'Iron Ore' },
    type: 'material',
    path: './assets/img/items/iron.png'
  },
  'steel_ingot': {
    id: 'steel_ingot',
    name: { es: 'Lingote de Acero', en: 'Steel Ingot' },
    type: 'material',
    path: './assets/img/items/steel.png'
  },

  // ---- Recetas ----
  'recipe_steel_sword': {
    id: 'recipe_steel_sword',
    name: { es: 'Receta: Espada de Acero', en: 'Recipe: Steel Sword' },
    type: 'recipe',
    path: './assets/img/items/recipe.png',
    recipeId: 'steel_sword_recipe'
  },
};
