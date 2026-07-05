import { MissionDifficulty } from '@core/interfaces/mission-definition.interface';

export interface MissionDifficultyMeta {
  labelKey: string;
  color: string;
  borderColor: string;
  glowColor: string;
  defaultDurationMs: number;
  energyCost: number;
}

/** Rarity palette aligned with item tier conventions in the project. */
export const MISSION_DIFFICULTY_META: Record<MissionDifficulty, MissionDifficultyMeta> = {
  common: {
    labelKey: 'difficultyCommon',
    color: '#d1d5db',
    borderColor: 'rgba(209, 213, 219, 0.55)',
    glowColor: 'rgba(209, 213, 219, 0.25)',
    defaultDurationMs: 60_000,
    energyCost: 8,
  },
  uncommon: {
    labelKey: 'difficultyUncommon',
    color: '#22c55e',
    borderColor: 'rgba(34, 197, 94, 0.55)',
    glowColor: 'rgba(34, 197, 94, 0.25)',
    defaultDurationMs: 120_000,
    energyCost: 12,
  },
  rare: {
    labelKey: 'difficultyRare',
    color: '#3b82f6',
    borderColor: 'rgba(59, 130, 246, 0.55)',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    defaultDurationMs: 300_000,
    energyCost: 18,
  },
  epic: {
    labelKey: 'difficultyEpic',
    color: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.55)',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    defaultDurationMs: 600_000,
    energyCost: 25,
  },
  legendary: {
    labelKey: 'difficultyLegendary',
    color: '#fbbf24',
    borderColor: 'rgba(251, 191, 36, 0.65)',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    defaultDurationMs: 900_000,
    energyCost: 35,
  },
};

export function getMissionDurationMs(difficulty: MissionDifficulty, override?: number): number {
  return override ?? MISSION_DIFFICULTY_META[difficulty].defaultDurationMs;
}
