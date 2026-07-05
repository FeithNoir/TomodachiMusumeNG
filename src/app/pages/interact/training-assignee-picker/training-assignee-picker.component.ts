import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TrainingAssigneeOption } from '@core/interfaces/minigame.interface';
import { LocalizationService } from '@core/services/localization.service';
import { PetService } from '@core/services/pet.service';

@Component({
  selector: 'app-training-assignee-picker',
  standalone: true,
  imports: [],
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

  readonly getText = this.localization.t.bind(this.localization);

  selectAssignee(option: TrainingAssigneeOption): void {
    if (!option.available) {
      return;
    }
    this.assigneeSelected.emit(option);
  }

  isEmoji(option: TrainingAssigneeOption): boolean {
    return option.visual?.type === 'emoji';
  }

  displayVisual(option: TrainingAssigneeOption): string {
    if (option.type === 'character') {
      return '/assets/img/character/base.png';
    }
    return this.petService.getPetVisualDisplay(option.visual!);
  }

  isCharacter(option: TrainingAssigneeOption): boolean {
    return option.type === 'character';
  }
}
