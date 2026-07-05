import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { ITEM_RARITY_META } from '@core/data/item-rarity.config';
import { MISSION_DIFFICULTY_META } from '@core/data/mission-difficulty.config';
import {
  MissionBoardEntry,
  MissionStatRequirementStatus,
} from '@core/interfaces/mission-definition.interface';
import { StatKey } from '@core/interfaces/character-stats.interface';
import { LocalizationService } from '@core/services/localization.service';
import { MissionService } from '@core/services/mission.service';

@Component({
  selector: 'app-mission-board',
  standalone: true,
  imports: [],
  templateUrl: './mission-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './mission-board.component.css',
})
export class MissionBoardComponent {
  private localization = inject(LocalizationService);
  private missionService = inject(MissionService);

  @Input({ required: true }) entries: MissionBoardEntry[] = [];
  @Output() missionSelected = new EventEmitter<MissionBoardEntry>();
  @Output() refreshBoard = new EventEmitter<void>();

  readonly getText = this.localization.t.bind(this.localization);

  selectMission(entry: MissionBoardEntry): void {
    if (!entry.meetsRequirements) {
      return;
    }
    this.missionSelected.emit(entry);
  }

  difficultyLabel(difficulty: MissionBoardEntry['definition']['difficulty']): string {
    const key = MISSION_DIFFICULTY_META[difficulty].labelKey;
    return this.getText(key);
  }

  difficultyStyle(difficulty: MissionBoardEntry['definition']['difficulty']): Record<string, string> {
    const meta = ITEM_RARITY_META[difficulty];
    return {
      '--mission-accent': meta.color,
      '--mission-border': meta.borderColor,
      '--mission-glow': meta.glowColor,
      '--mission-bg': meta.bgGradient,
    };
  }

  formatDuration(ms: number): string {
    return this.missionService.formatDuration(ms);
  }

  localizedName(entry: MissionBoardEntry): string {
    return this.localization.localized(entry.definition.name);
  }

  localizedDescription(entry: MissionBoardEntry): string {
    return this.localization.localized(entry.definition.description);
  }

  getStatLabel(stat: StatKey): string {
    return this.getText(`stat${stat.charAt(0).toUpperCase()}${stat.slice(1)}`);
  }

  statLine(status: MissionStatRequirementStatus): string {
    return `${this.getStatLabel(status.stat)}: ${status.current}/${status.required}`;
  }

  hasRequirements(entry: MissionBoardEntry): boolean {
    return (
      entry.statStatuses.length > 0 ||
      entry.conditionStatuses.length > 0 ||
      entry.energyCost > 0
    );
  }
}
