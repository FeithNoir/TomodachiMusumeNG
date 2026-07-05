import { Injectable, computed, inject } from '@angular/core';
import { STAT_KEYS, CharacterStats, StatKey } from '@core/interfaces/character-stats.interface';
import { Pet } from '@core/interfaces/pet.interface';
import { GameStateService } from '@core/services/game-state.service';
import { getPetTotalStats, mergePetStats } from '@core/utils/pet-stats.util';

@Injectable({
  providedIn: 'root',
})
export class PetStatsService {
  private gameState = inject(GameStateService);

  getPetById(petId: string): Pet | undefined {
    return this.gameState.gameState().pets.find(pet => pet.id === petId);
  }

  getTotalStats(petId: string): CharacterStats | null {
    const pet = this.getPetById(petId);
    if (!pet) {
      return null;
    }
    return getPetTotalStats(pet);
  }

  getBonusStats(petId: string): Partial<CharacterStats> {
    return this.getPetById(petId)?.bonusStats ?? {};
  }

  meetsStatRequirements(petId: string, requirements: { stat: StatKey; minValue: number }[]): boolean {
    const stats = this.getTotalStats(petId);
    if (!stats) {
      return false;
    }

    return requirements.every(req => stats[req.stat] >= req.minValue);
  }

  readonly petsWithStats = computed(() =>
    this.gameState.gameState().pets.map(pet => ({
      pet,
      total: getPetTotalStats(pet),
    }))
  );

  mergeStats(base: CharacterStats, bonus: Partial<CharacterStats>): CharacterStats {
    return mergePetStats(base, bonus);
  }

  sumBonusKeys(bonus: Partial<CharacterStats>): number {
    return STAT_KEYS.reduce((sum, key) => sum + (bonus[key] ?? 0), 0);
  }
}
