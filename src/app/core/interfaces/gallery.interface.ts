import { LocalizedText } from '@core/interfaces/localized-text.interface';

export type GalleryCategory = 'outfit' | 'scene' | 'memory';

export type GalleryUnlockRule =
  | { type: 'item'; itemId: string }
  | { type: 'date'; eventId: string }
  | { type: 'affinity'; min: number };

export interface GalleryEntry {
  id: string;
  category: GalleryCategory;
  name: LocalizedText;
  previewPath: string;
  unlock: GalleryUnlockRule;
}
