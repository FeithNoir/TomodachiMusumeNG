import { Injectable, signal, effect, computed, inject, untracked } from '@angular/core';
import { GAME_SAVE_KEY, GAME_VERSION, SATIETY_MAX } from '@core/data/game-config';
import { cloneInitialGameState, normalizeGameState } from '@core/data/initial-game-state';
import { GameState } from '@core/interfaces/game-state.interface';
import { PersistenceService } from '@core/services/persistence.service';
import { CharacterService } from '@core/services/character.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';
import { calculateMaxEnergy } from '@core/utils/character-stats.util';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  public gameState = signal<GameState>(cloneInitialGameState());

  public money = computed(() => this.gameState().money);
  public energy = computed(() => this.gameState().energy);
  public satiety = computed(() => this.gameState().satiety);
  public inventory = computed(() => this.gameState().inventory);
  public language = computed(() => this.gameState().language);
  public playerName = computed(() => this.gameState().playerName);
  public hasCompletedIntro = computed(() => this.gameState().hasCompletedIntro);

  private persistenceService = inject(PersistenceService);
  private itemCatalog = inject(ItemCatalogService);
  private isHydrating = true;
  private persistChanges = false;

  constructor() {
    this.loadGame();
    this.persistChanges = true;

    effect(() => {
      this.gameState();
      if (!this.persistChanges || this.isHydrating) {
        return;
      }

      untracked(() => this.saveGame());
    });
  }

  public syncCharacterState(charService: CharacterService): void {
    effect(() => {
      const affinity = charService.affinity();
      const equipped = charService.equipped();
      const expression = charService.expression();

      untracked(() => {
        this.gameState.update(state => ({
          ...state,
          affinity,
          equipped,
          expression,
        }));
        this.clampEnergyToMax();
      });
    });

    const current = this.gameState();
    charService.affinity.set(current.affinity);
    charService.equipped.set(current.equipped);
    charService.expression.set(current.expression);
  }

  hasSaveData(): boolean {
    if (!this.persistenceService.hasSavedData(GAME_SAVE_KEY)) {
      return false;
    }

    const parsedState = this.persistenceService.load(GAME_SAVE_KEY) as GameState | null;
    return parsedState !== null && typeof parsedState === 'object';
  }

  clearSaveData(): void {
    this.persistenceService.clear(GAME_SAVE_KEY);
    this.newGame();
  }

  loadGame(): void {
    if (this.persistenceService.isElectron()) {
      void this.loadFromElectron();
      return;
    }

    this.applyLoadedState(this.persistenceService.load(GAME_SAVE_KEY));
  }

  saveGame(): void {
    this.persistenceService.save(GAME_SAVE_KEY, this.gameState());
  }

  newGame(): void {
    this.isHydrating = true;
    this.gameState.set(cloneInitialGameState());
    this.isHydrating = false;
    console.log('New game initialized.');
  }

  updateMoney(amount: number): void {
    this.gameState.update(state => ({ ...state, money: state.money + amount }));
  }

  updateEnergy(amount: number): void {
    const maxEnergy = this.resolveMaxEnergy();
    this.gameState.update(state => {
      const newEnergy = Math.max(0, Math.min(maxEnergy, state.energy + amount));
      return { ...state, energy: newEnergy };
    });
  }

  clampEnergyToMax(): void {
    const maxEnergy = this.resolveMaxEnergy();
    this.gameState.update(state => ({
      ...state,
      energy: Math.min(state.energy, maxEnergy),
    }));
  }

  private resolveMaxEnergy(): number {
    const state = this.gameState();
    return calculateMaxEnergy(
      state.equipped,
      state.trainingStatBonus,
      id => this.itemCatalog.getItemStats(id)
    );
  }

  updateSatiety(amount: number): void {
    this.gameState.update(state => {
      const newSatiety = Math.max(0, Math.min(SATIETY_MAX, state.satiety + amount));
      return { ...state, satiety: newSatiety };
    });
  }

  setPlayerName(name: string): void {
    this.gameState.update(state => ({ ...state, playerName: name }));
  }

  setLanguage(lang: string): void {
    this.gameState.update(state => ({ ...state, language: lang }));
  }

  setHasCompletedIntro(completed: boolean): void {
    this.gameState.update(state => ({ ...state, hasCompletedIntro: completed }));
  }

  updateInventory(newInventory: { id: string; quantity: number }[]): void {
    this.gameState.update(state => ({ ...state, inventory: newInventory }));
  }

  addKnownRecipe(recipeId: string): void {
    this.gameState.update(state => {
      if (!state.knownRecipes.includes(recipeId)) {
        return { ...state, knownRecipes: [...state.knownRecipes, recipeId] };
      }
      return state;
    });
  }

  updateState(updater: (state: GameState) => GameState): void {
    this.gameState.update(updater);
  }

  private async loadFromElectron(): Promise<void> {
    try {
      const parsedState = await this.persistenceService.loadFromElectron();
      this.applyLoadedState(parsedState);
    } catch (error) {
      console.error('Error loading game state from Electron:', error);
      this.newGame();
    }
  }

  private applyLoadedState(parsedState: unknown): void {
    this.isHydrating = true;

    try {
      if (parsedState && typeof parsedState === 'object' && 'version' in parsedState) {
        const state = normalizeGameState(parsedState as Partial<GameState>);
        this.gameState.set({ ...state, version: GAME_VERSION });
        console.log('Game loaded successfully.');
      } else {
        console.log('No saved game found. Starting new game.');
        this.gameState.set(cloneInitialGameState());
      }
    } catch (error) {
      console.error('Error applying loaded game state:', error);
      this.gameState.set(cloneInitialGameState());
    } finally {
      this.isHydrating = false;
    }
  }
}
