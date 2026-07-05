import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';

import { CharacterComponent } from '@shared/character/character.component';
import { GameLoopService } from '@core/services/game-loop.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CharacterComponent],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  private gameLoopService = inject(GameLoopService);

  ngOnInit(): void {
    this.gameLoopService.start();
  }

  ngOnDestroy(): void {
    this.gameLoopService.stop();
  }
}
