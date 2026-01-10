import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/services/game-state.service';
import { PersistenceService } from '../../core/services/persistence.service';
import { LocalizedText } from '../../core/interfaces/item.interface';

// Textos de UI para este componente
const UI_TEXTS: Record<string, LocalizedText> = {
  menuTitle: { es: "Menú", en: "Menu" },
  options: { es: "Opciones", en: "Options" },
  save: { es: "Guardar", en: "Save" },
  gallery: { es: "Galería (Próximamente)", en: "Gallery (Coming Soon)" },
  exit: { es: "Salir", en: "Exit" },
};

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  private gameStateService = inject(GameStateService);
  private persistenceService = inject(PersistenceService);
  private router = inject(Router);

  @Output() menuAction = new EventEmitter<string>();

  public isOpen = signal(false);
  private language = this.gameStateService.language;

  /**
   * Alterna la visibilidad del panel de menú.
   */
  toggle(): void {
    this.isOpen.set(!this.isOpen());
  }

  /**
   * Cierra el panel de menú.
   */
  close(): void {
    this.isOpen.set(false);
  }

  /**
   * Maneja los clics en las opciones del menú.
   * @param action - La acción a realizar ('save', 'options', etc.)
   */
  onOptionClick(action: string): void {
    if (action === 'save') {
      this.gameStateService.saveGame();
    } else if (action === 'exit') {
      if (this.persistenceService.isElectron) {
        this.persistenceService.quit();
      } else {
        this.router.navigate(['/']);
      }
    } else {
      // Para otras acciones como 'options', emitimos un evento
      this.menuAction.emit(action);
    }
    this.close(); // Cierra el menú después de la acción
  }

  /**
   * Obtiene el texto localizado para una clave dada.
   * @param key - La clave del texto en el diccionario UI_TEXTS.
   * @returns El texto traducido.
   */
  getText(key: string): string {
    const currentLang = this.language() as keyof LocalizedText;
    const textEntry = UI_TEXTS[key];
    if (textEntry) {
      return textEntry[currentLang] || textEntry['en'];
    }
    return key;
  }
}
