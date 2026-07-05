import { Component, inject, signal, computed, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ARMOR_SET_LABELS } from '@core/data/armor-sets';
import { masterItemList } from '@core/data/item-database';
import { GalleryCategory, GalleryEntry } from '@core/interfaces/gallery.interface';
import { GalleryService } from '@core/services/gallery.service';
import { GameStateService } from '@core/services/game-state.service';
import { LocalizationService } from '@core/services/localization.service';
import { resolveLocalizedText } from '@core/utils/localization.util';

interface GallerySetGroup {
  setId: string;
  label: string;
  entries: GalleryEntry[];
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './gallery.component.css',
})
export class GalleryComponent {
  private galleryService = inject(GalleryService);
  private gameState = inject(GameStateService);
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  readonly getText = this.localization.t.bind(this.localization);
  activeCategory = signal<GalleryCategory>('outfit');

  progress = this.galleryService.progress;

  entries = computed(() => this.galleryService.getEntries(this.activeCategory()));

  entryGroups = computed((): GallerySetGroup[] => {
    const entries = this.entries();
    const category = this.activeCategory();

    if (category !== 'outfit') {
      return [{ setId: category, label: '', entries }];
    }

    return this.groupOutfitEntries(entries);
  });

  setCategory(category: GalleryCategory): void {
    this.activeCategory.set(category);
  }

  isUnlocked(entryId: string): boolean {
    const entry = this.entries().find(item => item.id === entryId);
    return entry ? this.galleryService.isUnlocked(entry) : false;
  }

  localized(field: { es: string; en: string }): string {
    return this.localization.localized(field);
  }

  onClose(): void {
    this.close.emit();
  }

  private groupOutfitEntries(entries: GalleryEntry[]): GallerySetGroup[] {
    const lang = this.gameState.language();
    const groups = new Map<string, GalleryEntry[]>();

    for (const entry of entries) {
      let setId = 'misc';
      if (entry.unlock.type === 'item') {
        const item = masterItemList[entry.unlock.itemId];
        setId = item?.armorSet ?? 'misc';
      }

      const list = groups.get(setId) ?? [];
      list.push(entry);
      groups.set(setId, list);
    }

    return [...groups.entries()]
      .map(([setId, groupEntries]) => ({
        setId,
        label: resolveLocalizedText(ARMOR_SET_LABELS[setId] ?? ARMOR_SET_LABELS['misc'], lang),
        entries: groupEntries,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
