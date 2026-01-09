import { DialogueCollection } from '../interfaces/dialogue.interface';

export const dialogues: DialogueCollection = {
  // Escena 1: Entrenamiento
  trainingResult: {
    character: "Eleanora",
    text: (playerName: string) => ({
      es: `¿Cómo crees que me fue hoy en el entrenamiento, ${playerName}?`,
      en: `How do you think I did in training today, ${playerName}?`
    }),
    options: [
      {
        text: { es: "¡Seguro que genial! Eres muy fuerte.", en: "I'm sure you were great! You're so strong." },
        affinityChange: 10
      },
      {
        text: { es: "Espero que bien, debes esforzarte más.", en: "Hopefully well. You need to push yourself harder." },
        affinityChange: -5
      },
      {
        text: { es: "No lo sé, cuéntame más.", en: "I don't know, tell me more." },
        affinityChange: 2
      },
      {
        text: { es: "El entrenamiento es clave, ¡sigue así!", en: "Training is key, keep it up!" },
        affinityChange: 3
      },
    ],
  },

  // Escena 2: Dudas (Existential crisis)
  innerDoubts: {
    character: "Eleanora",
    text: (playerName: string) => ({
      es: `A veces me pregunto si todo este esfuerzo vale la pena, ${playerName}...`,
      en: `Sometimes I wonder if all this effort is worth it, ${playerName}...`
    }),
    options: [
      {
        text: { es: "¡Claro que sí! Estás protegiendo a muchos.", en: "Of course, it is! You're protecting so many people." },
        affinityChange: 15
      },
      {
        text: { es: "Si tienes dudas, quizás deberías reconsiderarlo.", en: "If you have doubts, maybe you should reconsider." },
        affinityChange: -10
      },
      {
        text: { es: "Todos tenemos dudas, es normal.", en: "Everyone has doubts, it's normal." },
        affinityChange: 5
      },
      {
        text: { es: "Tu esfuerzo inspira a otros.", en: "Your effort inspires others." },
        affinityChange: 7
      },
    ],
  },

  // Escena 3: Descanso
  breakTime: {
    character: "Eleanora",
    text: (playerName: string) => ({
      es: `Me gustaría tomar un descanso, ¿qué sugieres, ${playerName}?`,
      en: `I'd like to take a break. What do you suggest, ${playerName}?`
    }),
    options: [
      {
        text: { es: "Ver una película juntos.", en: "Let's watch a movie together." },
        affinityChange: 8
      },
      {
        text: { es: "Leer un buen libro.", en: "How about reading a good book?" },
        affinityChange: 3
      },
      {
        text: { es: "El deber llama. No hay tiempo.", en: "Duty calls. There's no time." },
        affinityChange: -7
      },
      {
        text: { es: "Podríamos dar un paseo.", en: "We could go for a walk." },
        affinityChange: 5
      },
    ],
  }
};
