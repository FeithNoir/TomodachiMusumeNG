import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';
import { LocalizedText } from '../../core/interfaces/item.interface';

// El tipo de acción que puede ser emitida por este componente.
export type SidebarAction = 'talk' | 'equip' | 'interact' | 'mission' | 'market' | 'craft';

// Textos de UI para los botones de acción.
const UI_TEXTS: Record<string, LocalizedText> = {
  talk: { es: 'Hablar', en: 'Talk' },
  equip: { es: 'Equipo', en: 'Gear' },
  interact: { es: 'Interactuar', en: 'Interact' },
  mission: { es: 'Misión', en: 'Mission' },
  market: { es: 'Mercado', en: 'Market' },
  craft: { es: 'Crear', en: 'Craft' },
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private gameStateService = inject(GameStateService);

  // Emite un evento cuando se hace clic en un botón de acción.
  @Output() action = new EventEmitter<SidebarAction>();

  private language = this.gameStateService.language;

  // Define la estructura de los botones de acción.
  public readonly menuActions: { id: string; label: string; action: SidebarAction; icon: string; }[] = [
    { id: 'talkButton', label: 'talk', action: 'talk', icon: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z' },
    { id: 'equipButton', label: 'equip', action: 'equip', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' },
    { id: 'interactButton', label: 'interact', action: 'interact', icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
    { id: 'missionButton', label: 'mission', action: 'mission', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'marketButton', label: 'market', action: 'market', icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.82-6.781a1.125 1.125 0 00-1.087-1.418H4.871c-.51 0-.962.343-1.087.835L2.25 3z' },
    { id: 'craftingButton', label: 'craft', action: 'craft', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3.75h16.5M12 18.75h3.75a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0015.75 4.5h-3.75a2.25 2.25 0 00-2.25 2.25v11.25' },
  ];

  /**
   * Emite el evento de acción al componente padre.
   * @param actionType - El tipo de acción a emitir.
   */
  onAction(actionType: SidebarAction): void {
    this.action.emit(actionType);
  }

  /**
   * Obtiene el texto localizado para una clave dada.
   * @param key - La clave del texto en el diccionario UI_TEXTS.
   * @returns El texto traducido.
   */
  getText(key: string): string {
    const currentLang = this.language() as keyof LocalizedText;
    if (UI_TEXTS[key]) {
      return UI_TEXTS[key][currentLang] || UI_TEXTS[key]['en'];
    }
    return key;
  }
}
