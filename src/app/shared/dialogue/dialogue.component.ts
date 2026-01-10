import { Component, inject, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialogue, DialogueOption, LocalizedText } from '../../core/interfaces/dialogue.interface';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-dialogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent {
  private gameStateService = inject(GameStateService);

  // El diálogo actual se recibe como una entrada (input) desde el componente padre.
  dialogue = input.required<Dialogue | null>();

  // Evento que se emite cuando el jugador selecciona una opción.
  @Output() optionSelected = new EventEmitter<DialogueOption>();

  /**
   * Obtiene el texto del diálogo procesado (ejecuta la función con el nombre del jugador)
   * y traducido al idioma actual.
   */
  get processedText(): string {
    const diag = this.dialogue();
    if (!diag) return '';

    const lang = this.gameStateService.language() as keyof LocalizedText;
    const playerName = this.gameStateService.playerName();

    // Ejecutamos la función de texto y devolvemos la traducción
    const localizedObj = diag.text(playerName);
    return localizedObj[lang] || localizedObj['en'];
  }

  /**
   * Obtiene el texto de una opción traducido al idioma actual.
   */
  getLocalizedOptionText(option: DialogueOption): string {
    const lang = this.gameStateService.language() as keyof LocalizedText;
    return option.text[lang] || option.text['en'];
  }

  /**
   * Maneja el clic en una opción de diálogo.
   * Emite el evento `optionSelected` con la opción elegida.
   * @param option - La opción de diálogo que fue seleccionada.
   */
  onOptionClick(option: DialogueOption): void {
    this.optionSelected.emit(option);
  }
}
