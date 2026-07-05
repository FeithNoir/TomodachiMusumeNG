import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { StatKey } from '@core/interfaces/character-stats.interface';
import {
  STAT_DISPLAY_MAX,
  resolveStatBarTier,
  statBarFillPercent,
  StatBarTier,
} from '@core/data/stat-display.config';

@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [],
  templateUrl: './stat-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './stat-bar.component.css',
})
export class StatBarComponent {
  label = input.required<string>();
  statKey = input.required<StatKey>();
  value = input.required<number>();
  baseValue = input.required<number>();

  readonly tier = computed(() =>
    resolveStatBarTier(this.value(), this.baseValue(), STAT_DISPLAY_MAX[this.statKey()])
  );

  readonly fillPercent = computed(() =>
    statBarFillPercent(this.value(), STAT_DISPLAY_MAX[this.statKey()])
  );

  tierClass(tier: StatBarTier): string {
    return `stat-bar__fill--${tier}`;
  }
}
