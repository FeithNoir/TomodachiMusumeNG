import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';
import { CharacterService } from '../../core/services/character.service';
import { LocalizedText } from '../../core/interfaces/item.interface'; // Import LocalizedText

// 1. Tipamos explícitamente el diccionario para evitar el error de "implicit any"
const UI_TEXTS: Record<string, LocalizedText> = {
  affinity: { es: "Afinidad", en: "Affinity" },
  money: { es: "Dinero", en: "Money" },
  energy: { es: "Energía", en: "Energy" },
  satiety: { es: "Saciedad", en: "Satiety" },
};

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  private gameStateService = inject(GameStateService); // Use inject()
  private characterService = inject(CharacterService);

  public affinity = this.characterService.affinity;
  public money = this.gameStateService.money;
  public energy = this.gameStateService.energy;
  public satiety = this.gameStateService.satiety;
  public language = this.gameStateService.language;

  constructor() { } // Constructor can be empty if using inject()

  // 2. Simplificamos el método getText
  getText(key: string): string {
    // Casteamos el idioma actual para asegurarnos de que sea una clave válida
    const currentLang = this.language() as keyof LocalizedText;

    // Obtenemos el objeto de textos
    const textEntry = UI_TEXTS[key];

    // Verificamos si existe y retornamos la traducción o el fallback en inglés
    if (textEntry) {
      return textEntry[currentLang] || textEntry['en'];
    }

    // Si la clave no existe, devolvemos la clave misma como fallback
    return key;
  }
}
