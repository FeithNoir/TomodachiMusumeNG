import { Injectable, inject } from '@angular/core';
import { ActiveTemporaryEffect, TemporaryStatBoost } from '@core/interfaces/temporary-effect.interface';
import { GameStateService } from '@core/services/game-state.service';
import { filterActiveEffects, sumTemporaryEffects } from '@core/utils/temporary-effect.util';
@Injectable({
  providedIn: 'root',
})
export class TemporaryEffectService {
  private gameState = inject(GameStateService);

  tickExpiredEffects(): void {
    const now = Date.now();
    const state = this.gameState.gameState();
    const characterEffects = filterActiveEffects(state.characterTemporaryEffects, now);
    const petsChanged = state.pets.some(pet =>
      pet.temporaryEffects.some(effect => effect.expiresAt <= now)
    );
    if (
      characterEffects.length === state.characterTemporaryEffects.length &&
      !petsChanged
    ) {
      return;
    }

    this.gameState.updateState(s => ({
      ...s,
      characterTemporaryEffects: characterEffects,
      pets: s.pets.map(pet => ({
        ...pet,
        temporaryEffects: filterActiveEffects(pet.temporaryEffects, now),
      })),
    }));
  }

  applyCharacterBoost(itemId: string, boost: TemporaryStatBoost): void {
    const entry = this.createEffect(itemId, boost);
    this.gameState.updateState(state => ({
      ...state,
      characterTemporaryEffects: [...state.characterTemporaryEffects, entry],
    }));
  }

  applyPetBoost(petId: string, itemId: string, boost: TemporaryStatBoost): void {
    const entry = this.createEffect(itemId, boost);
    this.gameState.updateState(state => ({
      ...state,
      pets: state.pets.map(pet =>
        pet.id === petId
          ? { ...pet, temporaryEffects: [...pet.temporaryEffects, entry] }
          : pet
      ),
    }));
  }

  getCharacterTemporaryBonus() {
    return sumTemporaryEffects(this.gameState.gameState().characterTemporaryEffects);
  }

  getPetTemporaryBonus(petId: string) {
    const pet = this.gameState.gameState().pets.find(entry => entry.id === petId);
    return sumTemporaryEffects(pet?.temporaryEffects ?? []);
  }
  private createEffect(itemId: string, boost: TemporaryStatBoost): ActiveTemporaryEffect {
    return {
      id: `fx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sourceItemId: itemId,
      stats: { ...boost.stats },
      expiresAt: Date.now() + boost.durationMs,
    };
  }
}