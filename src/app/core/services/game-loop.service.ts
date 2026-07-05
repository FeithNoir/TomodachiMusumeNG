import { Injectable, inject } from '@angular/core';
import { GAME_LOOP_TICK_MS, MISSION_TICK_MS } from '@core/data/game-config';
import { CharacterStatsService } from '@core/services/character-stats.service';
import { GameStateService } from '@core/services/game-state.service';
import { MissionService } from '@core/services/mission.service';
import { MissionRewardService } from '@core/services/mission-reward.service';
import { PetService } from '@core/services/pet.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private gameStateService = inject(GameStateService);
  private characterStatsService = inject(CharacterStatsService);
  private missionService = inject(MissionService);
  private missionRewardService = inject(MissionRewardService);
  private petService = inject(PetService);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private missionIntervalId: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.missionService.tickClock();
    this.resolveCompletedMission();

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
      this.resolveCompletedMission();
    }, MISSION_TICK_MS);
  }

  private resolveCompletedMission(): void {
    const reward = this.missionService.tickActiveMission();
    if (reward) {
      this.missionRewardService.show(reward);
    }
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
