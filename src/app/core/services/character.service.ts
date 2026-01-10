import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ItemCategory, EquippableItemCategory } from '../interfaces/item.interface'; // Import EquippableItemCategory
import { masterItemList } from '../data/item-database';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private gameStateService = inject(GameStateService); // Use inject()

  // Expose equipped items and expression as computed signals from GameStateService
  public equipped = computed(() => this.gameStateService.equipped());
  public expression = computed(() => this.gameStateService.gameState().expression);
  public affinity = computed(() => this.gameStateService.affinity());

  private affinityReactions = [
    { level: 0, eyes: '/assets/img/expressions/eyes_angry.png', mouth: '/assets/img/expressions/mouth_angry.png', text: { es: "¡No me toques!", en: "Don't touch me!" } },
    { level: 25, eyes: '/assets/img/expressions/eyes_surprised.png', mouth: '/assets/img/expressions/mouth_surprised.png', text: { es: "¿Q-qué haces?", en: "W-what are you doing?" } },
    { level: 50, eyes: '/assets/img/expressions/eyes_blush.png', mouth: '/assets/img/expressions/mouth_blush.png', text: { es: "E-está bien...", en: "I-it's okay..." } },
    { level: 75, eyes: '/assets/img/expressions/eyes_happy.png', mouth: '/assets/img/expressions/mouth_happy.png', text: { es: "¡Me gusta que me acaricies!", en: "I like it when you pet me!" } }
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

    const currentAffinity = this.gameStateService.affinity();
    if (itemData.requiredAffinity && currentAffinity < itemData.requiredAffinity) {
      console.warn(`Insufficient affinity to equip ${itemData.name.en}. Required: ${itemData.requiredAffinity}, Current: ${currentAffinity}`);
      // TODO: Notify user
      return false;
    }

    const itemType = itemData.type as EquippableItemCategory; // Cast to EquippableItemCategory
    const currentEquipped = { ...this.gameStateService.equipped() };

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
    this.gameStateService.updateEquipped(currentEquipped);
    return true;
  }

  /**
   * Unequips an item of a specific type from the character.
   * @param itemType The type of item to unequip.
   */
  unequipItem(itemType: EquippableItemCategory): void { // Use EquippableItemCategory
    const currentEquipped = { ...this.gameStateService.equipped() };
    currentEquipped[itemType] = null;
    this.gameStateService.updateEquipped(currentEquipped);
  }

  /**
   * Updates the character's expression.
   * @param eyesPath Path to the eyes image.
   * @param mouthPath Path to the mouth image.
   */
  updateExpression(eyesPath: string, mouthPath: string): void {
    this.gameStateService.updateExpression(eyesPath, mouthPath);
  }

  /**
   * Gets the current affinity reaction based on the character's affinity level.
   * @returns The reaction object (eyes, mouth, text) or null if no reaction.
   */
  getAffinityReaction() {
    const currentAffinity = this.gameStateService.affinity();
    return this.affinityReactions
      .slice()
      .reverse()
      .find(reaction => currentAffinity >= reaction.level);
  }
}