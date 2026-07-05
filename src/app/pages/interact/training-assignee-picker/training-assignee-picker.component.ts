import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { COMPANION_MISSION_ID } from '@core/data/game-config';
import {
  MinigameParticipant,
  TrainingAssigneeOption,
} from '@core/interfaces/minigame.interface';
import { LocalizationService } from '@core/services/localization.service';
import { PetService } from '@core/services/pet.service';
import { MinigameSpriteComponent } from '@shared/minigame-sprite/minigame-sprite.component';

@Component({
  selector: 'app-training-assignee-picker',
  standalone: true,
  imports: [MinigameSpriteComponent],
  templateUrl: './training-assignee-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './training-assignee-picker.component.css',
})
export class TrainingAssigneePickerComponent {
  private localization = inject(LocalizationService);
  private petService = inject(PetService);

  @Input({ required: true }) assignees: TrainingAssigneeOption[] = [];
  @Input({ required: true }) energyCost = 5;
  @Output() assigneeSelected = new EventEmitter<TrainingAssigneeOption>();
  @Output() back = new EventEmitter<void>();

  readonly characterParticipant: MinigameParticipant = {
    type: 'character',
    id: COMPANION_MISSION_ID,
    label: '',
    display: 'image',
    src: '/assets/img/character/base.png',
  };

  readonly getText = this.localization.t.bind(this.localization);

  selectAssignee(option: TrainingAssigneeOption): void {
    if (!option.available) {
      return;
    }
    this.assigneeSelected.emit(option);
  }

  isEmoji(option: TrainingAssigneeOption): boolean {
    return option.type === 'pet' && option.visual?.type === 'emoji';
  }

  displayVisual(option: TrainingAssigneeOption): string {
    return this.petService.getPetVisualDisplay(option.visual!);
  }

  isCharacter(option: TrainingAssigneeOption): boolean {
    return option.type === 'character';
  }
}
