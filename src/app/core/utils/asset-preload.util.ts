import { normalizeAssetPath } from '@core/utils/asset.util';
import {
  DEFAULT_EXPRESSION,
  EXPRESSION_EYES_BLINK,
  EXPRESSION_EYES_IDLE,
} from '@core/data/game-config';

export function preloadImage(path: string): void {
  const url = normalizeAssetPath(path);
  if (!url) {
    return;
  }
  const img = new Image();
  img.src = url;
}

export function preloadImages(paths: string[]): void {
  const unique = [...new Set(paths.map(normalizeAssetPath).filter(Boolean))];
  for (const path of unique) {
    preloadImage(path);
  }
}

export function preloadCharacterBaseAssets(): void {
  preloadImages([
    '/assets/img/character/base.png',
    EXPRESSION_EYES_IDLE,
    EXPRESSION_EYES_BLINK,
    DEFAULT_EXPRESSION.mouth,
  ]);
}

export function preloadEquippedAssets(
  equipped: Record<string, string | null>,
  resolvePath: (itemId: string) => string
): void {
  const paths = Object.values(equipped)
    .filter((id): id is string => !!id)
    .map(resolvePath);
  preloadImages(paths);
}
