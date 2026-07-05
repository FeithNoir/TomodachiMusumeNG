import { Injectable, signal, effect, computed, inject, untracked } from '@angular/core';
import { GameState } from '../interfaces/game-state.interface';
import { PersistenceService } from './persistence.service';
import { CharacterService } from './character.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private readonly SAVE_KEY = 'tomodachiMusumeSave';
  private readonly GAME_VERSION = '0.0.1';

  private readonly initialGameState: GameState = {
    version: this.GAME_VERSION,
    language: 'en',
    affinity: 10,
    money: 100,
    energy: 100,
    satiety: 0,
    playerName: 'Jefe',
    guildName: 'Oniriums',
    hasCompletedIntro: false,
    inventory: [
      { id: 'cheap_shirt', quantity: 1 },
      { id: 'cheap_pants', quantity: 1 },
      { id: 'bra_1', quantity: 1 },
      { id: 'pantsus_1', quantity: 1 },
    ],
    equipped: {
      top: 'cheap_shirt',
      bottom: 'cheap_pants',
      suit: null,
      head: null,
      stockings: null,
      bra: 'bra_1',
      pantsus: 'pantsus_1',
      hands: null,
      weapon: null,
    },
    knownRecipes: [],
    expression: { eyes: 'assets/img/expressions/eyes_1.png', mouth: 'assets/img/expressions/mouth_1.png' },
    characterName: 'Eleanora',
  };

  public gameState = signal<GameState>(this.initialGameState);

  public money = computed(() => this.gameState().money);
  public energy = computed(() => this.gameState().energy);
  public satiety = computed(() => this.gameState().satiety);
  public inventory = computed(() => this.gameState().inventory);
  public language = computed(() => this.gameState().language);
  public playerName = computed(() => this.gameState().playerName);
  public hasCompletedIntro = computed(() => this.gameState().hasCompletedIntro);

  private persistenceService = inject(PersistenceService);
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
      });
    });

    const current = this.gameState();
    charService.affinity.set(current.affinity);
    charService.equipped.set(current.equipped);
    charService.expression.set(current.expression);
  }

  hasSaveData(): boolean {
    if (!this.persistenceService.hasSavedData(this.SAVE_KEY)) {
      return false;
    }

    const parsedState = this.persistenceService.load(this.SAVE_KEY) as GameState | null;
    return parsedState?.version === this.GAME_VERSION;
  }

  clearSaveData(): void {
    this.persistenceService.clear(this.SAVE_KEY);
    this.newGame();
  }

  loadGame(): void {
    if (this.persistenceService.isElectron()) {
      void this.loadFromElectron();
      return;
    }

    this.applyLoadedState(this.persistenceService.load(this.SAVE_KEY));
  }

  saveGame(): void {
    this.persistenceService.save(this.SAVE_KEY, this.gameState());
  }

  newGame(): void {
    this.isHydrating = true;
    this.gameState.set(JSON.parse(JSON.stringify(this.initialGameState)) as GameState);
    this.isHydrating = false;
    console.log('New game initialized.');
  }

  updateMoney(amount: number): void {
    this.gameState.update(state => ({ ...state, money: state.money + amount }));
  }

  updateEnergy(amount: number): void {
    this.gameState.update(state => {
      const newEnergy = Math.max(0, Math.min(100, state.energy + amount));
      return { ...state, energy: newEnergy };
    });
  }

  updateSatiety(amount: number): void {
    this.gameState.update(state => {
      const newSatiety = Math.max(0, Math.min(100, state.satiety + amount));
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
        const state = parsedState as GameState;
        if (state.version === this.GAME_VERSION) {
          this.gameState.set(state);
          console.log('Game loaded successfully.');
        } else {
          console.warn(
            `Saved game version mismatch. Expected ${this.GAME_VERSION}, got ${state.version}. Starting new game.`
          );
          this.gameState.set(JSON.parse(JSON.stringify(this.initialGameState)) as GameState);
        }
      } else {
        console.log('No saved game found. Starting new game.');
        this.gameState.set(JSON.parse(JSON.stringify(this.initialGameState)) as GameState);
      }
    } catch (error) {
      console.error('Error applying loaded game state:', error);
      this.gameState.set(JSON.parse(JSON.stringify(this.initialGameState)) as GameState);
    } finally {
      this.isHydrating = false;
    }
  }
}
