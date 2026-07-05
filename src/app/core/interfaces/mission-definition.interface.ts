import { CharacterStats, StatKey } from '@core/interfaces/character-stats.interface';
import { LocalizedText } from '@core/interfaces/localized-text.interface';
import { PetVisual } from '@core/interfaces/pet.interface';

export type MissionDifficulty = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type MissionSpawnType = 'always' | 'random' | 'conditional';

export type MissionAssigneeType = 'character' | 'pet';

export interface MissionStatRequirement {
  stat: StatKey;
  minValue: number;
}

export interface MissionCondition {
  type: 'affinity' | 'stat' | 'flag';
  stat?: StatKey;
  minValue?: number;
  flag?: string;
}

export interface MissionDefinition {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  difficulty: MissionDifficulty;
  /** Override duration; falls back to difficulty default when omitted. */
  durationMs?: number;
  energyCost: number;
  spawnType: MissionSpawnType;
  statRequirements?: MissionStatRequirement[];
  conditions?: MissionCondition[];
  /** Weight for random pool selection (default 1). */
  randomWeight?: number;
  rewardTableId: string;
  allowCharacter: boolean;
  allowPets: boolean;
}

export interface ActiveMission {
  missionId: string;
  assigneeType: MissionAssigneeType;
  /** `eleanora` for the companion or a pet id. */
  assigneeId: string;
  startedAt: number;
  endsAt: number;
}

export interface MissionRewardRoll {
  moneyEarned: number;
  itemsFound: { id: string; quantity: number }[];
  recipesFound: string[];
  eggsFound: string[];
  messageKey: string;
}

export interface MissionStatRequirementStatus {
  stat: StatKey;
  required: number;
  current: number;
  met: boolean;
}

export interface MissionConditionStatus {
  type: MissionCondition['type'];
  met: boolean;
  current: number;
  required: number;
}

export interface MissionBoardEntry {
  definition: MissionDefinition;
  durationMs: number;
  meetsRequirements: boolean;
  lockedReasonKey?: string;
  statStatuses: MissionStatRequirementStatus[];
  conditionStatuses: MissionConditionStatus[];
  energyCost: number;
  currentEnergy: number;
  energyMet: boolean;
}

export interface MissionAssigneeOption {
  type: MissionAssigneeType;
  id: string;
  label: string;
  visual: PetVisual | null;
  stats: CharacterStats;
  available: boolean;
  unavailableReasonKey?: string;
}
