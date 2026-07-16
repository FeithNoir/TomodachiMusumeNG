import { DateEventDefinition } from '@core/interfaces/minigame.interface';

export const DATE_EVENTS: DateEventDefinition[] = [
  {
    id: 'date_sunset_walk',
    requiredAffinity: 20,
    name: { es: 'Paseo al Atardecer', en: 'Sunset Walk' },
    background: '/assets/img/backgrounds/sunset_fores_bg.',
    intro: {
      es: 'El cielo se tiñe de naranja mientras caminan juntos por el sendero.',
      en: 'The sky turns orange as you walk together along the path.',
    },
    choices: [
      {
        id: 'hold_hand',
        text: { es: 'Tomarle la mano con delicadeza', en: 'Gently hold her hand' },
        affinityChange: 5,
        response: {
          es: 'Entrelaza sus dedos con los tuyos y sonríe tímidamente.',
          en: 'She intertwines her fingers with yours and smiles shyly.',
        },
        backgroundFilter: 'hue-rotate(15deg) brightness(1.05)',
      },
      {
        id: 'point_view',
        text: { es: 'Señalar el horizonte', en: 'Point at the horizon' },
        affinityChange: 3,
        response: {
          es: '"Qué bonito es esto contigo..." murmura mirando la puesta de sol.',
          en: '"This is so beautiful with you..." she murmurs, gazing at the sunset.',
        },
        backgroundFilter: 'hue-rotate(-10deg) saturate(1.2)',
      },
    ],
  },
  {
    id: 'date_tea_salon',
    requiredAffinity: 40,
    name: { es: 'Té en el Salón', en: 'Tea in the Salon' },
    background: '/assets/img/backgrounds/tea_party_bg.png',
    intro: {
      es: 'Preparan té aromático en un salón acogedor, lejos del bullicio.',
      en: 'You brew fragrant tea in a cozy salon, away from the bustle.',
    },
    choices: [
      {
        id: 'serve_first',
        text: { es: 'Servirle la taza primero', en: 'Serve her cup first' },
        affinityChange: 4,
        response: {
          es: '"Gracias... eres muy considerado." Bebe con calma y te mira.',
          en: '"Thank you... you are very thoughtful." She sips calmly and looks at you.',
        },
        backgroundFilter: 'sepia(0.25) brightness(1.08)',
      },
      {
        id: 'share_story',
        text: { es: 'Contarle una anécdota', en: 'Share a story' },
        affinityChange: 5,
        response: {
          es: 'Se ríe suavemente y pide que le cuentes más.',
          en: 'She laughs softly and asks you to tell her more.',
        },
        backgroundFilter: 'brightness(1.12) contrast(1.05)',
      },
    ],
  },
  {
    id: 'date_stargazing',
    requiredAffinity: 60,
    name: { es: 'Mirando las Estrellas', en: 'Stargazing' },
    background: '/assets/img/backgrounds/star_meadaw_bg.png',
    intro: {
      es: 'La noche está despejada. Se recuestan sobre una manta bajo el cielo estrellado.',
      en: 'The night is clear. You lie on a blanket beneath the starry sky.',
    },
    choices: [
      {
        id: 'name_constellation',
        text: { es: 'Inventar una constelación juntos', en: 'Invent a constellation together' },
        affinityChange: 6,
        response: {
          es: '"La llamaremos la constelación del compañero valiente."',
          en: '"Let us call it the constellation of the brave companion."',
        },
        backgroundFilter: 'brightness(0.55) saturate(1.4) hue-rotate(200deg)',
      },
      {
        id: 'quiet_moment',
        text: { es: 'Quedarse en silencio compartido', en: 'Share a quiet moment' },
        affinityChange: 4,
        response: {
          es: 'El silencio se siente cálido. Su hombro roza el tuyo.',
          en: 'The silence feels warm. Her shoulder brushes yours.',
        },
        backgroundFilter: 'brightness(0.5) saturate(1.2)',
      },
    ],
  },
  {
    id: 'date_moon_promise',
    requiredAffinity: 80,
    name: { es: 'Promesa bajo la Luna', en: 'Promise under the Moon' },
    background: '/assets/img/backgrounds/eleanora_room_bg.png',
    intro: {
      es: 'La luna llena ilumina el claro del bosque. Es un momento especial.',
      en: 'The full moon lights the forest clearing. It is a special moment.',
    },
    choices: [
      {
        id: 'promise_adventure',
        text: { es: 'Prometerle nuevas aventuras', en: 'Promise her new adventures' },
        affinityChange: 5,
        response: {
          es: '"Contigo quiero recorrer el mundo entero."',
          en: '"With you, I want to travel the whole world."',
        },
        backgroundFilter: 'brightness(0.65) hue-rotate(240deg) saturate(1.3)',
      },
      {
        id: 'promise_support',
        text: { es: 'Prometerle tu apoyo siempre', en: 'Promise to always support her' },
        affinityChange: 7,
        response: {
          es: 'Sus ojos brillan. "Eso significa mucho para mí."',
          en: 'Her eyes sparkle. "That means a lot to me."',
        },
        backgroundFilter: 'brightness(0.6) contrast(1.1) hue-rotate(220deg)',
      },
    ],
  },
];

export const DATE_EVENT_MAP = Object.fromEntries(
  DATE_EVENTS.map(event => [event.id, event])
) as Record<string, DateEventDefinition>;
