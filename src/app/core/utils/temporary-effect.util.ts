import { STAT_KEYS } from '@core/interfaces/character-stats.interface';
import { ActiveTemporaryEffect } from '@core/interfaces/temporary-effect.interface';

export function sumTemporaryEffects(
  effects: ActiveTemporaryEffect[],
  now = Date.now()
): Partial<Record<(typeof STAT_KEYS)[number], number>> {
  const bonus: Partial<Record<(typeof STAT_KEYS)[number], number>> = {};

  for (const effect of effects) {
    if (effect.expiresAt <= now) {
      continue;
    }
    for (const key of STAT_KEYS) {
      bonus[key] = (bonus[key] ?? 0) + (effect.stats[key] ?? 0);
    }
  }

  return bonus;
}

export function filterActiveEffects(
  effects: ActiveTemporaryEffect[],
  now = Date.now()
): ActiveTemporaryEffect[] {
  return effects.filter(effect => effect.expiresAt > now);
}
