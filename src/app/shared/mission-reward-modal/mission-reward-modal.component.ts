import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MissionRewardService } from '@core/services/mission-reward.service';
import { LocalizationService } from '@core/services/localization.service';
import { summarizeMissionReward } from '@core/utils/mission-reward.util';

@Component({
  selector: 'app-mission-reward-modal',
  standalone: true,
  imports: [],
  templateUrl: './mission-reward-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './mission-reward-modal.component.css',
})
export class MissionRewardModalComponent {
  private missionRewardService = inject(MissionRewardService);
  private localization = inject(LocalizationService);

  readonly getText = this.localization.t.bind(this.localization);
  readonly pendingReward = this.missionRewardService.pendingReward;

  summary() {
    const reward = this.pendingReward();
    if (!reward) {
      return null;
    }
    return summarizeMissionReward(reward, this.localization);
  }

  dismiss(): void {
    this.missionRewardService.dismiss();
  }
}
