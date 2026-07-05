export type { LocalizedText } from './localized-text.interface';
import type { LocalizedText } from './localized-text.interface';

export interface DialogueOption {
  text: LocalizedText;
  affinityChange: number;
}

export interface Dialogue {
  character: string;
  text: (playerName: string) => LocalizedText;
  options: DialogueOption[];
}

export interface AffinityReaction {
  text: LocalizedText;
  eyes: string;
  mouth: string;
}

export interface DialogueCollection {
  [key: string]: Dialogue;
}
