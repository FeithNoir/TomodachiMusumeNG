import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';
import { CharacterService } from '../../core/services/character.service';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './info.component.css',
})
export class InfoComponent {
  private gameStateService = inject(GameStateService);
  private characterService = inject(CharacterService);
  private localization = inject(LocalizationService);

  public affinity = this.characterService.affinity;
  public money = this.gameStateService.money;
  public energy = this.gameStateService.energy;
  public satiety = this.gameStateService.satiety;
  readonly getText = this.localization.t.bind(this.localization);
}
