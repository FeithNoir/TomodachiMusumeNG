import { StatKey } from '@core/interfaces/character-stats.interface';

export type StatBarTier = 'base' | 'low' | 'medium' | 'high';

export const STAT_DISPLAY_MAX: Record<StatKey, number> = {
  attack: 40,
  defense: 40,
  magic: 40,
  health: 200,
  luck: 25,
  endurance: 150,
  stealth: 25,
};

export function resolveStatBarTier(value: number, baseValue: number, maxScale: number): StatBarTier {
  if (value <= baseValue) {
    return 'base';
  }

  const ratio = value / maxScale;
  if (ratio < 0.35) {
    return 'low';
  }
  if (ratio < 0.65) {
    return 'medium';
  }
  return 'high';
}

export function statBarFillPercent(value: number, maxScale: number): number {
  return Math.max(4, Math.min(100, Math.round((value / maxScale) * 100)));
}
