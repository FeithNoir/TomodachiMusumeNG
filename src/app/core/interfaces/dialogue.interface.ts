// 1. Interfaz para el manejo de idiomas (más estricto que [key: string])
export interface LocalizedText {
  es: string;
  en: string;
  // Puedes agregar más idiomas aquí en el futuro
}

// 2. Interfaz para las opciones
export interface DialogueOption {
  text: LocalizedText;
  affinityChange: number;
}

// 3. Interfaz principal del Diálogo
export interface Dialogue {
  character: string;
  // Corregido: Ahora la función acepta explícitamente el playerName
  text: (playerName: string) => LocalizedText;
  options: DialogueOption[];
}

// Opcional: Interfaz para el objeto contenedor de todos los diálogos
export interface DialogueCollection {
  [key: string]: Dialogue;
}
