import { Injectable, computed, inject } from '@angular/core';
import { EGG_DEFINITIONS } from '@core/data/egg-database';
import { PET_SPECIES } from '@core/data/pet-species-database';
import {
  DEFAULT_PET_SLOT_CAPACITY,
  PET_SLOT_UPGRADE_AMOUNT,
} from '@core/data/game-config';
import { Pet, PetVisual } from '@core/interfaces/pet.interface';
import { CharacterStats, StatKey } from '@core/interfaces/character-stats.interface';
import { GameStateService } from '@core/services/game-state.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { buildPetBaseStats, createEmptyBonusStats } from '@core/utils/pet-stats.util';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private gameState = inject(GameStateService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  readonly pets = computed(() => this.gameState.gameState().pets);
  readonly slotCapacity = computed(() => this.gameState.gameState().petSlotCapacity);
  readonly hasFreeSlot = computed(() => this.pets().length < this.slotCapacity());

  canAddPet(): boolean {
    return this.hasFreeSlot();
  }

  hatchEgg(eggId: string): Pet | null {
    const egg = EGG_DEFINITIONS[eggId];
    if (!egg) {
      return null;
    }

    if (!this.canAddPet()) {
      this.notifications.warning(this.localization.t('petSlotsFullMsg'));
      return null;
    }

    const species = PET_SPECIES[egg.speciesId];
    if (!species) {
      return null;
    }

    const pet: Pet = {
      id: `pet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      speciesId: species.id,
      name: this.localization.localized(species.name),
      visual: { ...egg.visual },
      baseStats: buildPetBaseStats(species.baseStats),
      bonusStats: createEmptyBonusStats(),
      hatchedAt: Date.now(),
    };

    this.gameState.updateState(state => ({
      ...state,
      pets: [...state.pets, pet],
    }));

    this.notifications.success(this.localization.t('petHatchedMsg', pet.name));
    return pet;
  }

  applyStatBonus(petId: string, bonus: Partial<CharacterStats>): void {
    this.gameState.updateState(state => ({
      ...state,
      pets: state.pets.map(pet => {
        if (pet.id !== petId) {
          return pet;
        }

        const nextBonus = { ...pet.bonusStats };
        for (const key of Object.keys(bonus) as StatKey[]) {
          nextBonus[key] = (nextBonus[key] ?? 0) + (bonus[key] ?? 0);
        }

        return { ...pet, bonusStats: nextBonus };
      }),
    }));
  }

  /** Training, food, and potions entry points. */
  trainPet(petId: string, stat: StatKey, amount: number = 1): void {
    this.applyStatBonus(petId, { [stat]: amount });
    this.notifications.info(this.localization.t('petTrainedMsg', stat));
  }

  feedPet(petId: string): void {
    this.applyStatBonus(petId, { health: 5, endurance: 3 });
    this.notifications.success(this.localization.t('petFedMsg'));
  }

  givePotionToPet(petId: string, stat: StatKey, amount: number = 2): void {
    this.applyStatBonus(petId, { [stat]: amount });
    this.notifications.success(this.localization.t('petPotionMsg'));
  }

  expandSlotCapacity(amount: number = PET_SLOT_UPGRADE_AMOUNT): void {
    this.gameState.updateState(state => ({
      ...state,
      petSlotCapacity: state.petSlotCapacity + amount,
    }));
    this.notifications.success(this.localization.t('petSlotExpandedMsg'));
  }

  getPetVisualDisplay(visual: PetVisual): string {
    return visual.type === 'emoji' ? visual.value : visual.value;
  }

  isImageVisual(visual: PetVisual): boolean {
    return visual.type === 'image';
  }

  getDefaultCapacity(): number {
    return DEFAULT_PET_SLOT_CAPACITY;
  }
}
