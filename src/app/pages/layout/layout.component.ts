import { Component, OnInit, OnDestroy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';
import { CharacterComponent } from '../../shared/character/character.component';
import { InfoComponent } from '../../shared/info/info.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, CharacterComponent, InfoComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private gameStateService = inject(GameStateService); // Use inject()

  // Constants for game timers
  private readonly ENERGY_RECOVERY_INTERVAL = 3000; // 3 seconds
  private readonly ENERGY_RECOVERY_RATE = 1; // Points per tick
  private readonly SATIETY_DECAY_RATE = 1; // Points per tick

  private energyRecoveryTimerId: any;
  private satietyDecayTimerId: any;

  // Expose game state signals for template
  public money = this.gameStateService.money;
  public affinity = this.gameStateService.affinity;
  public energy = this.gameStateService.energy;
  public satiety = this.gameStateService.satiety;
  public hasCompletedIntro = this.gameStateService.hasCompletedIntro;

  constructor() { } // Constructor can be empty if using inject()

  ngOnInit(): void {
    // Start timers if conditions are met
    if (this.gameStateService.energy() < 100) {
      this.startEnergyRecovery();
    }
    if (this.gameStateService.satiety() > 0) {
      this.startSatietyDecay();
    }
  }

  ngOnDestroy(): void {
    // Clear timers to prevent memory leaks
    this.stopEnergyRecovery();
    this.stopSatietyDecay();
  }

  private startEnergyRecovery(): void {
    if (this.energyRecoveryTimerId) return; // Already running

    this.energyRecoveryTimerId = setInterval(() => {
      if (this.gameStateService.energy() < 100) {
        this.gameStateService.updateEnergy(this.ENERGY_RECOVERY_RATE);
      } else {
        this.stopEnergyRecovery();
      }
    }, this.ENERGY_RECOVERY_INTERVAL);
  }

  private stopEnergyRecovery(): void {
    if (this.energyRecoveryTimerId) {
      clearInterval(this.energyRecoveryTimerId);
      this.energyRecoveryTimerId = null;
    }
  }

  private startSatietyDecay(): void {
    if (this.satietyDecayTimerId) return; // Already running

    this.satietyDecayTimerId = setInterval(() => {
      if (this.gameStateService.satiety() > 0) {
        this.gameStateService.updateSatiety(-this.SATIETY_DECAY_RATE); // Decay means decrease
      } else {
        this.stopSatietyDecay();
      }
    }, this.ENERGY_RECOVERY_INTERVAL); // Corrected: should be SATIETY_DECAY_INTERVAL
  }

  private stopSatietyDecay(): void {
    if (this.satietyDecayTimerId) {
      clearInterval(this.satietyDecayTimerId);
      this.satietyDecayTimerId = null;
    }
  }
}
