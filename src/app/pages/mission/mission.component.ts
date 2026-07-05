import { Component, OnInit, OnDestroy, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MissionService } from '@core/services/mission.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { MissionReward } from '@core/interfaces/mission.interface';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './mission.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./mission.component.css'],
})
export class MissionComponent implements OnInit, OnDestroy {
  private missionService = inject(MissionService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  public progress = signal(0);
  public title = signal('');
  public resultText = signal('');
  public isComplete = signal(false);

  private progressInterval: ReturnType<typeof setInterval> | null = null;
  readonly getText = this.localization.t.bind(this.localization);

  constructor() {
    this.title.set(this.getText('sending'));
  }

  ngOnInit(): void {
    this.runMissionSequence();
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private runMissionSequence(): void {
    if (!this.missionService.hasEnoughEnergy()) {
      this.title.set(this.getText('noEnergy'));
      this.resultText.set(this.getText('noEnergyMsg'));
      this.isComplete.set(true);
      return;
    }

    this.missionService.startMission();

    this.progressInterval = setInterval(() => {
      this.progress.update(progressValue => {
        const newProgress = progressValue + 10;
        if (newProgress >= 100) {
          if (this.progressInterval) {
            clearInterval(this.progressInterval);
          }
          this.finishMission();
          return 100;
        }
        return newProgress;
      });
    }, 300);
  }

  private finishMission(): void {
    const result: MissionReward = this.missionService.calculateMissionRewards();

    this.title.set(this.getText('complete'));
    this.resultText.set(this.formatResultText(result));
    this.isComplete.set(true);
  }

  private formatResultText(result: MissionReward): string {
    const success = result.moneyEarned > 0 || result.itemsFound.length > 0;

    let text = success ? this.getText('returned') : this.getText('returnedNothing');
    text += '<br>';

    if (result.moneyEarned > 0) {
      text += `${this.getText('gains')}: ${result.moneyEarned}<br>`;
    }

    if (result.itemsFound.length > 0) {
      const itemNames = result.itemsFound.map(item => {
        const name = this.itemCatalog.getItemName(item.id);
        return `${name} (x${item.quantity})`;
      });

      text += `${this.getText('items')}: ${itemNames.join(', ')}`;
    }

    return text;
  }

  onClose(): void {
    this.close.emit();
  }
}
