import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { COMPANION_MISSION_ID } from '@core/data/game-config';
import { MinigameParticipant } from '@core/interfaces/minigame.interface';
import { MissionAssigneeOption, MissionBoardEntry } from '@core/interfaces/mission-definition.interface';
import { LocalizationService } from '@core/services/localization.service';
import { MissionService } from '@core/services/mission.service';
import { PetService } from '@core/services/pet.service';
import { MinigameSpriteComponent } from '@shared/minigame-sprite/minigame-sprite.component';

@Component({
  selector: 'app-mission-assignee-picker',
  standalone: true,
  imports: [MinigameSpriteComponent],
  templateUrl: './mission-assignee-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './mission-assignee-picker.component.css',
})
export class MissionAssigneePickerComponent {
  private localization = inject(LocalizationService);
  private missionService = inject(MissionService);
  private petService = inject(PetService);

  @Input({ required: true }) mission!: MissionBoardEntry;
  @Input({ required: true }) assignees: MissionAssigneeOption[] = [];
  @Output() assigneeSelected = new EventEmitter<MissionAssigneeOption>();
  @Output() back = new EventEmitter<void>();

  readonly characterParticipant: MinigameParticipant = {
    type: 'character',
    id: COMPANION_MISSION_ID,
    label: '',
    display: 'image',
    src: '/assets/img/character/base.png',
  };

  readonly getText = this.localization.t.bind(this.localization);

  selectAssignee(option: MissionAssigneeOption): void {
    if (!option.available) {
      return;
    }
    this.assigneeSelected.emit(option);
  }

  displayVisual(option: MissionAssigneeOption): string {
    const visual = this.missionService.getAssigneeVisual(option);
    return this.petService.getPetVisualDisplay(visual!);
  }

  isEmoji(option: MissionAssigneeOption): boolean {
    const visual = this.missionService.getAssigneeVisual(option);
    return visual?.type === 'emoji';
  }

  isCharacter(option: MissionAssigneeOption): boolean {
    return option.type === 'character';
  }

  missionTitle(): string {
    return this.localization.localized(this.mission.definition.name);
  }
}
