import { Injectable, computed, inject } from '@angular/core';
import { COMPANION_MISSION_ID } from '@core/data/game-config';
import { ELEANORA_FOOD_PREFERENCES,
  FEEDING_AFFINITY_DISLIKED,
  FEEDING_AFFINITY_LIKED,
  FEEDING_PET_BOND_DISLIKED,
  FEEDING_PET_BOND_LIKED,
} from '@core/data/food-preferences.config';
import { FEEDABLE_ITEM_IDS } from '@core/data/food-items.database';
import { TrainingAssigneeOption } from '@core/interfaces/minigame.interface';
import { FoodPreferenceResult } from '@core/interfaces/food-preferences.interface';
import { CharacterService } from '@core/services/character.service';
import { GameStateService } from '@core/services/game-state.service';
import { InventoryService } from '@core/services/inventory.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { LocalizationService } from '@core/services/localization.service';
import { MissionService } from '@core/services/mission.service';
import { NotificationService } from '@core/services/notification.service';
import { PetService } from '@core/services/pet.service';
import { TemporaryEffectService } from '@core/services/temporary-effect.service';
import { resolveFoodPreference } from '@core/utils/food-preferences.util';

export interface FeedingResult {
  itemId: string;
  assigneeLabel: string;
  preference: FoodPreferenceResult;
  affinityDelta: number;
  bondDelta: number;
}

@Injectable({
  providedIn: 'root',
})
export class FeedingService {
  private gameState = inject(GameStateService);
  private inventory = inject(InventoryService);
  private itemCatalog = inject(ItemCatalogService);
  private characterService = inject(CharacterService);
  private petService = inject(PetService);
  private missionService = inject(MissionService);
  private tempEffects = inject(TemporaryEffectService);
  private notifications = inject(NotificationService);
  private localization = inject(LocalizationService);

  readonly feedableInventory = computed(() =>
    this.inventory.inventory().filter(entry =>
      FEEDABLE_ITEM_IDS.includes(entry.id) && entry.quantity > 0
    )
  );

  buildFeedingAssignees(): TrainingAssigneeOption[] {
    const busyIds = this.missionService.getBusyAssigneeIds();
    const options: TrainingAssigneeOption[] = [
      {
        type: 'character',
        id: COMPANION_MISSION_ID,
        label: this.gameState.gameState().characterName,
        visual: null,
        available: !busyIds.has(COMPANION_MISSION_ID),
        unavailableReasonKey: 'missionAssigneeBusy',
      },
    ];

    for (const pet of this.petService.pets()) {
      options.push({
        type: 'pet',
        id: pet.id,
        label: pet.name,
        visual: pet.visual,
        available: !busyIds.has(pet.id),
        unavailableReasonKey: 'missionAssigneeBusy',
      });
    }

    return options;
  }

  getPreferenceForItem(
    assignee: TrainingAssigneeOption,
    itemId: string
  ): FoodPreferenceResult {
    if (assignee.type === 'character') {
      return resolveFoodPreference(itemId, ELEANORA_FOOD_PREFERENCES);
    }

    const pet = this.petService.pets().find(entry => entry.id === assignee.id);
    return pet ? resolveFoodPreference(itemId, pet.foodPreferences) : 'neutral';
  }

  feed(assignee: TrainingAssigneeOption, itemId: string): FeedingResult | null {
    const item = this.itemCatalog.getItem(itemId);
    if (!item || item.type !== 'consumable') {
      return null;
    }

    if (!this.inventory.hasItem(itemId, 1)) {
      this.notifications.warning(this.localization.t('feedingNoItem'));
      return null;
    }

    const preference = this.getPreferenceForItem(assignee, itemId);
    let affinityDelta = 0;
    let bondDelta = 0;

    if (assignee.type === 'character') {
      if (preference === 'liked') {
        affinityDelta = FEEDING_AFFINITY_LIKED;
      } else if (preference === 'disliked') {
        affinityDelta = FEEDING_AFFINITY_DISLIKED;
      }
      if (affinityDelta !== 0) {
        this.characterService.updateAffinity(affinityDelta);
      }
      if (item.effects?.energy) {
        this.gameState.updateEnergy(item.effects.energy);
      }
      if (item.effects?.satiety) {
        this.gameState.updateSatiety(item.effects.satiety);
      }
      if (item.effects?.temporaryBoost) {
        this.tempEffects.applyCharacterBoost(itemId, item.effects.temporaryBoost);
      }
    } else {
      if (preference === 'liked') {
        bondDelta = FEEDING_PET_BOND_LIKED;
      } else if (preference === 'disliked') {
        bondDelta = FEEDING_PET_BOND_DISLIKED;
      }
      this.petService.adjustBond(assignee.id, bondDelta);
      if (item.effects?.temporaryBoost) {
        this.tempEffects.applyPetBoost(assignee.id, itemId, item.effects.temporaryBoost);
      }
      if (item.effects?.satiety || item.effects?.energy) {
        this.petService.applyStatBonus(assignee.id, { health: 3, endurance: 2 });
      }
    }

    this.inventory.removeItem(itemId, 1);
    this.notifyFeedResult(item, preference, affinityDelta, bondDelta);

    return {
      itemId,
      assigneeLabel: assignee.label,
      preference,
      affinityDelta,
      bondDelta,
    };
  }

  private notifyFeedResult(
    item: { name: { es: string; en: string } },
    preference: FoodPreferenceResult,
    affinityDelta: number,
    bondDelta: number
  ): void {
    const itemName = this.localization.localized(item.name);
    if (preference === 'liked') {
      this.notifications.success(this.localization.t('feedingLikedMsg', itemName));
    } else if (preference === 'disliked') {
      this.notifications.warning(this.localization.t('feedingDislikedMsg', itemName));
    } else {
      this.notifications.info(this.localization.t('feedingNeutralMsg', itemName));
    }

    if (affinityDelta > 0) {
      this.notifications.info(this.localization.t('feedingAffinityGain', affinityDelta));
    } else if (affinityDelta < 0) {
      this.notifications.warning(this.localization.t('feedingAffinityLoss', Math.abs(affinityDelta)));
    }

    if (bondDelta > 0) {
      this.notifications.info(this.localization.t('feedingBondGain', bondDelta));
    } else if (bondDelta < 0) {
      this.notifications.warning(this.localization.t('feedingBondLoss', Math.abs(bondDelta)));
    }
  }
}
