import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../core/services/game-state.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.css'
})
export class TutorialComponent {
  private gameStateService = inject(GameStateService);

  public step = signal<TutorialStep>(TutorialStep.LANGUAGE);
  public selectedLang = signal<string>('en');
  public playerNameInput = signal<string>('');

  public steps = TutorialStep;

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
