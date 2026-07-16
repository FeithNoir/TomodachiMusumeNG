import { CharacterStats } from '@core/interfaces/character-stats.interface';

export interface ActiveTemporaryEffect {
  id: string;
  sourceItemId: string;
  stats: Partial<CharacterStats>;
  expiresAt: number;
}

export interface TemporaryStatBoost {
  stats: Partial<CharacterStats>;
  durationMs: number;
}
