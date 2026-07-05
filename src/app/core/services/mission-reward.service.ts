import { Injectable, signal } from '@angular/core';
import { MissionRewardRoll } from '@core/interfaces/mission-definition.interface';

@Injectable({
  providedIn: 'root',
})
export class MissionRewardService {
  readonly pendingReward = signal<MissionRewardRoll | null>(null);

  show(reward: MissionRewardRoll): void {
    this.pendingReward.set(reward);
  }

  dismiss(): void {
    this.pendingReward.set(null);
  }
}
