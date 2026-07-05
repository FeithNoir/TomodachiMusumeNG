import { Injectable, inject } from '@angular/core';
import { GameStateService } from '@core/services/game-state.service';
import { InventoryService } from '@core/services/inventory.service';
import {
  MISSION_BASE_MONEY_REWARD,
  MISSION_ITEM_DROPS,
  MISSION_NOTHING_CHANCE_PERCENT,
} from '@core/data/mission-config';
import { MISSION_ENERGY_COST } from '@core/data/game-config';
import { MissionReward } from '@core/interfaces/mission.interface';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);

  hasEnoughEnergy(): boolean {
    return this.gameStateService.energy() >= MISSION_ENERGY_COST;
  }

  startMission(): boolean {
    if (!this.hasEnoughEnergy()) {
      console.warn('Not enough energy to start a mission.');
      return false;
    }

    this.gameStateService.updateEnergy(-MISSION_ENERGY_COST);
    return true;
  }

  calculateMissionRewards(): MissionReward {
    let moneyEarned = 0;
    const itemsFound: { id: string; quantity: number }[] = [];
    const recipesFound: string[] = [];
    let messageKey = 'missionReturn';

    const rand = Math.random() * 100;
    if (rand < MISSION_NOTHING_CHANCE_PERCENT) {
      messageKey = 'missionReturnNothing';
    } else {
      moneyEarned = MISSION_BASE_MONEY_REWARD;

      for (const drop of MISSION_ITEM_DROPS) {
        if (Math.random() > drop.dropChance) {
          itemsFound.push({ id: drop.id, quantity: drop.quantity });
        }
      }
    }

    if (moneyEarned > 0) {
      this.gameStateService.updateMoney(moneyEarned);
    }

    itemsFound.forEach(item => this.inventoryService.addItem(item.id, item.quantity));

    return { moneyEarned, itemsFound, recipesFound, messageKey };
  }
}
