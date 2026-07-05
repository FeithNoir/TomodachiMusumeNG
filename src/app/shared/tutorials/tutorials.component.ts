import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TutorialService } from '@core/services/tutorial.service';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialsComponent {
  private tutorialService = inject(TutorialService);
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  readonly entries = this.tutorialService.getAll();
  readonly getText = this.localization.t.bind(this.localization);

  localized(field: { es: string; en: string }): string {
    return this.localization.localized(field);
  }

  isSeen(id: string): boolean {
    return this.tutorialService.hasSeen(id);
  }

  markSeen(id: string): void {
    this.tutorialService.markSeen(id);
  }

  onClose(): void {
    this.close.emit();
  }
}
