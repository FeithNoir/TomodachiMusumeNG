import { Injectable, inject } from '@angular/core';
import { GAME_LOOP_TICK_MS } from '@core/data/game-config';
import { CharacterStatsService } from '@core/services/character-stats.service';
import { GameStateService } from '@core/services/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private gameStateService = inject(GameStateService);
  private characterStatsService = inject(CharacterStatsService);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(() => {
      if (this.gameStateService.energy() < this.characterStatsService.maxEnergy()) {
        this.gameStateService.updateEnergy(1);
      }

      if (this.gameStateService.satiety() > 0) {
        this.gameStateService.updateSatiety(-1);
      }
    }, GAME_LOOP_TICK_MS);
  }

  stop(): void {
    if (this.intervalId === null) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
