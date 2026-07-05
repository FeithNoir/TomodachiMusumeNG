import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { InventoryService } from './inventory.service';
import { MissionReward } from '../interfaces/mission.interface';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  private readonly MISSION_ENERGY_COST = 10;

  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);

  hasEnoughEnergy(): boolean {
    return this.gameStateService.energy() >= this.MISSION_ENERGY_COST;
  }

  startMission(): boolean {
    if (!this.hasEnoughEnergy()) {
      console.warn('Not enough energy to start a mission.');
      return false;
    }

    this.gameStateService.updateEnergy(-this.MISSION_ENERGY_COST);
    return true;
  }

  calculateMissionRewards(): MissionReward {
    let moneyEarned = 0;
    const itemsFound: { id: string; quantity: number }[] = [];
    const recipesFound: string[] = [];
    let messageKey = 'missionReturn';

    const rand = Math.random() * 100;
    if (rand < 30) {
      messageKey = 'missionReturnNothing';
    } else {
      moneyEarned = 20;
      if (Math.random() > 0.5) {
        itemsFound.push({ id: 'wood_plank', quantity: 1 });
      }
    }

    if (moneyEarned > 0) {
      this.gameStateService.updateMoney(moneyEarned);
    }

    itemsFound.forEach(item => this.inventoryService.addItem(item.id, item.quantity));

    return { moneyEarned, itemsFound, recipesFound, messageKey };
  }
}
