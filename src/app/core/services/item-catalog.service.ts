import { Injectable } from '@angular/core';
import { DEFAULT_LANGUAGE } from '@core/data/game-config';
import { ITEM_STAT_META } from '@core/data/item-stat-overrides';
import { masterItemList } from '@core/data/item-database';
import { CharacterStats, STAT_KEYS } from '@core/interfaces/character-stats.interface';
import { Item } from '@core/interfaces/item.interface';
import { resolveLocalizedText } from '@core/utils/localization.util';
import { normalizeAssetPath } from '@core/utils/asset.util';

@Injectable({
  providedIn: 'root',
})
export class ItemCatalogService {

  getItem(itemId: string): Item | undefined {
    return masterItemList[itemId];
  }

  getItemStats(itemId: string): Partial<CharacterStats> {
    const item = masterItemList[itemId];
    const meta = ITEM_STAT_META[itemId];
    const merged: Partial<CharacterStats> = {};

    for (const key of STAT_KEYS) {
      const fromItem = item?.stats?.[key] ?? 0;
      const fromMeta = meta?.stats?.[key] ?? 0;
      const value = fromItem + fromMeta;
      if (value !== 0) {
        merged[key] = value;
      }
    }

    return merged;
  }

  getArmorSet(itemId: string): string | undefined {
    return masterItemList[itemId]?.armorSet ?? ITEM_STAT_META[itemId]?.armorSet;
  }

  getItemName(itemId: string | null | undefined, language: string = DEFAULT_LANGUAGE): string {
    if (!itemId) {
      return '';
    }

    const item = masterItemList[itemId];
    if (!item) {
      return 'Unknown';
    }

    return resolveLocalizedText(item.name, language);
  }

  getItemPath(itemId: string | null | undefined): string {
    if (!itemId) {
      return '';
    }

    return normalizeAssetPath(masterItemList[itemId]?.path ?? '');
  }
}
