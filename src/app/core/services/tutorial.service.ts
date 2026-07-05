import { Injectable, inject } from '@angular/core';
import { GAME_TUTORIALS } from '@core/data/tutorials.config';
import { GameStateService } from '@core/services/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  private gameState = inject(GameStateService);

  getAll() {
    return GAME_TUTORIALS;
  }

  hasSeen(tutorialId: string): boolean {
    return this.gameState.gameState().seenTutorials.includes(tutorialId);
  }

  markSeen(tutorialId: string): void {
    if (this.hasSeen(tutorialId)) {
      return;
    }
    this.gameState.updateState(state => ({
      ...state,
      seenTutorials: [...state.seenTutorials, tutorialId],
    }));
  }

  shouldAutoShowMinigames(): boolean {
    const intro = GAME_TUTORIALS.find(t => t.autoShowOn === 'minigames');
    return intro ? !this.hasSeen(intro.id) : false;
  }

  getMinigamesIntroId(): string {
    return GAME_TUTORIALS.find(t => t.autoShowOn === 'minigames')?.id ?? 'minigames_intro';
  }
}
