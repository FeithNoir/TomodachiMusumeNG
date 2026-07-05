import { LocalizedText } from '@core/interfaces/localized-text.interface';

export interface TutorialEntry {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  /** When set, shown automatically once when entering this feature. */
  autoShowOn?: 'minigames';
}

export const GAME_TUTORIALS: TutorialEntry[] = [
  {
    id: 'minigames_intro',
    title: { es: 'Minijuegos de entrenamiento', en: 'Training minigames' },
    body: {
      es: 'Elige un minijuego y un participante. El personaje gasta energía; las mascotas entrenan stats. ¡Practica para subir tu afinidad y habilidades!',
      en: 'Pick a minigame and a participant. The character spends energy; pets train stats. Practice to raise affinity and skills!',
    },
    autoShowOn: 'minigames',
  },
  {
    id: 'runner_tips',
    title: { es: 'Carrera infinita', en: 'Endless run' },
    body: {
      es: 'Salta obstáculos con clic o Espacio. Si chocas o se agota la resistencia, pierdes. Recorre metros para batir tu récord y ganar aguante.',
      en: 'Jump obstacles with click or Space. Crash or run out of stamina to lose. Run meters to beat your record and earn endurance.',
    },
  },
  {
    id: 'missions_multi',
    title: { es: 'Misiones simultáneas', en: 'Parallel missions' },
    body: {
      es: 'Puedes enviar a varios compañeros en misiones distintas si están disponibles. Solo los ocupados no podrán salir de nuevo.',
      en: 'You can send multiple companions on different missions when available. Busy assignees cannot be sent again.',
    },
  },
  {
    id: 'craft_food',
    title: { es: 'Cocina y alimentos', en: 'Cooking & food' },
    body: {
      es: 'Compra ingredientes y recetas en la tienda. Combínalos en el taller para crear comidas que restauran saciedad o energía.',
      en: 'Buy ingredients and recipes at the market. Combine them at the workbench to cook meals that restore satiety or energy.',
    },
  },
];

export const TUTORIAL_MAP = Object.fromEntries(GAME_TUTORIALS.map(t => [t.id, t]));
