import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';

import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import {
  EXPRESSION_BLINK_MAX_MS,
  EXPRESSION_BLINK_MIN_MS,
  EXPRESSION_BLINK_MS,
} from '@core/data/game-config';
import { isDefaultIdleEyes } from '@core/utils/asset.util';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [],
  templateUrl: './character.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './character.component.css',
})
export class CharacterComponent implements OnInit, OnDestroy {
  private characterService = inject(CharacterService);
  private gameStateService = inject(GameStateService);
  private itemCatalog = inject(ItemCatalogService);
  private localization = inject(LocalizationService);

  public equipped = this.characterService.equipped;
  public expression = this.characterService.expression;
  public playerName = this.gameStateService.playerName;

  private blinkingInterval: ReturnType<typeof setInterval> | null = null;
  private blinkRestoreTimeout: ReturnType<typeof setTimeout> | null = null;
  public showReactionDialogue = false;
  public reactionText = '';

  getItemPath(itemId: string | null): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  ngOnInit(): void {
    this.characterService.resetToDefaultExpression();
    this.startBlinking();
  }

  ngOnDestroy(): void {
    this.stopBlinking();
    if (this.blinkRestoreTimeout) {
      clearTimeout(this.blinkRestoreTimeout);
    }
  }

  private startBlinking(): void {
    this.blinkingInterval = setInterval(() => {
      if (!isDefaultIdleEyes(this.expression().eyes)) {
        return;
      }

      this.characterService.blink();
      this.blinkRestoreTimeout = setTimeout(() => {
        this.characterService.resetToDefaultExpression();
      }, EXPRESSION_BLINK_MS);
    }, Math.random() * (EXPRESSION_BLINK_MAX_MS - EXPRESSION_BLINK_MIN_MS) + EXPRESSION_BLINK_MIN_MS);
  }

  private stopBlinking(): void {
    if (this.blinkingInterval) {
      clearInterval(this.blinkingInterval);
    }
  }

  onCharacterClick(): void {
    const reaction = this.characterService.getAffinityReaction();
    if (!reaction) {
      return;
    }

    this.showReactionDialogue = true;
    this.reactionText = this.localization.localized(reaction.text);

    const originalEyes = this.expression().eyes;
    const originalMouth = this.expression().mouth;

    this.characterService.updateExpression(reaction.eyes, reaction.mouth);

    setTimeout(() => {
      this.showReactionDialogue = false;
      this.characterService.updateExpression(originalEyes, originalMouth);
    }, 1500);
  }
}
