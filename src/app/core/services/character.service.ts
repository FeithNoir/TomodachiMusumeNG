import { Injectable, computed, inject, signal } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ItemCategory, EquippableItemCategory } from '../interfaces/item.interface';
import { GameState } from '../interfaces/game-state.interface';
import { masterItemList } from '../data/item-database';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private gameStateService = inject(GameStateService);

  // Character State Signals
  public affinity = signal<number>(0);
  public equipped = signal<GameState['equipped']>({
    top: null, bottom: null, suit: null, head: null, stockings: null, bra: null, pantsus: null, hands: null, weapon: null
  });
  public expression = signal<{ eyes: string; mouth: string }>({
    eyes: 'assets/img/expressions/eyes_1.png',
    mouth: 'assets/img/expressions/mouth_1.png'
  });

  private affinityReactions = [
    { level: 0, eyes: 'assets/img/expressions/eyes_angry.png', mouth: 'assets/img/expressions/mouth_angry.png', text: { es: "¡No me toques!", en: "Don't touch me!" } },
    { level: 25, eyes: 'assets/img/expressions/eyes_surprised.png', mouth: 'assets/img/expressions/mouth_surprised.png', text: { es: "¿Q-qué haces?", en: "W-what are you doing?" } },
    { level: 50, eyes: 'assets/img/expressions/eyes_blush.png', mouth: 'assets/img/expressions/mouth_blush.png', text: { es: "E-está bien...", en: "I-it's okay..." } },
    { level: 75, eyes: 'assets/img/expressions/eyes_happy.png', mouth: 'assets/img/expressions/mouth_happy.png', text: { es: "¡Me gusta que me acaricies!", en: "I like it when you pet me!" } }
  ];

  // Constructor can be empty if using inject()
  constructor() { }

  /**
   * Equips an item to the character.
   * @param itemId The ID of the item to equip.
   * @returns True if the item was equipped, false otherwise (e.g., insufficient affinity, non-equippable item).
   */
  equipItem(itemId: string): boolean {
    const itemData = masterItemList[itemId];
    if (!itemData) {
      console.error(`Attempted to equip non-existent item: ${itemId}`);
      return false;
    }

    // Check if the item is actually equippable
    const equippableTypes: ItemCategory[] = ['bra', 'pantsus', 'top', 'bottom', 'suit', 'head', 'stockings', 'hands', 'weapon'];
    if (!equippableTypes.includes(itemData.type)) {
      console.warn(`Item ${itemData.name.en} is not an equippable type.`);
      // TODO: Notify user
      return false;
    }

    const currentAffinity = this.affinity();
    if (itemData.requiredAffinity && currentAffinity < itemData.requiredAffinity) {
      console.warn(`Insufficient affinity to equip ${itemData.name.en}. Required: ${itemData.requiredAffinity}, Current: ${currentAffinity}`);
      // TODO: Notify user
      return false;
    }

    const itemType = itemData.type as EquippableItemCategory; // Cast to EquippableItemCategory
    const currentEquipped = { ...this.equipped() };

    // Handle conflict rules
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

  /**
   * Unequips an item of a specific type from the character.
   * @param itemType The type of item to unequip.
   */
  unequipItem(itemType: EquippableItemCategory): void { // Use EquippableItemCategory
    const currentEquipped = { ...this.equipped() };
    currentEquipped[itemType] = null;
    this.equipped.set(currentEquipped);
  }

  /**
   * Updates the character's expression.
   * @param eyesPath Path to the eyes image.
   * @param mouthPath Path to the mouth image.
   */
  updateExpression(eyesPath: string, mouthPath: string): void {
    this.expression.set({ eyes: eyesPath, mouth: mouthPath });
  }

  /**
   * Updates the character's affinity.
   * @param amount The amount to change affinity by.
   */
  updateAffinity(amount: number): void {
    this.affinity.update(current => Math.max(0, Math.min(100, current + amount)));
  }

  /**
   * Gets the current affinity reaction based on the character's affinity level.
   * @returns The reaction object (eyes, mouth, text) or null if no reaction.
   */
  getAffinityReaction() {
    const currentAffinity = this.affinity();
    return this.affinityReactions
      .slice()
      .reverse()
      .find(reaction => currentAffinity >= reaction.level);
  }
}
