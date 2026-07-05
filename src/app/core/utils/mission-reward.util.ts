import { MissionRewardRoll } from '@core/interfaces/mission-definition.interface';
import { LocalizationService } from '@core/services/localization.service';
import { EGG_DEFINITIONS } from '@core/data/egg-database';
import { PET_SPECIES } from '@core/data/pet-species-database';

export interface MissionRewardSummary {
  hasLoot: boolean;
  moneyEarned: number;
  items: { id: string; quantity: number; name: string }[];
  recipes: string[];
  eggs: string[];
}

export function summarizeMissionReward(
  reward: MissionRewardRoll,
  localization: LocalizationService
): MissionRewardSummary {
  const items = reward.itemsFound.map(entry => ({
    id: entry.id,
    quantity: entry.quantity,
    name: localization.itemName(entry.id),
  }));

  const eggs = reward.eggsFound.map(eggId => {
    const egg = EGG_DEFINITIONS[eggId];
    if (!egg) {
      return eggId;
    }
    const species = PET_SPECIES[egg.speciesId];
    const speciesName = species ? localization.localized(species.name) : egg.speciesId;
    return `${localization.localized(egg.name)} → ${speciesName}`;
  });

  const hasLoot =
    reward.moneyEarned > 0 ||
    items.length > 0 ||
    reward.recipesFound.length > 0 ||
    eggs.length > 0;

  return {
    hasLoot,
    moneyEarned: reward.moneyEarned,
    items,
    recipes: reward.recipesFound,
    eggs,
  };
}
