import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MissionBoardComponent } from '@pages/mission/mission-board/mission-board.component';
import { MissionAssigneePickerComponent } from '@pages/mission/mission-assignee-picker/mission-assignee-picker.component';
import { MissionBoardService } from '@core/services/mission-board.service';
import { MissionService } from '@core/services/mission.service';
import { LocalizationService } from '@core/services/localization.service';
import { EGG_DEFINITIONS } from '@core/data/egg-database';
import { PET_SPECIES } from '@core/data/pet-species-database';
import {
  MissionAssigneeOption,
  MissionBoardEntry,
  MissionRewardRoll,
} from '@core/interfaces/mission-definition.interface';

type MissionPhase = 'board' | 'assign' | 'progress' | 'complete';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MissionBoardComponent, MissionAssigneePickerComponent],
  templateUrl: './mission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./mission.component.css'],
})
export class MissionComponent implements OnInit, OnDestroy {
  private missionService = inject(MissionService);
  private missionBoardService = inject(MissionBoardService);
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  public phase = signal<MissionPhase>('board');
  public selectedMission = signal<MissionBoardEntry | null>(null);
  public assigneeOptions = signal<MissionAssigneeOption[]>([]);
  public resultText = signal('');
  public title = signal('');

  public boardEntries = this.missionBoardService.boardEntries;
  public progress = this.missionService.missionProgress;
  public isComplete = computed(() => this.phase() === 'complete');
  public isProgressPhase = computed(() => this.phase() === 'progress');

  readonly getText = this.localization.t.bind(this.localization);

  private progressInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (this.missionService.isMissionInProgress()) {
      this.phase.set('progress');
      this.title.set(this.getText('missionInProgressTitle'));
      this.startProgressPolling();
      return;
    }

    this.title.set(this.getText('missionBoardTitle'));
  }

  ngOnDestroy(): void {
    this.stopProgressPolling();
  }

  onMissionSelected(entry: MissionBoardEntry): void {
    this.selectedMission.set(entry);
    this.assigneeOptions.set(this.missionService.buildAssigneeOptions(entry.definition));
    this.phase.set('assign');
    this.title.set(this.getText('missionSelectAssignee'));
  }

  onAssigneeSelected(option: MissionAssigneeOption): void {
    const mission = this.selectedMission();
    if (!mission) {
      return;
    }

    const started = this.missionService.startMission(
      mission.definition.id,
      option.type,
      option.id
    );

    if (!started) {
      return;
    }

    this.phase.set('progress');
    this.title.set(this.getText('missionInProgressTitle'));
    this.startProgressPolling();
    this.close.emit();
  }

  onRefreshBoard(): void {
    this.missionBoardService.refreshRandomBoard();
  }

  onBackToBoard(): void {
    this.selectedMission.set(null);
    this.phase.set('board');
    this.title.set(this.getText('missionBoardTitle'));
  }

  private startProgressPolling(): void {
    this.stopProgressPolling();
    this.progressInterval = setInterval(() => {
      if (!this.missionService.isMissionInProgress() && this.phase() === 'progress') {
        this.phase.set('board');
        this.title.set(this.getText('missionBoardTitle'));
        this.stopProgressPolling();
      }
    }, 500);
  }

  private stopProgressPolling(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private showResults(reward: MissionRewardRoll): void {
    this.phase.set('complete');
    this.title.set(this.getText('complete'));
    this.resultText.set(this.formatResultText(reward));
  }

  private formatResultText(result: MissionRewardRoll): string {
    const success =
      result.moneyEarned > 0 ||
      result.itemsFound.length > 0 ||
      result.eggsFound.length > 0 ||
      result.recipesFound.length > 0;

    let text = success ? this.getText('returned') : this.getText('returnedNothing');
    text += '<br>';

    if (result.moneyEarned > 0) {
      text += `${this.getText('gains')}: ${result.moneyEarned}<br>`;
    }

    if (result.itemsFound.length > 0) {
      const itemNames = result.itemsFound.map(item => {
        const name = this.localization.itemName(item.id);
        return `${name} (x${item.quantity})`;
      });
      text += `${this.getText('items')}: ${itemNames.join(', ')}<br>`;
    }

    if (result.eggsFound.length > 0) {
      const eggNames = result.eggsFound.map(eggId => {
        const egg = EGG_DEFINITIONS[eggId];
        if (!egg) {
          return eggId;
        }
        const species = PET_SPECIES[egg.speciesId];
        const speciesName = species ? this.localization.localized(species.name) : egg.speciesId;
        return `${this.localization.localized(egg.name)} → ${speciesName}`;
      });
      text += `${this.getText('missionEggIncubating')}: ${eggNames.join(', ')}`;
    }

    return text;
  }

  onClose(): void {
    this.close.emit();
  }
}
