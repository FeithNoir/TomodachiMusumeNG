import { Injectable, inject } from '@angular/core';
import { ENERGY_MAX, GAME_LOOP_TICK_MS } from '@core/data/game-config';
import { GameStateService } from '@core/services/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private gameStateService = inject(GameStateService);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(() => {
      if (this.gameStateService.energy() < ENERGY_MAX) {
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
