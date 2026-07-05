import { EggDefinition } from '@core/interfaces/pet.interface';

export const EGG_DEFINITIONS: Record<string, EggDefinition> = {
  common_egg: {
    id: 'common_egg',
    speciesId: 'meadow_puff',
    visual: { type: 'emoji', value: '🥚' },
    name: { es: 'Huevo Común', en: 'Common Egg' },
    rarity: 'common',
  },
  forest_egg: {
    id: 'forest_egg',
    speciesId: 'forest_sprite',
    visual: { type: 'emoji', value: '🌿' },
    name: { es: 'Huevo del Bosque', en: 'Forest Egg' },
    rarity: 'uncommon',
  },
  ruins_egg: {
    id: 'ruins_egg',
    speciesId: 'stone_golem',
    visual: { type: 'emoji', value: '🪨' },
    name: { es: 'Huevo Ruinoso', en: 'Ruins Egg' },
    rarity: 'rare',
  },
  dragon_egg: {
    id: 'dragon_egg',
    speciesId: 'ember_fox',
    visual: { type: 'emoji', value: '🔥' },
    name: { es: 'Huevo Dracónico', en: 'Dragon Egg' },
    rarity: 'legendary',
  },
};
