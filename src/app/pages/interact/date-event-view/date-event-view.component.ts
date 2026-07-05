import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DateEventDefinition } from '@core/interfaces/minigame.interface';
import { LocalizationService } from '@core/services/localization.service';
import { MinigameService } from '@core/services/minigame.service';

@Component({
  selector: 'app-date-event-view',
  standalone: true,
  imports: [],
  templateUrl: './date-event-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './date-event-view.component.css',
})
export class DateEventViewComponent {
  private localization = inject(LocalizationService);
  private minigameService = inject(MinigameService);

  @Input({ required: true }) event!: DateEventDefinition;
  @Output() back = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  readonly getText = this.localization.t.bind(this.localization);

  phase = signal<'intro' | 'response' | 'done'>('intro');
  responseText = signal('');
  backgroundFilter = signal('none');

  localized(field: { es: string; en: string }): string {
    return this.localization.localized(field);
  }

  selectChoice(choiceId: string): void {
    const choice = this.event.choices.find(entry => entry.id === choiceId);
    if (!choice) {
      return;
    }

    this.minigameService.completeDateEvent(this.event.id, choiceId);
    this.responseText.set(this.localized(choice.response));
    this.backgroundFilter.set(choice.backgroundFilter ?? 'none');
    this.phase.set('response');
  }

  onContinue(): void {
    if (this.phase() === 'response') {
      this.phase.set('done');
      this.completed.emit();
      return;
    }
    this.back.emit();
  }
}
