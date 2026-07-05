import { UiStringDictionary } from '@core/interfaces/localized-text.interface';

export const UI_STRINGS: UiStringDictionary = {
  // Sidebar
  talk: { es: 'Hablar', en: 'Talk' },
  equipment: { es: 'Equipo', en: 'Gear' },
  inventory: { es: 'Inventario', en: 'Bag' },
  interact: { es: 'Interactuar', en: 'Interact' },
  mission: { es: 'Misión', en: 'Mission' },
  market: { es: 'Mercado', en: 'Market' },
  craft: { es: 'Crear', en: 'Craft' },

  // Menu
  menuTitle: { es: 'Menú', en: 'Menu' },
  options: { es: 'Opciones', en: 'Options' },
  save: { es: 'Guardar', en: 'Save' },
  gallery: { es: 'Galería (Próximamente)', en: 'Gallery (Coming Soon)' },
  exit: { es: 'Salir', en: 'Exit' },

  // Info HUD
  affinity: { es: 'Afinidad', en: 'Affinity' },
  money: { es: 'Dinero', en: 'Money' },
  energy: { es: 'Energía', en: 'Energy' },
  satiety: { es: 'Saciedad', en: 'Satiety' },

  // Options
  optionsTitle: { es: 'Opciones', en: 'Options' },
  languageLabel: { es: 'Idioma', en: 'Language' },
  closeBtn: { es: 'Cerrar', en: 'Close' },
  english: { es: 'Inglés', en: 'English' },
  spanish: { es: 'Español', en: 'Spanish' },

  // Inventory
  inventoryTitle: { es: 'Inventario', en: 'Inventory' },
  close: { es: 'Cerrar', en: 'Close' },
  noItemsMsg: { es: 'No tienes objetos en el inventario.', en: 'You have no items in your inventory.' },
  itemUsedMsg: (name: string) => ({ es: `Has usado ${name}.`, en: `You used ${name}.` }),
  cannotEquipMsg: { es: 'Este objeto no se puede equipar.', en: 'This item cannot be equipped.' },
  insufficientAffinityMsg: (req: number) => ({
    es: `Necesitas ${req} de afinidad para equipar esto.`,
    en: `You need ${req} affinity to equip this.`,
  }),
  braPantsusUnequipMsg: (req: number) => ({
    es: `No se lo quiere quitar... (necesita ${req} de afinidad).`,
    en: `She doesn't want to take it off... (needs ${req} affinity).`,
  }),
  inventorySearchPlaceholder: { es: 'Buscar objetos...', en: 'Search items...' },
  tabAll: { es: 'Todo', en: 'All' },
  tabConsumables: { es: 'Consumibles', en: 'Consumables' },
  tabMaterials: { es: 'Materiales', en: 'Materials' },
  openEquipmentHint: {
    es: 'Abre Equipo para usar objetos equipables.',
    en: 'Open Gear to manage equippable items.',
  },

  // Equipment
  equipmentTitle: { es: 'Equipo', en: 'Gear' },
  statsTitle: { es: 'Estadísticas', en: 'Stats' },
  equippedTitle: { es: 'Equipado', en: 'Equipped' },
  equippableBagTitle: { es: 'Listo para Equipar', en: 'Ready to Equip' },
  noEquippableItems: { es: 'No hay objetos equipables en la mochila.', en: 'No equippable items in the bag.' },
  itemEquippedMsg: (name: string) => ({ es: `Has equipado ${name}.`, en: `You equipped ${name}.` }),
  itemUnequippedMsg: (name: string) => ({ es: `Has desequipado ${name}.`, en: `You unequipped ${name}.` }),
  itemNotFoundMsg: { es: 'Objeto no encontrado.', en: 'Item not found.' },
  statAttack: { es: 'Ataque', en: 'Attack' },
  statDefense: { es: 'Defensa', en: 'Defense' },
  statMagic: { es: 'Magia', en: 'Magic' },
  statHealth: { es: 'Vida', en: 'Health' },
  statLuck: { es: 'Suerte', en: 'Luck' },
  slotHead: { es: 'Cabeza', en: 'Head' },
  slotTop: { es: 'Torso', en: 'Top' },
  slotBottom: { es: 'Piernas', en: 'Bottom' },
  slotSuit: { es: 'Traje', en: 'Suit' },
  slotStockings: { es: 'Medias', en: 'Stockings' },
  slotHands: { es: 'Manos', en: 'Hands' },
  slotWeapon: { es: 'Arma', en: 'Weapon' },
  slotBra: { es: 'Sujetador', en: 'Bra' },
  slotPantsus: { es: 'Braguitas', en: 'Panties' },

  // Notifications
  stackFullMsg: (name: string) => ({
    es: `Ya tienes el máximo de ${name}.`,
    en: `You already have the maximum amount of ${name}.`,
  }),
  inventoryFullMsg: { es: 'No tienes espacio para un nuevo tipo de objeto.', en: "You don't have space for a new type of item." },

  // Crafting
  craftingTitle: { es: 'Mesa de Trabajo', en: 'Workbench' },
  craftingSlots: { es: 'Ranuras de Creación', en: 'Crafting Slots' },
  availableMaterials: { es: 'Materiales Disponibles', en: 'Available Materials' },
  emptySlot: { es: 'Vacío', en: 'Empty' },
  craftItem: { es: 'Crear Objeto', en: 'Craft Item' },
  slotsFullMsg: { es: 'No hay más espacio en la mesa de trabajo.', en: 'No more space in the workbench.' },
  noMaterials: { es: 'No tienes materiales.', en: 'You have no materials.' },
  craftSuccessMsg: (name: string) => ({ es: `Has creado ${name}.`, en: `You crafted ${name}.` }),
  craftFailMsg: { es: 'Los ingredientes no producen nada.', en: "The ingredients don't produce anything." },

  // Shop
  marketTitle: { es: 'Mercado', en: 'Market' },
  marketPrompt: { es: '¿Qué te gustaría hacer?', en: 'What would you like to do?' },
  buy: { es: 'Comprar', en: 'Buy' },
  sell: { es: 'Vender', en: 'Sell' },
  buyTitle: { es: 'Comprar Objetos', en: 'Buy Items' },
  sellTitle: { es: 'Vender Objetos', en: 'Sell Items' },
  sellConfirmTitle: { es: 'Vender Objeto', en: 'Sell Item' },
  sellConfirmPrompt: { es: '¿Cuántos quieres vender?', en: 'How many do you want to sell?' },
  confirmSell: { es: 'Confirmar Venta', en: 'Confirm Sale' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  back: { es: 'Volver', en: 'Back' },
  fundsInsufficientMsg: { es: 'No tienes suficiente dinero para comprar esto.', en: "You don't have enough money to buy this." },
  noSellEquippedMsg: { es: 'No puedes vender la última unidad de un objeto que llevas equipado.', en: "You can't sell the last unit of an equipped item." },
  noItemsToSell: { es: 'No tienes nada que vender.', en: 'You have nothing to sell.' },
  invalidQuantityMsg: { es: 'Por favor, introduce una cantidad válida para vender.', en: 'Please enter a valid quantity to sell.' },
  buySuccessMsg: (name: string) => ({ es: `¡Has comprado ${name}!`, en: `You bought ${name}!` }),
  sellSuccessMsg: (qty: number, name: string, price: number) => ({
    es: `¡Has vendido ${qty}x ${name} por $${price}!`,
    en: `You sold ${qty}x ${name} for $${price}!`,
  }),

  // Mission
  sending: { es: 'Enviando a Misión...', en: 'Sending on Mission...' },
  complete: { es: '¡Misión Completada!', en: 'Mission Complete!' },
  noEnergy: { es: 'Sin Energía', en: 'No Energy' },
  noEnergyMsg: { es: 'No tienes suficiente energía para la misión.', en: 'Not enough energy for the mission.' },
  returned: { es: '¡Ha vuelto de la misión!', en: 'She has returned from the mission!' },
  returnedNothing: { es: 'No encontró nada esta vez...', en: 'She did not find anything this time...' },
  gains: { es: 'Ganancias', en: 'Earnings' },
  items: { es: 'Objetos', en: 'Items' },
};
