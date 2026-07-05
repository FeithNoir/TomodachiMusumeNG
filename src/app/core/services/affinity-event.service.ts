import { Injectable, inject } from '@angular/core';
import { AFFINITY_MAX } from '@core/data/game-config';
import {
  AffinityChangedPayload,
  AffinityThresholdPayload,
  GAME_EVENT_TYPES,
} from '@core/interfaces/game-event.interface';
import { GameEventService } from '@core/services/game-event.service';

const AFFINITY_THRESHOLDS = [25, 50, 75, 100];

@Injectable({
  providedIn: 'root',
})
export class AffinityEventService {
  private gameEvents = inject(GameEventService);
  private reachedThresholds = new Set<number>();

  emitAffinityChange(previous: number, current: number): void {
    const delta = current - previous;
    const payload: AffinityChangedPayload = { delta, current, previous };
    this.gameEvents.emit(GAME_EVENT_TYPES.AFFINITY_CHANGED, payload);
    this.checkThresholds(previous, current);
  }

  private checkThresholds(previous: number, current: number): void {
    for (const level of AFFINITY_THRESHOLDS) {
      if (level > AFFINITY_MAX) {
        continue;
      }

      if (previous < level && current >= level && !this.reachedThresholds.has(level)) {
        this.reachedThresholds.add(level);
        const payload: AffinityThresholdPayload = { level, current };
        this.gameEvents.emit(GAME_EVENT_TYPES.AFFINITY_THRESHOLD, payload);
      }
    }
  }

  resetSessionThresholds(): void {
    this.reachedThresholds.clear();
  }
}
