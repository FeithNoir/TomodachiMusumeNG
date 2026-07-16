import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TrainingAssigneeOption } from '@core/interfaces/minigame.interface';
import { FeedingService } from '@core/services/feeding.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-feeding-food-picker',
  standalone: true,
  imports: [],
  templateUrl: './feeding-food-picker.component.html',
  styleUrl: './feeding-food-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedingFoodPickerComponent {
  private feedingService = inject(FeedingService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);

  @Input({ required: true }) assignee!: TrainingAssigneeOption;
  @Output() foodSelected = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  readonly feedableItems = this.feedingService.feedableInventory;
  readonly getText = this.localization.t.bind(this.localization);

  getItemName(itemId: string): string {
    return this.localization.itemName(itemId);
  }

  getItemEmoji(itemId: string): string | null {
    return this.itemCatalog.getItem(itemId)?.emoji ?? null;
  }

  preferenceLabel(itemId: string): string {
    const pref = this.feedingService.getPreferenceForItem(this.assignee, itemId);
    if (pref === 'liked') {
      return this.getText('feedingPrefLiked');
    }
    if (pref === 'disliked') {
      return this.getText('feedingPrefDisliked');
    }
    return this.getText('feedingPrefNeutral');
  }

  preferenceClass(itemId: string): string {
    const pref = this.feedingService.getPreferenceForItem(this.assignee, itemId);
    return `food-pref food-pref--${pref}`;
  }

  selectFood(itemId: string): void {
    this.foodSelected.emit(itemId);
  }
}
