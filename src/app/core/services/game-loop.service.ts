import { Injectable, inject } from '@angular/core';
import { GAME_LOOP_TICK_MS, MISSION_TICK_MS } from '@core/data/game-config';
import { CharacterStatsService } from '@core/services/character-stats.service';
import { GameStateService } from '@core/services/game-state.service';
import { MissionService } from '@core/services/mission.service';
import { PetService } from '@core/services/pet.service';
import { NotificationService } from '@core/services/notification.service';
import { LocalizationService } from '@core/services/localization.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private gameStateService = inject(GameStateService);
  private characterStatsService = inject(CharacterStatsService);
  private missionService = inject(MissionService);
  private petService = inject(PetService);
  private notifications = inject(NotificationService);
  private localization = inject(LocalizationService);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private missionIntervalId: ReturnType<typeof setInterval> | null = null;

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

    this.missionIntervalId = setInterval(() => {
      this.missionService.tickClock();
      this.petService.tickIncubation();
      const reward = this.missionService.tickActiveMission();
      if (reward) {
        this.notifications.success(this.localization.t('missionCompleteToast'));
      }
    }, MISSION_TICK_MS);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.missionIntervalId !== null) {
      clearInterval(this.missionIntervalId);
      this.missionIntervalId = null;
    }
  }
}
