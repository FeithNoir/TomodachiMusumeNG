import { LocalizedText } from '@core/interfaces/localized-text.interface';

export interface AffinityReactionTier {
  level: number;
  eyes: string;
  mouth: string;
  text: LocalizedText;
}

export const affinityReactionTiers: AffinityReactionTier[] = [
  {
    level: 0,
    eyes: '/assets/img/expressions/eyes_angry.png',
    mouth: '/assets/img/expressions/mouth_angry.png',
    text: { es: '¡No me toques!', en: "Don't touch me!" },
  },
  {
    level: 25,
    eyes: '/assets/img/expressions/eyes_surprised.png',
    mouth: '/assets/img/expressions/mouth_surprised.png',
    text: { es: '¿Q-qué haces?', en: 'W-what are you doing?' },
  },
  {
    level: 50,
    eyes: '/assets/img/expressions/eyes_blush.png',
    mouth: '/assets/img/expressions/mouth_blush.png',
    text: { es: 'E-está bien...', en: "I-it's okay..." },
  },
  {
    level: 75,
    eyes: '/assets/img/expressions/eyes_happy.png',
    mouth: '/assets/img/expressions/mouth_happy.png',
    text: { es: '¡Me gusta que me acaricies!', en: 'I like it when you pet me!' },
  },
];
