import { Injectable, signal } from '@angular/core';
import { masterItemList } from '@core/data/item-database';
import { affinityReactionTiers, AffinityReactionTier } from '@core/data/affinity-reactions';
import { isEquippableCategory } from '@core/data/equippable-categories';
import { AFFINITY_MAX, } from '@core/data/game-config';
import { createDefaultExpression, createEmptyEquippedState, } from '@core/data/initial-game-state';
import { EquippableItemCategory } from '@core/interfaces/item.interface';
import { GameState } from '@core/interfaces/game-state.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  public affinity = signal<number>(0);
  public equipped = signal<GameState['equipped']>(createEmptyEquippedState());
  public expression = signal<GameState['expression']>(createDefaultExpression());

  equipItem(itemId: string): boolean {
    const itemData = masterItemList[itemId];
    if (!itemData) {
      console.error(`Attempted to equip non-existent item: ${itemId}`);
      return false;
    }

    if (!isEquippableCategory(itemData.type)) {
      console.warn(`Item ${itemData.name.en} is not an equippable type.`);
      return false;
    }

    const currentAffinity = this.affinity();
    if (itemData.requiredAffinity && currentAffinity < itemData.requiredAffinity) {
      console.warn(
        `Insufficient affinity to equip ${itemData.name.en}. Required: ${itemData.requiredAffinity}, Current: ${currentAffinity}`
      );
      return false;
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
    return true;
  }

  unequipItem(itemType: EquippableItemCategory): void {
    const currentEquipped = { ...this.equipped() };
    currentEquipped[itemType] = null;
    this.equipped.set(currentEquipped);
  }

  updateExpression(eyesPath: string, mouthPath: string): void {
    this.expression.set({ eyes: eyesPath, mouth: mouthPath });
  }

  updateAffinity(amount: number): void {
    this.affinity.update(current => Math.max(0, Math.min(AFFINITY_MAX, current + amount)));
  }

  getAffinityReaction(): AffinityReactionTier | undefined {
    const currentAffinity = this.affinity();
    return affinityReactionTiers
      .slice()
      .reverse()
      .find(reaction => currentAffinity >= reaction.level);
  }
}
