import { LocalizedText } from '@core/interfaces/localized-text.interface';
import { PetVisual } from '@core/interfaces/pet.interface';
import { StatKey } from '@core/interfaces/character-stats.interface';

export type MinigameCategory = 'training' | 'dates' | 'experiments';
export type TrainingGameId = 'runner' | 'rhythm' | 'slice';

export interface TrainingGameDefinition {
  id: TrainingGameId;
  name: LocalizedText;
  description: LocalizedText;
  energyCost: number;
  statKey: StatKey;
  icon: string;
}

export interface TrainingAssigneeOption {
  type: 'character' | 'pet';
  id: string;
  label: string;
  visual: PetVisual | null;
  available: boolean;
  unavailableReasonKey?: string;
}

export interface MinigameParticipant {
  type: 'character' | 'pet';
  id: string;
  label: string;
  display: 'image' | 'emoji';
  src: string;
}

export interface DateEventChoice {
  id: string;
  text: LocalizedText;
  affinityChange: number;
  response: LocalizedText;
  backgroundFilter?: string;
}

export interface DateEventDefinition {
  id: string;
  requiredAffinity: number;
  name: LocalizedText;
  background: string;
  intro: LocalizedText;
  choices: DateEventChoice[];
}

export interface TrainingResult {
  score: number;
  statGain: number;
  affinityGain: number;
  assigneeLabel: string;
}
