import { Injectable, computed, inject, signal } from '@angular/core';
import { EGG_DEFINITIONS } from '@core/data/egg-database';
import { getEggIncubationMs } from '@core/data/egg-rarity.config';
import { PET_SPECIES } from '@core/data/pet-species-database';
import {
  DEFAULT_PET_SLOT_CAPACITY,
  PET_SLOT_UPGRADE_AMOUNT,
} from '@core/data/game-config';
import { IncubatingEgg, Pet, PetVisual } from '@core/interfaces/pet.interface';
import { CharacterStats, StatKey } from '@core/interfaces/character-stats.interface';
import { GameStateService } from '@core/services/game-state.service';
import { LocalizationService } from '@core/services/localization.service';
import { NotificationService } from '@core/services/notification.service';
import { generatePetFoodPreferences } from '@core/utils/food-preferences.util';
import { buildPetBaseStats, createEmptyBonusStats } from '@core/utils/pet-stats.util';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private gameState = inject(GameStateService);
  private localization = inject(LocalizationService);
  private notifications = inject(NotificationService);

  private clock = signal(Date.now());

  readonly pets = computed(() => this.gameState.gameState().pets);
  readonly incubatingEggs = computed(() => this.gameState.gameState().incubatingEggs);
  readonly slotCapacity = computed(() => this.gameState.gameState().petSlotCapacity);
  readonly hasFreeSlot = computed(() => this.pets().length < this.slotCapacity());

  canAddPet(): boolean {
    return this.hasFreeSlot();
  }

  /** Starts incubation instead of instant hatch. */
  acquireEgg(eggId: string): boolean {
    const egg = EGG_DEFINITIONS[eggId];
    if (!egg) {
      return false;
    }

    const incubationMs = getEggIncubationMs(egg.rarity);
    const now = Date.now();
    const entry: IncubatingEgg = {
      instanceId: `egg_${now}_${Math.random().toString(36).slice(2, 7)}`,
      eggId,
      acquiredAt: now,
      hatchAt: now + incubationMs,
    };

    this.gameState.updateState(state => ({
      ...state,
      incubatingEggs: [...state.incubatingEggs, entry],
    }));

    this.notifications.success(
      this.localization.t('eggIncubatingMsg', this.localization.localized(egg.name))
    );
    return true;
  }

  tickIncubation(): void {
    this.clock.set(Date.now());
    const now = Date.now();
    const ready = this.gameState.gameState().incubatingEggs.filter(egg => egg.hatchAt <= now);

    for (const entry of ready) {
      this.hatchIncubatingEgg(entry);
    }
  }

  getIncubationProgress(entry: IncubatingEgg): number {
    this.clock();
    const total = entry.hatchAt - entry.acquiredAt;
    if (total <= 0) {
      return 100;
    }
    const elapsed = Date.now() - entry.acquiredAt;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  }

  private hatchIncubatingEgg(entry: IncubatingEgg): void {
    const egg = EGG_DEFINITIONS[entry.eggId];
    if (!egg) {
      this.removeIncubatingEgg(entry.instanceId);
      return;
    }

    if (!this.canAddPet()) {
      this.notifications.warning(this.localization.t('petSlotsFullMsg'));
      return;
    }

    const species = PET_SPECIES[egg.speciesId];
    if (!species) {
      this.removeIncubatingEgg(entry.instanceId);
      return;
    }

    const petId = `pet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const pet: Pet = {
      id: petId,
      speciesId: species.id,
      name: this.localization.localized(species.name),
      visual: { ...species.defaultVisual },
      baseStats: buildPetBaseStats(species.baseStats),
      bonusStats: createEmptyBonusStats(),
      bond: 50,
      foodPreferences: generatePetFoodPreferences(petId),
      temporaryEffects: [],
      hatchedAt: Date.now(),
    };

    this.gameState.updateState(state => ({
      ...state,
      pets: [...state.pets, pet],
      incubatingEggs: state.incubatingEggs.filter(e => e.instanceId !== entry.instanceId),
    }));

    this.notifications.success(this.localization.t('petHatchedMsg', pet.name));
  }

  private removeIncubatingEgg(instanceId: string): void {
    this.gameState.updateState(state => ({
      ...state,
      incubatingEggs: state.incubatingEggs.filter(e => e.instanceId !== instanceId),
    }));
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

  trainPet(petId: string, stat: StatKey, amount: number = 1): void {
    this.applyStatBonus(petId, { [stat]: amount });
    this.notifications.info(this.localization.t('petTrainedMsg', stat));
  }

  adjustBond(petId: string, delta: number): void {
    this.gameState.updateState(state => ({
      ...state,
      pets: state.pets.map(pet => {
        if (pet.id !== petId) {
          return pet;
        }
        return {
          ...pet,
          bond: Math.max(0, Math.min(100, pet.bond + delta)),
        };
      }),
    }));
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