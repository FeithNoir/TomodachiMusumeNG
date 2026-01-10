import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  private router = inject(Router);
  private gameStateService = inject(GameStateService);

  // Señal para habilitar/deshabilitar el botón de "Cargar Partida"
  public canLoadGame = signal(false);

  ngOnInit(): void {
    // Al iniciar, comprueba si existe una partida guardada
    this.canLoadGame.set(this.gameStateService.hasSaveData());
  }

  /**
   * Inicia una nueva partida.
   * Borra cualquier dato guardado y navega a la pantalla principal del juego.
   */
  newGame(): void {
    this.gameStateService.clearSaveData();
    this.router.navigate(['/main']);
  }

  /**
   * Carga una partida existente.
   * Navega a la pantalla principal (el servicio se encargará de cargar los datos).
   */
  loadGame(): void {
    if (this.canLoadGame()) {
      // No es necesario llamar a loadGame() aquí, ya que main.component lo hará.
      // Simplemente navegamos.
      this.router.navigate(['/main']);
    }
  }
}
