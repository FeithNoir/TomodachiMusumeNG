import { Injectable, computed, inject } from '@angular/core';
import { DATE_EVENTS } from '@core/data/date-events-database';
import { TRAINING_GAME_MAP } from '@core/data/training-games.config';
import { COMPANION_MISSION_ID } from '@core/data/game-config';
import {
  DateEventDefinition,
  MinigameParticipant,
  TrainingAssigneeOption,
  TrainingGameId,
  TrainingResult,
} from '@core/interfaces/minigame.interface';
import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';
import { LocalizationService } from '@core/services/localization.service';
import { MissionService } from '@core/services/mission.service';
import { NotificationService } from '@core/services/notification.service';
import { PetService } from '@core/services/pet.service';

@Injectable({
  providedIn: 'root',
})
export class MinigameService {
  private gameState = inject(GameStateService);
  private characterService = inject(CharacterService);
  private petService = inject(PetService);
  private missionService = inject(MissionService);
  private notifications = inject(NotificationService);
  private localization = inject(LocalizationService);

  readonly completedDateEvents = computed(
    () => this.gameState.gameState().completedDateEvents
  );

  buildTrainingAssignees(energyCost: number): TrainingAssigneeOption[] {
    const options: TrainingAssigneeOption[] = [];
    const active = this.gameState.gameState().activeMission;
    const busyIds = new Set<string>();

    if (active && Date.now() < active.endsAt) {
      busyIds.add(active.assigneeId);
    }

    const energyOk = this.gameState.energy() >= energyCost;
    options.push({
      type: 'character',
      id: COMPANION_MISSION_ID,
      label: this.gameState.gameState().characterName,
      visual: null,
      available: !busyIds.has(COMPANION_MISSION_ID) && energyOk,
      unavailableReasonKey: !energyOk ? 'noEnergy' : 'missionAssigneeBusy',
    });

    for (const pet of this.petService.pets()) {
      options.push({
        type: 'pet',
        id: pet.id,
        label: pet.name,
        visual: pet.visual,
        available: !busyIds.has(pet.id),
        unavailableReasonKey: 'missionAssigneeBusy',
      });
    }

    return options;
  }

  toParticipant(option: TrainingAssigneeOption): MinigameParticipant {
    if (option.type === 'character') {
      return {
        type: 'character',
        id: option.id,
        label: option.label,
        display: 'image',
        src: '/assets/img/character/base.png',
      };
    }

    if (option.visual?.type === 'image') {
      return {
        type: 'pet',
        id: option.id,
        label: option.label,
        display: 'image',
        src: option.visual.value,
      };
    }

    return {
      type: 'pet',
      id: option.id,
      label: option.label,
      display: 'emoji',
      src: option.visual?.value ?? '🐾',
    };
  }

  applyTrainingResult(
    gameId: TrainingGameId,
    assignee: TrainingAssigneeOption,
    score: number
  ): TrainingResult {
    const game = TRAINING_GAME_MAP[gameId];
    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
    const statGain = Math.max(1, Math.round(clampedScore / 25));
    let affinityGain = 0;

    if (assignee.type === 'character') {
      this.gameState.updateEnergy(-game.energyCost);
      affinityGain = Math.max(1, Math.round(clampedScore / 20));
      this.characterService.updateAffinity(affinityGain);
    } else {
      this.petService.trainPet(assignee.id, game.statKey, statGain);
    }

    const result: TrainingResult = {
      score: clampedScore,
      statGain,
      affinityGain,
      assigneeLabel: assignee.label,
    };

    this.notifications.success(
      this.localization.t('minigameTrainingComplete', clampedScore)
    );

    return result;
  }

  getUnlockedDateEvents(): DateEventDefinition[] {
    const affinity = this.characterService.affinity();
    const completed = new Set(this.completedDateEvents());
    return DATE_EVENTS.filter(
      event => affinity >= event.requiredAffinity && !completed.has(event.id)
    );
  }

  getLockedDateEvents(): DateEventDefinition[] {
    const affinity = this.characterService.affinity();
    const completed = new Set(this.completedDateEvents());
    return DATE_EVENTS.filter(
      event => affinity < event.requiredAffinity && !completed.has(event.id)
    );
  }

  getCompletedDateEvents(): DateEventDefinition[] {
    const completed = new Set(this.completedDateEvents());
    return DATE_EVENTS.filter(event => completed.has(event.id));
  }

  completeDateEvent(eventId: string, choiceId: string): boolean {
    const event = DATE_EVENTS.find(entry => entry.id === eventId);
    if (!event) {
      return false;
    }

    const choice = event.choices.find(entry => entry.id === choiceId);
    if (!choice) {
      return false;
    }

    if (this.completedDateEvents().includes(eventId)) {
      return false;
    }

    this.characterService.updateAffinity(choice.affinityChange);
    this.gameState.updateState(state => ({
      ...state,
      completedDateEvents: [...state.completedDateEvents, eventId],
    }));

    this.notifications.success(
      this.localization.t('dateEventComplete', choice.affinityChange)
    );
    return true;
  }

  isCharacterOnMission(): boolean {
    return this.missionService.isCharacterAway();
  }
}
