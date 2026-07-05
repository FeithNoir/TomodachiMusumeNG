import { Injectable, inject, signal } from '@angular/core';
import { masterItemList } from '@core/data/item-database';
import { affinityReactionTiers, AffinityReactionTier } from '@core/data/affinity-reactions';
import { isEquippableCategory } from '@core/data/equippable-categories';
import { AFFINITY_MAX } from '@core/data/game-config';
import { createDefaultExpression, createEmptyEquippedState } from '@core/data/initial-game-state';
import { EquippableItemCategory } from '@core/interfaces/item.interface';
import { EquipResult } from '@core/interfaces/notification.interface';
import { GameState } from '@core/interfaces/game-state.interface';
import { AffinityEventService } from '@core/services/affinity-event.service';
import { blinkExpressionPaths, defaultExpressionPaths, normalizeAssetPath, } from '@core/utils/asset.util';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private affinityEvents = inject(AffinityEventService);

  public affinity = signal<number>(0);
  public equipped = signal<GameState['equipped']>(createEmptyEquippedState());
  public expression = signal<GameState['expression']>(createDefaultExpression());

  equipItem(itemId: string): EquipResult {
    const itemData = masterItemList[itemId];
    if (!itemData) {
      return { ok: false, reason: 'not_found' };
    }

    if (!isEquippableCategory(itemData.type)) {
      return { ok: false, reason: 'not_equippable' };
    }

    const currentAffinity = this.affinity();
    if (itemData.requiredAffinity && currentAffinity < itemData.requiredAffinity) {
      return {
        ok: false,
        reason: 'insufficient_affinity',
        requiredAffinity: itemData.requiredAffinity,
      };
    }

    const itemType = itemData.type;
    const currentEquipped = { ...this.equipped() };

    if (itemType === 'suit') {
      currentEquipped.top = null;
      currentEquipped.bottom = null;
      currentEquipped.bra = null;
      currentEquipped.pantsus = null;
    } else if (['top', 'bottom', 'bra', 'pantsus'].includes(itemType)) {
      currentEquipped.suit = null;
    }

    currentEquipped[itemType] = itemId;
    this.equipped.set(currentEquipped);
    return { ok: true };
  }

  unequipItem(itemType: EquippableItemCategory): void {
    const currentEquipped = { ...this.equipped() };
    currentEquipped[itemType] = null;
    this.equipped.set(currentEquipped);
  }

  updateExpression(eyesPath: string, mouthPath: string): void {
    this.expression.set({
      eyes: normalizeAssetPath(eyesPath),
      mouth: normalizeAssetPath(mouthPath),
    });
  }

  resetToDefaultExpression(): void {
    this.expression.set(defaultExpressionPaths());
  }

  updateAffinity(amount: number): void {
    const previous = this.affinity();
    const next = Math.max(0, Math.min(AFFINITY_MAX, previous + amount));
    this.affinity.set(next);
    if (next !== previous) {
      this.affinityEvents.emitAffinityChange(previous, next);
    }
  }

  getAffinityReaction(): AffinityReactionTier | undefined {
    const currentAffinity = this.affinity();
    return affinityReactionTiers
      .slice()
      .reverse()
      .find(reaction => currentAffinity >= reaction.level);
  }

  /** Applies a blink frame while preserving the current mouth. */
  blink(): void {
    const currentMouth = this.expression().mouth;
    const blinkPaths = blinkExpressionPaths(currentMouth);
    this.expression.set(blinkPaths);
  }

  isDefaultIdleExpression(): boolean {
    const current = this.expression();
    const defaults = defaultExpressionPaths();
    return current.eyes === defaults.eyes && current.mouth === defaults.mouth;
  }
}
