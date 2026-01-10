import { Injectable, signal, effect, computed } from '@angular/core';
import { GameState } from '../interfaces/game-state.interface';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly SAVE_KEY = 'tomodachiMusumeSave';
  private readonly GAME_VERSION = "0.0.1";

  private initialGameState: GameState = {
    version: this.GAME_VERSION,
    language: 'en',
    affinity: 10,
    money: 100,
    energy: 100,
    satiety: 0,
    playerName: "Jefe",
    guildName: "Oniriums",
    hasCompletedIntro: false,
    inventory: [],
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
    expression: { eyes: '/assets/img/expressions/eyes_1.png', mouth: '/assets/img/expressions/mouth_1.png' },
    characterName: "Eleanora",
  };

  public gameState = signal<GameState>(this.initialGameState);

  // Computed signals
  public money = computed(() => this.gameState().money);
  public affinity = computed(() => this.gameState().affinity);
  public energy = computed(() => this.gameState().energy);
  public satiety = computed(() => this.gameState().satiety);
  public inventory = computed(() => this.gameState().inventory);
  public equipped = computed(() => this.gameState().equipped);
  public language = computed(() => this.gameState().language);
  public playerName = computed(() => this.gameState().playerName);
  public hasCompletedIntro = computed(() => this.gameState().hasCompletedIntro);


  constructor() {
    effect(() => {
      this.saveGame();
    });
    this.loadGame();
  }

  // --- MÉTODOS AÑADIDOS PARA TITLE COMPONENT ---

  /**
   * Comprueba si existe una partida guardada válida en el LocalStorage.
   * Verifica también que la versión coincida.
   */
  hasSaveData(): boolean {
    const savedData = localStorage.getItem(this.SAVE_KEY);
    if (!savedData) return false;

    try {
      const parsedState = JSON.parse(savedData);
      // Solo devolvemos true si existe y la versión es compatible
      return parsedState.version === this.GAME_VERSION;
    } catch (e) {
      return false;
    }
  }

  /**
   * Borra los datos guardados e inicia un estado limpio.
   * Es esencialmente un alias o wrapper para newGame().
   */
  clearSaveData(): void {
    this.newGame();
  }

  // ---------------------------------------------

  loadGame(): void {
    try {
      const savedData = localStorage.getItem(this.SAVE_KEY);
      if (savedData) {
        const parsedState: GameState = JSON.parse(savedData);

        if (parsedState.version === this.GAME_VERSION) {
          this.gameState.set(parsedState);
          console.log('Game loaded successfully.');
        } else {
          console.warn(`Saved game version mismatch. Expected ${this.GAME_VERSION}, got ${parsedState.version}. Starting new game.`);
          this.newGame();
        }
      } else {
        console.log('No saved game found. Starting new game.');
        this.newGame();
      }
    } catch (error) {
      console.error('Error loading game state:', error);
      this.newGame();
    }
  }

  saveGame(): void {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.gameState()));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  newGame(): void {
    // Restauramos el estado inicial clonándolo para evitar referencias
    this.gameState.set(JSON.parse(JSON.stringify(this.initialGameState)));
    localStorage.removeItem(this.SAVE_KEY);
    console.log('New game started.');
  }

  // --- State Update Methods ---
  updateMoney(amount: number): void {
    this.gameState.update(state => ({ ...state, money: state.money + amount }));
  }

  updateAffinity(amount: number): void {
    this.gameState.update(state => {
      const newAffinity = Math.max(0, Math.min(100, state.affinity + amount));
      return { ...state, affinity: newAffinity };
    });
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

  updateEquipped(newEquipped: GameState['equipped']): void {
    this.gameState.update(state => ({ ...state, equipped: newEquipped }));
  }

  addKnownRecipe(recipeId: string): void {
    this.gameState.update(state => {
      if (!state.knownRecipes.includes(recipeId)) {
        return { ...state, knownRecipes: [...state.knownRecipes, recipeId] };
      }
      return state;
    });
  }

  updateExpression(eyes: string, mouth: string): void {
    this.gameState.update(state => ({ ...state, expression: { eyes, mouth } }));
  }
}
