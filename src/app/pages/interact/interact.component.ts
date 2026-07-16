import {
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TRAINING_GAMES } from '@core/data/training-games.config';
import {
  DateEventDefinition,
  MinigameCategory,
  MinigameParticipant,
  TrainingAssigneeOption,
  TrainingGameDefinition,
  TrainingGameId,
  TrainingResult,
} from '@core/interfaces/minigame.interface';
import { LocalizationService } from '@core/services/localization.service';
import { MinigameService } from '@core/services/minigame.service';
import { FeedingService, FeedingResult } from '@core/services/feeding.service';
import { TutorialService } from '@core/services/tutorial.service';
import { GAME_TUTORIALS } from '@core/data/tutorials.config';
import { TrainingAssigneePickerComponent } from '@pages/interact/training-assignee-picker/training-assignee-picker.component';
import { FeedingFoodPickerComponent } from '@pages/interact/feeding-food-picker/feeding-food-picker.component';
import { RunnerMinigameComponent } from '@pages/interact/minigames/runner-minigame/runner-minigame.component';
import { RhythmMinigameComponent } from '@pages/interact/minigames/rhythm-minigame/rhythm-minigame.component';
import { SliceMinigameComponent } from '@pages/interact/minigames/slice-minigame/slice-minigame.component';
import { DateEventViewComponent } from '@pages/interact/date-event-view/date-event-view.component';

type InteractPhase =
  | 'hub'
  | 'training'
  | 'assign'
  | 'playing'
  | 'dates'
  | 'date-play'
  | 'experiments'
  | 'result'
  | 'feeding-assign'
  | 'feeding-select'
  | 'feeding-result';

@Component({
  selector: 'app-interact',
  standalone: true,
  imports: [
    TrainingAssigneePickerComponent,
    FeedingFoodPickerComponent,
    RunnerMinigameComponent,
    RhythmMinigameComponent,
    SliceMinigameComponent,
    DateEventViewComponent,
  ],
  templateUrl: './interact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./interact.component.css'],
})
export class InteractComponent {
  private localization = inject(LocalizationService);
  readonly minigameService = inject(MinigameService);
  private feedingService = inject(FeedingService);
  private tutorialService = inject(TutorialService);

  @Output() close = new EventEmitter<void>();

  readonly getText = this.localization.t.bind(this.localization);
  readonly trainingGames = TRAINING_GAMES;

  phase = signal<InteractPhase>('hub');
  selectedGame = signal<TrainingGameDefinition | null>(null);
  assigneeOptions = signal<TrainingAssigneeOption[]>([]);
  selectedAssignee = signal<TrainingAssigneeOption | null>(null);
  participant = signal<MinigameParticipant | null>(null);
  trainingResult = signal<TrainingResult | null>(null);
  feedingResult = signal<FeedingResult | null>(null);
  selectedDate = signal<DateEventDefinition | null>(null);
  showMinigameTutorial = signal(false);
  pendingCategory = signal<MinigameCategory | null>(null);

  readonly minigameIntroTutorial = GAME_TUTORIALS.find(t => t.autoShowOn === 'minigames');

  unlockedDates = computed(() => this.minigameService.getUnlockedDateEvents());
  lockedDates = computed(() => this.minigameService.getLockedDateEvents());
  completedDates = computed(() => this.minigameService.getCompletedDateEvents());

  title = computed(() => {
    switch (this.phase()) {
      case 'hub':
        return this.getText('interactTitle');
      case 'training':
        return this.getText('interactSelectGame');
      case 'assign':
        return this.getText('interactSelectAssignee');
      case 'feeding-assign':
        return this.getText('feedingSelectAssignee');
      case 'feeding-select':
        return this.getText('feedingTitle');
      case 'feeding-result':
        return this.getText('feedingResultTitle');
      case 'playing':
        return this.localization.localized(this.selectedGame()?.name ?? { es: '', en: '' });
      case 'dates':
      case 'date-play':
        return this.getText('dateEventsTitle');
      case 'experiments':
        return this.getText('experimentsTitle');
      case 'result':
        return this.getText('interactGameOver');
      default:
        return this.getText('interactTitle');
    }
  });

  openCategory(category: MinigameCategory): void {
    if (category === 'training') {
      if (this.tutorialService.shouldAutoShowMinigames()) {
        this.pendingCategory.set('training');
        this.showMinigameTutorial.set(true);
        return;
      }
      this.phase.set('training');
      return;
    }
    if (category === 'dates') {
      this.phase.set('dates');
      return;
    }
    if (category === 'feeding') {
      this.assigneeOptions.set(this.feedingService.buildFeedingAssignees());
      this.phase.set('feeding-assign');
      return;
    }
    this.phase.set('experiments');
  }

  dismissMinigameTutorial(): void {
    this.tutorialService.markSeen(this.tutorialService.getMinigamesIntroId());
    this.showMinigameTutorial.set(false);
    const pending = this.pendingCategory();
    if (pending) {
      this.openCategory(pending);
      this.pendingCategory.set(null);
    }
  }

  selectTrainingGame(game: TrainingGameDefinition): void {
    this.selectedGame.set(game);
    this.assigneeOptions.set(this.minigameService.buildTrainingAssignees(game.energyCost));
    this.phase.set('assign');
  }

  onAssigneeSelected(option: TrainingAssigneeOption): void {
    this.selectedAssignee.set(option);
    this.participant.set(this.minigameService.toParticipant(option));
    this.phase.set('playing');
  }

  onFeedingAssigneeSelected(option: TrainingAssigneeOption): void {
    this.selectedAssignee.set(option);
    this.phase.set('feeding-select');
  }

  onFoodSelected(itemId: string): void {
    const assignee = this.selectedAssignee();
    if (!assignee) {
      return;
    }
    const result = this.feedingService.feed(assignee, itemId);
    if (result) {
      this.feedingResult.set(result);
      this.phase.set('feeding-result');
    }
  }

  onGameFinished(score: number): void {
    const game = this.selectedGame();
    const assignee = this.selectedAssignee();
    if (!game || !assignee) {
      return;
    }

    const result =
      game.id === 'runner'
        ? this.minigameService.applyRunnerResult(assignee, score)
        : this.minigameService.applyTrainingResult(game.id as TrainingGameId, assignee, score);
    this.trainingResult.set(result);
    this.phase.set('result');
  }

  selectDateEvent(event: DateEventDefinition): void {
    this.selectedDate.set(event);
    this.phase.set('date-play');
  }

  onDateCompleted(): void {
    this.selectedDate.set(null);
    this.phase.set('dates');
  }

  goBack(): void {
    const current = this.phase();
    if (current === 'date-play') {
      this.selectedDate.set(null);
      this.phase.set('dates');
      return;
    }
    if (current === 'assign') {
      this.phase.set('training');
      return;
    }
    if (current === 'feeding-select') {
      this.phase.set('feeding-assign');
      return;
    }
    if (current === 'feeding-result') {
      this.resetFeeding();
      this.phase.set('feeding-assign');
      return;
    }
    if (current === 'feeding-assign') {
      this.resetFeeding();
      this.phase.set('hub');
      return;
    }
    if (current === 'training' || current === 'dates' || current === 'experiments') {
      this.phase.set('hub');
      return;
    }
    if (current === 'result') {
      this.resetTraining();
      this.phase.set('training');
      return;
    }
    this.phase.set('hub');
  }

  onClose(): void {
    this.close.emit();
  }

  localized(field: { es: string; en: string }): string {
    return this.localization.localized(field);
  }

  resultSummary(): string {
    const result = this.trainingResult();
    const game = this.selectedGame();
    const assignee = this.selectedAssignee();
    if (!result || !game || !assignee) {
      return '';
    }

    if (assignee.type === 'character') {
      if (game.id === 'runner') {
        return this.getText('runnerResultAffinity', result.affinityGain);
      }
      return this.getText('minigameResultAffinity', result.affinityGain);
    }
    if (game.id === 'runner') {
      return this.getText('runnerResultStat', game.statKey, result.statGain);
    }
    return this.getText('minigameResultStat', game.statKey, result.statGain);
  }

  feedingResultSummary(): string {
    const result = this.feedingResult();
    const assignee = this.selectedAssignee();
    if (!result || !assignee) {
      return '';
    }

    if (assignee.type === 'character') {
      if (result.preference === 'liked') {
        return this.getText('feedingResultAffinityLiked', result.affinityDelta);
      }
      if (result.preference === 'disliked') {
        return this.getText('feedingResultAffinityDisliked', Math.abs(result.affinityDelta));
      }
      return this.getText('feedingResultNeutral');
    }

    if (result.preference === 'liked') {
      return this.getText('feedingResultBondLiked', result.bondDelta);
    }
    if (result.preference === 'disliked') {
      return this.getText('feedingResultBondDisliked', Math.abs(result.bondDelta));
    }
    return this.getText('feedingResultNeutral');
  }

  private resetTraining(): void {
    this.selectedGame.set(null);
    this.selectedAssignee.set(null);
    this.participant.set(null);
    this.trainingResult.set(null);
  }

  private resetFeeding(): void {
    this.selectedAssignee.set(null);
    this.feedingResult.set(null);
  }
}
