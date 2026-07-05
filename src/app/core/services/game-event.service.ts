import { Injectable, signal } from '@angular/core';
import { GameEvent } from '@core/interfaces/game-event.interface';

@Injectable({
  providedIn: 'root',
})
export class GameEventService {
  private readonly maxHistory = 50;
  private eventsState = signal<GameEvent[]>([]);

  readonly events = this.eventsState.asReadonly();

  emit<T>(type: string, payload?: T): GameEvent<T> {
    const event: GameEvent<T> = {
      type,
      payload,
      timestamp: Date.now(),
    };

    this.eventsState.update(history => [event, ...history].slice(0, this.maxHistory));
    return event;
  }

  clear(): void {
    this.eventsState.set([]);
  }
}
