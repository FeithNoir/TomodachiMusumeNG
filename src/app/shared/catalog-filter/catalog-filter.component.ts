import { Component, inject, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogFilterTab } from '@core/data/catalog-filter.config';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-catalog-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './catalog-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './catalog-filter.component.css',
})
export class CatalogFilterComponent {
  private localization = inject(LocalizationService);

  readonly tabs = input.required<CatalogFilterTab[]>();
  readonly activeTab = input.required<string>();
  readonly searchQuery = input.required<string>();
  readonly searchPlaceholderKey = input('inventorySearchPlaceholder');

  readonly activeTabChange = output<string>();
  readonly searchQueryChange = output<string>();

  readonly getText = this.localization.t.bind(this.localization);

  setTab(tabId: string): void {
    this.activeTabChange.emit(tabId);
  }

  onSearchChange(value: string): void {
    this.searchQueryChange.emit(value);
  }
}
