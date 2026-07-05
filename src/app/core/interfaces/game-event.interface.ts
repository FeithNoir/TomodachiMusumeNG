export interface GameEvent<T = unknown> {
  type: string;
  payload?: T;
  timestamp: number;
}

export const GAME_EVENT_TYPES = {
  AFFINITY_CHANGED: 'affinity.changed',
  AFFINITY_THRESHOLD: 'affinity.threshold',
  ITEM_EQUIPPED: 'item.equipped',
  ITEM_USED: 'item.used',
  MISSION_COMPLETED: 'mission.completed',
  MISSION_STARTED: 'mission.started',
} as const;

export type GameEventType = (typeof GAME_EVENT_TYPES)[keyof typeof GAME_EVENT_TYPES];

export interface AffinityChangedPayload {
  delta: number;
  current: number;
  previous: number;
}

export interface AffinityThresholdPayload {
  level: number;
  current: number;
}
