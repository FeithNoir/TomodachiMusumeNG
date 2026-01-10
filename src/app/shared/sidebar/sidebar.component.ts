import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/services/game-state.service';
import { PersistenceService } from '../../core/services/persistence.service';
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
    { id: 'talkButton', label: 'talk', action: 'talk', icon: '/assets/icons/talk.svg' },
    { id: 'equipButton', label: 'equip', action: 'equip', icon: '/assets/icons/gear.svg' },
    { id: 'interactButton', label: 'interact', action: 'interact', icon: '/assets/icons/interact.svg' },
    { id: 'missionButton', label: 'mission', action: 'mission', icon: '/assets/icons/mission.svg' },
    { id: 'marketButton', label: 'market', action: 'market', icon: '/assets/icons/market.svg' },
    { id: 'craftingButton', label: 'craft', action: 'craft', icon: '/assets/icons/craft.svg' },
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
