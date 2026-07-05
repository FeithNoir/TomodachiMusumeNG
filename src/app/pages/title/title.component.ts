import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';
import { GameStateService } from '@core/services/game-state.service';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  private router = inject(Router);
  private gameStateService = inject(GameStateService);
  private localization = inject(LocalizationService);

  public canLoadGame = signal(false);
  readonly getText = this.localization.t.bind(this.localization);

  ngOnInit(): void {
    this.canLoadGame.set(this.gameStateService.hasSaveData());
  }

  newGame(): void {
    this.gameStateService.clearSaveData();
    this.router.navigate(['/main']);
  }

  loadGame(): void {
    if (this.canLoadGame()) {
      this.router.navigate(['/main']);
    }
  }
}
