import {
  DEFAULT_EXPRESSION,
  EXPRESSION_EYES_BLINK,
  EXPRESSION_EYES_IDLE,
} from '@core/data/game-config';

/** Ensures asset paths work consistently in templates (`/assets/...`). */
export function normalizeAssetPath(path: string): string {
  if (!path) {
    return '';
  }

  if (path.startsWith('http') || path.startsWith('/')) {
    return path;
  }

  return `/${path.replace(/^\/+/, '')}`;
}

export function isDefaultIdleEyes(eyesPath: string): boolean {
  const normalized = normalizeAssetPath(eyesPath);
  return normalized === EXPRESSION_EYES_IDLE || normalized === normalizeAssetPath(DEFAULT_EXPRESSION.eyes);
}

export function defaultExpressionPaths(): { eyes: string; mouth: string } {
  return {
    eyes: EXPRESSION_EYES_IDLE,
    mouth: normalizeAssetPath(DEFAULT_EXPRESSION.mouth),
  };
}

export function blinkExpressionPaths(currentMouth: string): { eyes: string; mouth: string } {
  return {
    eyes: EXPRESSION_EYES_BLINK,
    mouth: normalizeAssetPath(currentMouth),
  };
}
