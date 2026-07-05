import { MissionDefinition } from '@core/interfaces/mission-definition.interface';

export const MISSION_DEFINITIONS: Record<string, MissionDefinition> = {
  gather_herbs: {
    id: 'gather_herbs',
    name: { es: 'Recolección de Hierbas', en: 'Herb Gathering' },
    description: {
      es: 'Una tarea sencilla en los alrededores del cuartel.',
      en: 'A simple task around the barracks.',
    },
    difficulty: 'common',
    energyCost: 8,
    spawnType: 'always',
    rewardTableId: 'common_loot',
    allowCharacter: true,
    allowPets: true,
  },
  patrol_gate: {
    id: 'patrol_gate',
    name: { es: 'Patrulla en la Puerta', en: 'Gate Patrol' },
    description: {
      es: 'Vigila la entrada durante un rato.',
      en: 'Watch the entrance for a while.',
    },
    difficulty: 'uncommon',
    energyCost: 12,
    spawnType: 'always',
    statRequirements: [{ stat: 'defense', minValue: 8 }],
    rewardTableId: 'uncommon_loot',
    allowCharacter: true,
    allowPets: true,
  },
  forest_scout: {
    id: 'forest_scout',
    name: { es: 'Exploración del Bosque', en: 'Forest Scouting' },
    description: {
      es: 'Explora senderos ocultos. Requiere sigilo.',
      en: 'Explore hidden trails. Requires stealth.',
    },
    difficulty: 'rare',
    durationMs: 300_000,
    energyCost: 18,
    spawnType: 'random',
    randomWeight: 2,
    statRequirements: [{ stat: 'stealth', minValue: 5 }],
    rewardTableId: 'rare_loot',
    allowCharacter: true,
    allowPets: true,
  },
  ruins_delve: {
    id: 'ruins_delve',
    name: { es: 'Incursión a las Ruinas', en: 'Ruins Delve' },
    description: {
      es: 'Una misión peligrosa en ruinas antiguas.',
      en: 'A dangerous sortie into ancient ruins.',
    },
    difficulty: 'epic',
    energyCost: 25,
    spawnType: 'random',
    randomWeight: 1,
    statRequirements: [
      { stat: 'attack', minValue: 15 },
      { stat: 'health', minValue: 110 },
    ],
    rewardTableId: 'epic_loot',
    allowCharacter: true,
    allowPets: false,
  },
  dragon_shrine: {
    id: 'dragon_shrine',
    name: { es: 'Santuario del Dragón', en: 'Dragon Shrine' },
    description: {
      es: 'Solo para las aventureras más preparadas.',
      en: 'Only for the most prepared adventurers.',
    },
    difficulty: 'legendary',
    energyCost: 35,
    spawnType: 'conditional',
    conditions: [{ type: 'affinity', minValue: 50 }],
    statRequirements: [
      { stat: 'magic', minValue: 12 },
      { stat: 'luck', minValue: 8 },
    ],
    rewardTableId: 'legendary_loot',
    allowCharacter: true,
    allowPets: true,
  },
  mystery_event: {
    id: 'mystery_event',
    name: { es: 'Encuentro Inesperado', en: 'Unexpected Encounter' },
    description: {
      es: 'Un evento aleatorio apareció en el tablero.',
      en: 'A random event appeared on the board.',
    },
    difficulty: 'uncommon',
    durationMs: 90_000,
    energyCost: 10,
    spawnType: 'random',
    randomWeight: 3,
    rewardTableId: 'random_event_loot',
    allowCharacter: true,
    allowPets: true,
  },
};

export const MISSION_RANDOM_POOL = Object.values(MISSION_DEFINITIONS).filter(
  m => m.spawnType === 'random'
);

export const MISSION_ALWAYS_AVAILABLE = Object.values(MISSION_DEFINITIONS).filter(
  m => m.spawnType === 'always'
);

export const MISSION_RANDOM_SLOT_COUNT = 2;
