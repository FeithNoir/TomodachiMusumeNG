import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';
import { CharacterComponent } from '../../shared/character/character.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  private gameStateService = inject(GameStateService);

  // Constantes para los temporizadores del juego
  private readonly ENERGY_RECOVERY_INTERVAL = 3000; // 3 segundos
  private readonly SATIETY_DECAY_INTERVAL = 3000; // 3 segundos

  private energyRecoveryTimerId: any;
  private satietyDecayTimerId: any;

  constructor() { }

  /**
   * ngOnInit se ejecuta cuando el componente se inicializa.
   * Aquí se carga la partida o se inicia una nueva.
   */
  ngOnInit(): void {
    // Intenta cargar el juego. Si no hay partida guardada o es inválida,
    // el servicio se encargará de establecer un estado inicial.
    this.gameStateService.loadGame();

    // Inicia los temporizadores de recuperación/decaída de estado.
    this.startTimers();
  }

  /**
   * ngOnDestroy se ejecuta cuando el componente se destruye.
   * Es crucial limpiar los temporizadores para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.stopTimers();
  }

  /**
   * Inicia todos los temporizadores del juego.
   */
  private startTimers(): void {
    this.startEnergyRecovery();
    this.startSatietyDecay();
  }

  /**
   * Detiene todos los temporizadores del juego.
   */
  private stopTimers(): void {
    if (this.energyRecoveryTimerId) {
      clearInterval(this.energyRecoveryTimerId);
    }
    if (this.satietyDecayTimerId) {
      clearInterval(this.satietyDecayTimerId);
    }
  }

  /**
   * Inicia el temporizador para la recuperación de energía.
   */
  private startEnergyRecovery(): void {
    this.energyRecoveryTimerId = setInterval(() => {
      if (this.gameStateService.energy() < 100) {
        this.gameStateService.updateEnergy(1); // Recupera 1 de energía
      }
    }, this.ENERGY_RECOVERY_INTERVAL);
  }

  /**
   * Inicia el temporizador para la disminución de la saciedad.
   */
  private startSatietyDecay(): void {
    this.satietyDecayTimerId = setInterval(() => {
      if (this.gameStateService.satiety() > 0) {
        this.gameStateService.updateSatiety(-1); // Pierde 1 de saciedad
      }
    }, this.SATIETY_DECAY_INTERVAL);
  }
}
