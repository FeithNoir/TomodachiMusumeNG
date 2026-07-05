import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private gameStateService = inject(GameStateService);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private readonly TICK_MS = 3000;

  start(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(() => {
      if (this.gameStateService.energy() < 100) {
        this.gameStateService.updateEnergy(1);
      }

      if (this.gameStateService.satiety() > 0) {
        this.gameStateService.updateSatiety(-1);
      }
    }, this.TICK_MS);
  }

  stop(): void {
    if (this.intervalId === null) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
