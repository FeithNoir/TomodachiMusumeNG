import { Injectable, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { InventoryService } from './inventory.service';
import { masterItemList } from '../data/item-database';

interface MissionReward {
  moneyEarned: number;
  itemsFound: { id: string; quantity: number }[];
  recipesFound: string[];
  messageKey: string; // Key for localized message
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private readonly MISSION_ENERGY_COST = 10;

  // --- TABLAS DE LOOT DE MISIONES ---
  private missionLoot = {
    materials: { 'wood_plank': 0.4, 'iron_ore': 0.1 }, // Probabilidad de encontrar cada material
    recipes: { 'recipe_steel_sword': 0.05 } // 5% de probabilidad de encontrar esta receta
  };

  constructor(
    private gameStateService: GameStateService,
    private inventoryService: InventoryService
  ) { }

  /**
   * Initiates a mission attempt.
   * @returns True if mission started, false if not enough energy.
   */
  startMission(): boolean {
    if (this.gameStateService.energy() < this.MISSION_ENERGY_COST) {
      console.warn('Not enough energy to start a mission.');
      // TODO: Notify user
      return false;
    }

    this.gameStateService.updateEnergy(-this.MISSION_ENERGY_COST);
    // The actual progress simulation will be handled by the component
    return true;
  }

  /**
   * Calculates the rewards for a completed mission.
   * @returns An object containing the mission rewards.
   */
  calculateMissionRewards(): MissionReward {
    let moneyEarned = 0;
    const itemsFound: { id: string; quantity: number }[] = [];
    const recipesFound: string[] = [];
    let messageKey: string = 'missionReturn'; // Default message

    // 1. Aplicar bonus de arma equipada
    let weaponBonus = { nothingChance: 0, itemChance: 0 };
    const equippedWeaponId = this.gameStateService.equipped().weapon;
    if (equippedWeaponId) {
      const weaponData = masterItemList[equippedWeaponId];
      if (weaponData?.effects?.missionBonus) {
        weaponBonus = weaponData.effects.missionBonus;
      }
    }

    // 2. Calcular la probabilidad de no encontrar nada
    const nothingChance = 30 * (1 + weaponBonus.nothingChance);
    const rand = Math.random() * 100;

    // 3. Determinar la recompensa base (dinero o nada)
    switch (true) {
      case (rand < nothingChance):
        messageKey = 'missionReturnNothing';
        break;
      case (rand < 50):
        moneyEarned = 10;
        break;
      case (rand < 60):
        moneyEarned = 20;
        break;
      case (rand < 65):
        moneyEarned = 100;
        break;
      case (rand < 75):
        moneyEarned = 10;
        break;
      case (rand < 85):
        moneyEarned = 20;
        break;
      case (rand < 90):
        moneyEarned = 100;
        break;
      default:
        break;
    }

    // 4. Calcular el loot adicional (materiales y recetas) si la misión no fue un fracaso total
    if (rand >= nothingChance) {
      // Posibilidad de encontrar materiales
      Object.entries(this.missionLoot.materials).forEach(([materialId, chance]) => {
        if (Math.random() < chance + weaponBonus.itemChance) {
          itemsFound.push({ id: materialId, quantity: 1 });
        }
      });
      // Posibilidad de encontrar recetas
      Object.entries(this.missionLoot.recipes).forEach(([recipeId, chance]) => {
        const recipeData = masterItemList[recipeId];
        if (recipeData?.recipeId && !this.gameStateService.gameState().knownRecipes.includes(recipeData.recipeId) && Math.random() < chance) {
          recipesFound.push(recipeData.recipeId);
          this.gameStateService.addKnownRecipe(recipeData.recipeId);
        }
      });
    }

    // Apply rewards to game state
    if (moneyEarned > 0) {
      this.gameStateService.updateMoney(moneyEarned);
    }
    itemsFound.forEach(item => this.inventoryService.addItem(item.id, item.quantity));

    return { moneyEarned, itemsFound, recipesFound, messageKey };
  }
}