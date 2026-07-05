import { DATE_EVENTS } from '@core/data/date-events-database';
import { masterItemList } from '@core/data/item-database';
import { isEquippableCategory } from '@core/data/equippable-categories';
import { GalleryEntry } from '@core/interfaces/gallery.interface';

const OUTFIT_GALLERY_TYPES = new Set(['top', 'bottom', 'suit', 'head', 'stockings', 'hands', 'weapon']);

function buildOutfitEntries(): GalleryEntry[] {
  return Object.values(masterItemList)
    .filter(item => OUTFIT_GALLERY_TYPES.has(item.type) || isEquippableCategory(item.type))
    .map(item => ({
      id: `gallery_outfit_${item.id}`,
      category: 'outfit' as const,
      name: item.name,
      previewPath: `/${item.path}`,
      unlock: { type: 'item' as const, itemId: item.id },
    }));
}

function buildSceneEntries(): GalleryEntry[] {
  return DATE_EVENTS.map(event => ({
    id: `gallery_scene_${event.id}`,
    category: 'scene' as const,
    name: event.name,
    previewPath: event.background,
    unlock: { type: 'date' as const, eventId: event.id },
  }));
}

const MEMORY_ENTRIES: GalleryEntry[] = [
  {
    id: 'gallery_memory_25',
    category: 'memory',
    name: { es: 'Primer acercamiento', en: 'First closeness' },
    previewPath: '/assets/img/bg.jpg',
    unlock: { type: 'affinity', min: 25 },
  },
  {
    id: 'gallery_memory_50',
    category: 'memory',
    name: { es: 'Confianza mutua', en: 'Mutual trust' },
    previewPath: '/assets/img/bg.jpg',
    unlock: { type: 'affinity', min: 50 },
  },
  {
    id: 'gallery_memory_75',
    category: 'memory',
    name: { es: 'Vínculo profundo', en: 'Deep bond' },
    previewPath: '/assets/img/bg.jpg',
    unlock: { type: 'affinity', min: 75 },
  },
  {
    id: 'gallery_memory_100',
    category: 'memory',
    name: { es: 'Alma gemela', en: 'Kindred spirit' },
    previewPath: '/assets/img/bg.jpg',
    unlock: { type: 'affinity', min: 100 },
  },
];

export const GALLERY_ENTRIES: GalleryEntry[] = [
  ...buildOutfitEntries(),
  ...buildSceneEntries(),
  ...MEMORY_ENTRIES,
];

export const GALLERY_CATEGORIES: GalleryEntry['category'][] = ['outfit', 'scene', 'memory'];
