import { TrainingGameDefinition } from '@core/interfaces/minigame.interface';

export const TRAINING_GAMES: TrainingGameDefinition[] = [
  {
    id: 'runner',
    name: { es: 'Carrera Infinita', en: 'Endless Run' },
    description: {
      es: 'Salta obstáculos y aguanta el mayor tiempo posible.',
      en: 'Jump over obstacles and survive as long as you can.',
    },
    energyCost: 5,
    statKey: 'endurance',
    icon: '🏃',
  },
  {
    id: 'rhythm',
    name: { es: 'Saltos al Ritmo', en: 'Rhythm Jumps' },
    description: {
      es: 'Salta al compás como jumping jacks.',
      en: 'Jump to the beat like jumping jacks.',
    },
    energyCost: 5,
    statKey: 'health',
    icon: '🎵',
  },
  {
    id: 'slice',
    name: { es: 'Corte con Espada', en: 'Sword Slice' },
    description: {
      es: 'Corta los objetivos antes de que desaparezcan.',
      en: 'Slice targets before they vanish.',
    },
    energyCost: 5,
    statKey: 'attack',
    icon: '⚔️',
  },
];

export const TRAINING_GAME_MAP = Object.fromEntries(
  TRAINING_GAMES.map(game => [game.id, game])
) as Record<string, TrainingGameDefinition>;
