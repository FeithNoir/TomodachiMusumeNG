import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';

import { CharacterComponent } from '@shared/character/character.component';
import { GameLoopService } from '@core/services/game-loop.service';
import { MissionService } from '@core/services/mission.service';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CharacterComponent],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  private gameLoopService = inject(GameLoopService);
  private missionService = inject(MissionService);
  private localization = inject(LocalizationService);

  isCharacterAway = this.missionService.isCharacterAway;
  missionProgress = this.missionService.missionProgress;
  readonly getText = this.localization.t.bind(this.localization);

  ngOnInit(): void {
    this.gameLoopService.start();
  }

  ngOnDestroy(): void {
    this.gameLoopService.stop();
  }
}
