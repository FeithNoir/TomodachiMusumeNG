import { Component, inject, signal, computed, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { GalleryCategory } from '@core/interfaces/gallery.interface';
import { GalleryService } from '@core/services/gallery.service';
import { LocalizationService } from '@core/services/localization.service';

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
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  readonly getText = this.localization.t.bind(this.localization);
  activeCategory = signal<GalleryCategory>('outfit');

  progress = this.galleryService.progress;

  entries = computed(() => this.galleryService.getEntries(this.activeCategory()));

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
}
