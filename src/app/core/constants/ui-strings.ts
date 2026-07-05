import { UiStringDictionary } from '@core/interfaces/localized-text.interface';

export const UI_STRINGS: UiStringDictionary = {
  // Title screen
  titleGameName: { es: 'Tomodachi Musume', en: 'Tomodachi Musume' },
  titleSubtitle: { es: 'Un nuevo vínculo te espera', en: 'A New Bond Awaits' },
  titleNewGame: { es: 'Nueva Partida', en: 'New Game' },
  titleLoadGame: { es: 'Cargar Partida', en: 'Load Game' },
  titleVersion: { es: 'Alpha v0.2.0', en: 'Alpha v0.2.0' },
  titleCopyright: { es: '© 2026 Oniriums', en: '© 2026 Oniriums' },

  // Tutorial
  tutorialLanguageTitle: {
    es: 'Elige tu idioma / Choose your language',
    en: 'Choose your language / Elige tu idioma',
  },
  tutorialIntro: {
    es: '"Hola... ¿Puedes oírme?"\n\n"Soy Eleanora. He estado esperando a alguien como tú durante mucho tiempo."',
    en: '"Hello... Can you hear me?"\n\n"I am Eleanora. I\'ve been waiting for someone like you for a long time."',
  },
  tutorialClickContinue: { es: 'Haz clic para continuar', en: 'Click to continue' },
  tutorialAskName: {
    es: '"Me gustaría saber más de ti... ¿Cómo te llamas?"',
    en: '"I\'d like to know more about you... What is your name?"',
  },
  tutorialNamePlaceholder: { es: 'Introduce tu nombre...', en: 'Enter your name...' },
  tutorialConfirm: { es: 'Confirmar', en: 'Confirm' },
  tutorialConfirmName: (name: string) => ({
    es: `¿Así que te llamas ${name}? ¿Es correcto?`,
    en: `So your name is ${name}? Is that correct?`,
  }),
  tutorialYes: { es: 'Sí, lo es', en: 'Yes, it is' },
  tutorialNo: { es: 'No, déjame cambiarlo', en: 'No, let me change it' },
  tutorialOutro: (name: string) => ({
    es: `"Ya veo... Es un placer conocerte, ${name}."\n\n"Espero que podamos vivir grandes aventuras juntos de ahora en adelante."`,
    en: `"I see... It's a pleasure to meet you, ${name}."\n\n"I hope we can live great adventures together from now on."`,
  }),
  tutorialStart: { es: 'Comenzar Aventura', en: 'Start Adventure' },

  // Sidebar
  talk: { es: 'Hablar', en: 'Talk' },
  equipment: { es: 'Equipo', en: 'Gear' },
  inventory: { es: 'Inventario', en: 'Bag' },
  interact: { es: 'Interactuar', en: 'Interact' },
  mission: { es: 'Misión', en: 'Mission' },
  market: { es: 'Mercado', en: 'Market' },
  craft: { es: 'Crear', en: 'Craft' },
  companions: { es: 'Compañeros', en: 'Companions' },

  // Menu
  menuTitle: { es: 'Menú', en: 'Menu' },
  options: { es: 'Opciones', en: 'Options' },
  save: { es: 'Guardar', en: 'Save' },
  gallery: { es: 'Galería', en: 'Gallery' },
  galleryTitle: { es: 'Galería', en: 'Gallery' },
  galleryTab_outfit: { es: 'Atuendos', en: 'Outfits' },
  galleryTab_scene: { es: 'Escenas', en: 'Scenes' },
  galleryTab_memory: { es: 'Recuerdos', en: 'Memories' },
  tutorials: { es: 'Tutoriales', en: 'Tutorials' },
  tutorialsTitle: { es: 'Tutoriales', en: 'Tutorials' },
  tutorialSeenBadge: { es: 'Leído', en: 'Read' },
  tutorialMarkRead: { es: 'Marcar como leído', en: 'Mark as read' },
  tutorialGotIt: { es: 'Entendido', en: 'Got it' },
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
  tabRecipes: { es: 'Recetas', en: 'Recipes' },
  tabArmor: { es: 'Armaduras', en: 'Armor' },
  goldLabel: { es: 'Oro', en: 'Gold' },
  equippedBadge: { es: 'Equipado', en: 'Equipped' },
  equipModeBanner: {
    es: 'Modo equipar: toca un objeto equipable para ponérselo al personaje.',
    en: 'Equip mode: tap an equippable item to wear it on the character.',
  },
  enableEquipModeHint: {
    es: 'Abre Equipo y pulsa el icono de inventario para equipar objetos.',
    en: 'Open Gear and tap the inventory icon to equip items.',
  },
  recipeAtWorkbenchHint: {
    es: 'Usa la mesa de trabajo para aprender y fabricar con esta receta.',
    en: 'Use the workbench to craft with this recipe.',
  },
  noArmorMsg: { es: 'No tienes armaduras en la mochila.', en: 'You have no armor in your bag.' },
  noKnownRecipes: { es: 'Aún no conoces ninguna receta.', en: 'You do not know any recipes yet.' },
  noRecipeItems: { es: 'No tienes objetos de receta.', en: 'You have no recipe items.' },
  recipeItemsTitle: { es: 'Objetos de receta', en: 'Recipe items' },
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
  statEndurance: { es: 'Aguante', en: 'Endurance' },
  statStealth: { es: 'Sigilo', en: 'Stealth' },
  openInventoryEquip: { es: 'Equipar desde inventario', en: 'Equip from inventory' },
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
  recipesTitle: { es: 'Recetas', en: 'Recipes' },
  noRecipesUnlocked: { es: 'No hay recetas desbloqueadas.', en: 'No recipes unlocked.' },

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
  noSellEquippedMsg: { es: 'No puedes vender objetos equipados.', en: 'You cannot sell equipped items.' },
  noItemsToSell: { es: 'No tienes nada que vender.', en: 'You have nothing to sell.' },
  invalidQuantityMsg: { es: 'Por favor, introduce una cantidad válida para vender.', en: 'Please enter a valid quantity to sell.' },
  buySuccessMsg: (name: string) => ({ es: `¡Has comprado ${name}!`, en: `You bought ${name}!` }),
  sellSuccessMsg: (qty: number, name: string, price: number) => ({
    es: `¡Has vendido ${qty}x ${name} por $${price}!`,
    en: `You sold ${qty}x ${name} for $${price}!`,
  }),

  // Mission
  missionBoardTitle: { es: 'Tablero de Misiones', en: 'Mission Board' },
  missionRefreshBoard: { es: 'Actualizar eventos', en: 'Refresh events' },
  missionSelectAssignee: { es: 'Elegir aventurero', en: 'Choose adventurer' },
  missionInProgressTitle: { es: 'Misión en curso', en: 'Mission in progress' },
  missionAwayHint: {
    es: 'Puedes cerrar este panel; la misión continuará en segundo plano.',
    en: 'You can close this panel; the mission will continue in the background.',
  },
  missionLockedStats: {
    es: 'Estadísticas insuficientes',
    en: 'Insufficient stats',
  },
  missionLockedCondition: {
    es: 'Requisitos no cumplidos',
    en: 'Requirements not met',
  },
  missionAssigneeBusy: {
    es: 'Ya está en una misión',
    en: 'Already on a mission',
  },
  missionNoAssignees: {
    es: 'No hay aventureros disponibles para esta misión.',
    en: 'No adventurers available for this mission.',
  },
  missionAssigneeTypeCharacter: { es: 'Personaje', en: 'Character' },
  missionAssigneeTypePet: { es: 'Mascota', en: 'Pet' },
  missionEggReward: { es: 'Huevos eclosionados', en: 'Hatched eggs' },
  missionCompleteToast: {
    es: '¡Misión completada! Revisa tus recompensas.',
    en: 'Mission complete! Check your rewards.',
  },
  missionRewardTitle: { es: 'Recompensas de misión', en: 'Mission rewards' },
  characterOnMissionTitle: { es: 'En misión...', en: 'On a mission...' },
  characterOnMissionMsg: {
    es: 'Eleanora salió del cuartel. Vuelve cuando termine la misión.',
    en: 'Eleanora left the barracks. She will return when the mission ends.',
  },
  difficultyCommon: { es: 'Común', en: 'Common' },
  difficultyUncommon: { es: 'Poco común', en: 'Uncommon' },
  difficultyRare: { es: 'Raro', en: 'Rare' },
  difficultyEpic: { es: 'Épico', en: 'Epic' },
  difficultyLegendary: { es: 'Legendario', en: 'Legendary' },
  sending: { es: 'Enviando a Misión...', en: 'Sending on Mission...' },
  complete: { es: '¡Misión Completada!', en: 'Mission Complete!' },
  noEnergy: { es: 'Sin Energía', en: 'No Energy' },
  noEnergyMsg: { es: 'No tienes suficiente energía para la misión.', en: 'Not enough energy for the mission.' },
  returned: { es: '¡Ha vuelto de la misión!', en: 'She has returned from the mission!' },
  returnedNothing: { es: 'No encontró nada esta vez...', en: 'She did not find anything this time...' },
  gains: { es: 'Ganancias', en: 'Earnings' },
  items: { es: 'Objetos', en: 'Items' },

  // Pets
  petSlotsFullMsg: {
    es: 'No tienes espacio para más mascotas. Compra expansiones en la tienda.',
    en: 'No room for more pets. Buy expansions at the market.',
  },
  petHatchedMsg: (name: string) => ({
    es: `¡Ha nacido ${name}!`,
    en: `${name} has hatched!`,
  }),
  petTrainedMsg: (stat: string) => ({
    es: `Mascota entrenada (+${stat}).`,
    en: `Pet trained (+${stat}).`,
  }),
  petFedMsg: { es: 'Mascota alimentada.', en: 'Pet fed.' },
  petPotionMsg: { es: 'Poción aplicada a la mascota.', en: 'Potion applied to pet.' },
  petSlotExpandedMsg: {
    es: '¡Capacidad de mascotas ampliada!',
    en: 'Pet capacity expanded!',
  },

  companionsTitle: { es: 'Compañeros y mascotas', en: 'Companions & pets' },
  companionsSlots: (used: number, max: number) => ({
    es: `${used} / ${max} espacios`,
    en: `${used} / ${max} slots`,
  }),
  companionsIncubating: { es: 'Incubando', en: 'Incubating' },
  companionsPets: { es: 'Mascotas', en: 'Pets' },
  companionsEmpty: {
    es: 'Aún no tienes mascotas. Compra huevos en el mercado.',
    en: 'No pets yet. Buy eggs at the market.',
  },
  shopPetSlotUpgrade: {
    es: 'Expansión de Mascotas (+1)',
    en: 'Pet Slot Expansion (+1)',
  },
  shopInventorySlotUpgrade: {
    es: 'Expansión de Inventario (+4)',
    en: 'Inventory Expansion (+4)',
  },
  inventorySlotExpandedMsg: {
    es: '¡Capacidad de inventario ampliada!',
    en: 'Inventory capacity expanded!',
  },
  shopTabUpgrades: { es: 'Mejoras', en: 'Upgrades' },
  shopTabCompanions: { es: 'Compañeros', en: 'Companions' },
  shopTabIngredients: { es: 'Ingredientes', en: 'Ingredients' },
  shopTabMeals: { es: 'Comidas', en: 'Meals' },
  shopTabWeapons: { es: 'Armas', en: 'Weapons' },
  noShopItems: { es: 'No hay artículos en esta categoría.', en: 'No items in this category.' },
  shopCommonEgg: {
    es: 'Huevo Común de Compañero',
    en: 'Common Companion Egg',
  },
  eggIncubatingMsg: (name: string) => ({
    es: `${name} está incubando...`,
    en: `${name} is incubating...`,
  }),
  missionEggIncubating: {
    es: 'Huevos en incubación',
    en: 'Eggs incubating',
  },

  // Interact / Minigames
  interactTitle: { es: 'Interactuar', en: 'Interact' },
  interactCategoryTraining: { es: 'Entrenamiento', en: 'Training' },
  interactCategoryTrainingDesc: {
    es: 'Minijuegos para mejorar habilidades.',
    en: 'Minigames to improve skills.',
  },
  interactCategoryDates: { es: 'Citas', en: 'Dates' },
  interactCategoryDatesDesc: {
    es: 'Eventos especiales según tu afinidad.',
    en: 'Special events based on your affinity.',
  },
  interactCategoryExperiments: { es: 'Experimentos', en: 'Experiments' },
  interactCategoryExperimentsDesc: {
    es: 'Prueba pociones especiales (próximamente).',
    en: 'Test special potions (coming soon).',
  },
  interactBack: { es: 'Volver', en: 'Back' },
  interactSelectGame: { es: 'Elige un entrenamiento', en: 'Choose training' },
  interactSelectAssignee: { es: 'Elige participante', en: 'Choose participant' },
  interactEnergyCost: (cost: number) => ({
    es: `Coste de energía (personaje): ${cost}`,
    en: `Energy cost (character): ${cost}`,
  }),
  interactStartGame: { es: 'Comenzar', en: 'Start' },
  interactScore: { es: 'Puntuación', en: 'Score' },
  interactTapJump: { es: 'Toca o Espacio para saltar', en: 'Tap or Space to jump' },
  interactTapRhythm: { es: 'Toca o Espacio al ritmo', en: 'Tap or Space to the beat' },
  interactTapSlice: { es: 'Toca los objetivos para cortar', en: 'Tap targets to slice' },
  interactGameOver: { es: '¡Fin del juego!', en: 'Game over!' },
  interactFinish: { es: 'Terminar', en: 'Finish' },
  minigameTrainingComplete: (score: number) => ({
    es: `Entrenamiento completado (${score} pts).`,
    en: `Training complete (${score} pts).`,
  }),
  minigameResultAffinity: (amount: number) => ({
    es: `+${amount} afinidad`,
    en: `+${amount} affinity`,
  }),
  minigameResultStat: (stat: string, amount: number) => ({
    es: `+${amount} ${stat} (mascota)`,
    en: `+${amount} ${stat} (pet)`,
  }),
  runnerMeters: { es: 'Metros recorridos', en: 'Meters run' },
  runnerHighScore: { es: 'Récord', en: 'Best run' },
  runnerDefeatCollision: { es: '¡Chocaste con un obstáculo!', en: 'You hit an obstacle!' },
  runnerDefeatStamina: { es: 'Te quedaste sin resistencia.', en: 'You ran out of stamina.' },
  runnerEnduranceGain: (amount: number) => ({
    es: `+${amount} aguante permanente por tu récord en carrera.`,
    en: `+${amount} permanent endurance from your run record.`,
  }),
  runnerRunComplete: (meters: number) => ({
    es: `Carrera completada: ${meters} m.`,
    en: `Run complete: ${meters} m.`,
  }),
  runnerResultAffinity: (amount: number) => ({
    es: `+${amount} afinidad`,
    en: `+${amount} affinity`,
  }),
  runnerResultStat: (stat: string, amount: number) => ({
    es: `+${amount} ${stat} (mascota)`,
    en: `+${amount} ${stat} (pet)`,
  }),
  dateEventsTitle: { es: 'Citas', en: 'Dates' },
  dateEventLocked: (affinity: number) => ({
    es: `Requiere afinidad ${affinity}`,
    en: `Requires affinity ${affinity}`,
  }),
  dateEventCompleted: { es: 'Completada', en: 'Completed' },
  dateEventComplete: (affinity: number) => ({
    es: `Cita completada (+${affinity} afinidad).`,
    en: `Date complete (+${affinity} affinity).`,
  }),
  dateEventNoAvailable: {
    es: 'No hay citas disponibles por ahora. Sube tu afinidad.',
    en: 'No dates available yet. Raise your affinity.',
  },
  experimentsTitle: { es: 'Experimentos', en: 'Experiments' },
  experimentsComingSoon: {
    es: 'Los experimentos con pociones especiales se implementarán pronto.',
    en: 'Special potion experiments will be implemented soon.',
  },
  experimentsHint: {
    es: 'Vuelve más adelante para mezclar ingredientes raros.',
    en: 'Come back later to mix rare ingredients.',
  },
};
