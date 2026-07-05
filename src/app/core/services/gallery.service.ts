import { Injectable, computed, inject } from '@angular/core';
import { GALLERY_ENTRIES, GALLERY_CATEGORIES } from '@core/data/gallery-database';
import { GalleryCategory, GalleryEntry } from '@core/interfaces/gallery.interface';
import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private gameState = inject(GameStateService);
  private characterService = inject(CharacterService);

  readonly categories = GALLERY_CATEGORIES;

  readonly progress = computed(() => {
    const unlocked = GALLERY_ENTRIES.filter(entry => this.isUnlocked(entry)).length;
    return { unlocked, total: GALLERY_ENTRIES.length };
  });

  getEntries(category: GalleryCategory): GalleryEntry[] {
    return GALLERY_ENTRIES.filter(entry => entry.category === category);
  }

  isUnlocked(entry: GalleryEntry): boolean {
    const state = this.gameState.gameState();
    const inventoryIds = new Set(state.inventory.map(item => item.id));
    const equippedIds = new Set(Object.values(state.equipped).filter(Boolean));

    switch (entry.unlock.type) {
      case 'item':
        return inventoryIds.has(entry.unlock.itemId) || equippedIds.has(entry.unlock.itemId);
      case 'date':
        return state.completedDateEvents.includes(entry.unlock.eventId);
      case 'affinity':
        return this.characterService.affinity() >= entry.unlock.min;
      default:
        return false;
    }
  }
}
