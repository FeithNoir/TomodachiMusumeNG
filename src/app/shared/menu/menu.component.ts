import { Component, inject, signal, output, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';
import { GameStateService } from '@core/services/game-state.service';
import { PersistenceService } from '@core/services/persistence.service';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  private gameStateService = inject(GameStateService);
  private persistenceService = inject(PersistenceService);
  private localization = inject(LocalizationService);
  private router = inject(Router);

  menuAction = output<string>();

  public isOpen = signal(false);
  readonly getText = this.localization.t.bind(this.localization);

  toggle(): void {
    this.isOpen.set(!this.isOpen());
  }

  close(): void {
    this.isOpen.set(false);
  }

  onOptionClick(action: string): void {
    if (action === 'save') {
      this.gameStateService.saveGame();
    } else if (action === 'exit') {
      if (this.persistenceService.isElectron()) {
        this.persistenceService.quit();
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.menuAction.emit(action);
    }
    this.close();
  }
}
