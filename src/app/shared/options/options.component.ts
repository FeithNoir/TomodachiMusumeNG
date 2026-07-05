import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { GameStateService } from '@core/services/game-state.service';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  private gameStateService = inject(GameStateService);
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  public currentLang = this.gameStateService.language;
  readonly getText = this.localization.t.bind(this.localization);

  setLanguage(lang: string): void {
    this.gameStateService.setLanguage(lang);
    this.gameStateService.saveGame();
  }

  onClose(): void {
    this.close.emit();
  }
}
