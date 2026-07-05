import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { MinigameParticipant } from '@core/interfaces/minigame.interface';
import { CharacterService } from '@core/services/character.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';

@Component({
  selector: 'app-minigame-sprite',
  standalone: true,
  imports: [],
  templateUrl: './minigame-sprite.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './minigame-sprite.component.css',
})
export class MinigameSpriteComponent {
  private characterService = inject(CharacterService);
  private itemCatalog = inject(ItemCatalogService);

  participant = input.required<MinigameParticipant>();
  scale = input(0.5);

  equipped = this.characterService.equipped;

  expression = this.characterService.expression;

  getItemPath(itemId: string | null): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  scaleStyle(): string {
    return `scale(${this.scale()})`;
  }
}
