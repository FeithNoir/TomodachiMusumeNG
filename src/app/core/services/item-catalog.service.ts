import { Injectable, inject } from '@angular/core';
import { masterItemList } from '../data/item-database';
import { Item } from '../interfaces/item.interface';
import { resolveLocalizedText } from '../utils/localization.util';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class ItemCatalogService {
  private gameStateService = inject(GameStateService);

  getItem(itemId: string): Item | undefined {
    return masterItemList[itemId];
  }

  getItemName(itemId: string | null | undefined): string {
    if (!itemId) {
      return '';
    }

    const item = masterItemList[itemId];
    if (!item) {
      return 'Unknown';
    }

    return resolveLocalizedText(item.name, this.gameStateService.language());
  }

  getItemPath(itemId: string | null | undefined): string {
    if (!itemId) {
      return '';
    }

    return masterItemList[itemId]?.path ?? '';
  }
}
