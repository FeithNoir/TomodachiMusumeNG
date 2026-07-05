import { Component, inject, input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Dialogue, DialogueOption } from '../../core/interfaces/dialogue.interface';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-dialogue',
  standalone: true,
  imports: [],
  templateUrl: './dialogue.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./dialogue.component.css'],
})
export class DialogueComponent {
  private localization = inject(LocalizationService);

  dialogue = input<Dialogue | null>(null);

  @Output() optionSelected = new EventEmitter<DialogueOption>();
  @Output() close = new EventEmitter<void>();

  get processedText(): string {
    return this.localization.dialogueText(this.dialogue());
  }

  getLocalizedOptionText(option: DialogueOption): string {
    return this.localization.dialogueOptionText(option);
  }

  onOptionClick(option: DialogueOption): void {
    this.optionSelected.emit(option);
  }

  onClose(): void {
    this.close.emit();
  }
}
