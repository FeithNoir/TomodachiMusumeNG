import { Component, inject, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialogue, DialogueOption } from '../../core/interfaces/dialogue.interface';

@Component({
  selector: 'app-dialogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent {
  // El diálogo actual se recibe como una entrada (input) desde el componente padre.
  dialogue = input.required<Dialogue | null>();

  // Evento que se emite cuando el jugador selecciona una opción.
  @Output() optionSelected = new EventEmitter<DialogueOption>();

  /**
   * Maneja el clic en una opción de diálogo.
   * Emite el evento `optionSelected` con la opción elegida.
   * @param option - La opción de diálogo que fue seleccionada.
   */
  onOptionClick(option: DialogueOption): void {
    this.optionSelected.emit(option);
  }
}
