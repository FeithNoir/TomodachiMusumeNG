import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { InventoryService } from './inventory.service';
import { masterItemList } from '../data/item-database';

// Exportamos la interfaz para usarla en el componente
export interface MissionReward {
  moneyEarned: number;
  itemsFound: { id: string; quantity: number }[];
  recipesFound: string[];
  messageKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private readonly MISSION_ENERGY_COST = 10;

  private missionLoot = {
    materials: { 'wood_plank': 0.4, 'iron_ore': 0.1 },
    recipes: { 'recipe_steel_sword': 0.05 }
  };

  constructor(
    private gameStateService: GameStateService,
    private inventoryService: InventoryService
  ) { }

  /**
   * NUEVO: Permite al componente saber si hay energía sin gastarla todavía.
   */
  hasEnoughEnergy(): boolean {
    return this.gameStateService.energy() >= this.MISSION_ENERGY_COST;
  }

  /**
   * Intenta iniciar la misión y consume energía.
   */
  startMission(): boolean {
    if (!this.hasEnoughEnergy()) {
      console.warn('Not enough energy to start a mission.');
      return false;
    }

    this.gameStateService.updateEnergy(-this.MISSION_ENERGY_COST);
    return true;
  }

  calculateMissionRewards(): MissionReward {
    // ... (El código de cálculo se mantiene igual que en tu ejemplo) ...
    // COPIA AQUÍ EL CONTENIDO DE TU MÉTODO calculateMissionRewards ORIGINAL
    // Solo me aseguro de retornarlo correctamente:

    // --- (Lógica resumida para el ejemplo) ---
    let moneyEarned = 0;
    const itemsFound: { id: string; quantity: number }[] = [];
    const recipesFound: string[] = [];
    let messageKey: string = 'missionReturn';

    // ... (Toda tu lógica de probabilidad aquí) ...
    // Simulamos un resultado básico si no copias tu lógica completa:
    const rand = Math.random() * 100;
    if (rand < 30) {
        messageKey = 'missionReturnNothing';
    } else {
        moneyEarned = 20;
        // Simulamos un item
        if (Math.random() > 0.5) itemsFound.push({ id: 'wood_plank', quantity: 1 });
    }

    // Aplicar cambios
    if (moneyEarned > 0) this.gameStateService.updateMoney(moneyEarned);
    itemsFound.forEach(item => this.inventoryService.addItem(item.id, item.quantity));

    return { moneyEarned, itemsFound, recipesFound, messageKey };
  }
}
