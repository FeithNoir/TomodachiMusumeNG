import { Component, OnInit, OnDestroy, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';

import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import {
  EXPRESSION_BLINK_MAX_MS,
  EXPRESSION_BLINK_MIN_MS,
  EXPRESSION_BLINK_MS,
  EXPRESSION_EYES_BLINK,
  EXPRESSION_EYES_IDLE,
} from '@core/data/game-config';
import {
  preloadCharacterBaseAssets,
  preloadEquippedAssets,
} from '@core/utils/asset-preload.util';
import { normalizeAssetPath } from '@core/utils/asset.util';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [],
  templateUrl: './character.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  readonly eyesOpenPath = normalizeAssetPath(EXPRESSION_EYES_IDLE);
  readonly eyesBlinkPath = normalizeAssetPath(EXPRESSION_EYES_BLINK);

  eyesClosed = signal(false);
  showReactionDialogue = false;
  reactionText = '';

  private blinkTimeout: ReturnType<typeof setTimeout> | null = null;
  private blinkRestoreTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      preloadEquippedAssets(this.equipped(), id => this.itemCatalog.getItemPath(id));
    });
  }

  useDualEyeLayers(): boolean {
    const eyes = normalizeAssetPath(this.expression().eyes);
    return eyes === this.eyesOpenPath || eyes === this.eyesBlinkPath;
  }

  getItemPath(itemId: string | null): string {
    return this.itemCatalog.getItemPath(itemId);
  }

  ngOnInit(): void {
    this.characterService.resetToDefaultExpression();
    preloadCharacterBaseAssets();
    preloadEquippedAssets(this.equipped(), id => this.itemCatalog.getItemPath(id));
    this.scheduleBlink();
  }

  ngOnDestroy(): void {
    this.clearBlinkTimers();
  }

  private scheduleBlink(): void {
    const delay =
      Math.random() * (EXPRESSION_BLINK_MAX_MS - EXPRESSION_BLINK_MIN_MS) + EXPRESSION_BLINK_MIN_MS;

    this.blinkTimeout = setTimeout(() => {
      if (this.characterService.isDefaultIdleExpression() && this.useDualEyeLayers()) {
        this.eyesClosed.set(true);
        this.blinkRestoreTimeout = setTimeout(() => {
          this.eyesClosed.set(false);
          this.scheduleBlink();
        }, EXPRESSION_BLINK_MS);
      } else {
        this.scheduleBlink();
      }
    }, delay);
  }

  private clearBlinkTimers(): void {
    if (this.blinkTimeout) {
      clearTimeout(this.blinkTimeout);
    }
    if (this.blinkRestoreTimeout) {
      clearTimeout(this.blinkRestoreTimeout);
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
