import { PetSpecies } from '@core/interfaces/pet.interface';

export const PET_SPECIES: Record<string, PetSpecies> = {
  meadow_puff: {
    id: 'meadow_puff',
    name: { es: 'Burbuja de Prado', en: 'Meadow Puff' },
    defaultVisual: { type: 'emoji', value: '🫧' },
    baseStats: { attack: 2, defense: 2, magic: 2, health: 35, luck: 3, endurance: 40, stealth: 2 },
  },
  forest_sprite: {
    id: 'forest_sprite',
    name: { es: 'Espíritu del Bosque', en: 'Forest Sprite' },
    defaultVisual: { type: 'emoji', value: '🌿' },
    baseStats: { attack: 3, defense: 2, magic: 5, health: 40, luck: 4, endurance: 50, stealth: 6 },
  },
  stone_golem: {
    id: 'stone_golem',
    name: { es: 'Gólem de Piedra', en: 'Stone Golem' },
    defaultVisual: { type: 'emoji', value: '🪨' },
    baseStats: { attack: 4, defense: 8, magic: 1, health: 70, luck: 2, endurance: 80, stealth: 1 },
  },
  ember_fox: {
    id: 'ember_fox',
    name: { es: 'Zorro Ígneo', en: 'Ember Fox' },
    defaultVisual: { type: 'emoji', value: '🦊' },
    baseStats: { attack: 6, defense: 3, magic: 4, health: 45, luck: 6, endurance: 55, stealth: 5 },
  },
};
