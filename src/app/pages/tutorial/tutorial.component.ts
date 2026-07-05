import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { GameStateService } from '@core/services/game-state.service';
import { LocalizationService } from '@core/services/localization.service';

export enum TutorialStep {
  LANGUAGE,
  INTRO,
  NAME,
  CONFIRM,
  OUTRO
}

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tutorial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './tutorial.component.css'
})
export class TutorialComponent {
  private gameStateService = inject(GameStateService);
  private localization = inject(LocalizationService);

  public step = signal<TutorialStep>(TutorialStep.LANGUAGE);
  public selectedLang = signal<string>('en');
  public playerNameInput = signal<string>('');

  public steps = TutorialStep;
  readonly getText = this.localization.t.bind(this.localization);

  selectLanguage(lang: string): void {
    this.selectedLang.set(lang);
    this.gameStateService.setLanguage(lang);
    this.nextStep();
  }

  nextStep(): void {
    const next = this.step() + 1;
    if (next <= TutorialStep.OUTRO) {
      this.step.set(next);
    }
  }

  confirmName(): void {
    if (this.playerNameInput().trim().length > 0) {
      this.nextStep();
    }
  }

  finishTutorial(): void {
    this.gameStateService.setPlayerName(this.playerNameInput().trim());
    this.gameStateService.setHasCompletedIntro(true);
    this.gameStateService.saveGame();
  }
}
