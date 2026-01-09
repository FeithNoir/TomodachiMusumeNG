import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../core/services/character.service';
import { GameStateService } from '../../core/services/game-state.service';
import { LocalizedText } from '../../core/interfaces/item.interface';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character.component.html',
  styleUrl: './character.component.css'
})
export class CharacterComponent implements OnInit, OnDestroy {
  private characterService = inject(CharacterService);
  private gameStateService = inject(GameStateService);

  public equipped = this.characterService.equipped;
  public expression = this.characterService.expression;
  public playerName = this.gameStateService.playerName;

  private blinkingInterval: any;
  public showReactionDialogue = false;
  public reactionText = '';

  ngOnInit(): void {
    this.startBlinking();
  }

  ngOnDestroy(): void {
    this.stopBlinking();
  }

  private startBlinking(): void {
    // Usamos window.setInterval para evitar confusión con los tipos de Node.js si existen
    this.blinkingInterval = setInterval(() => {
      if (this.expression().eyes === './assets/img/expressions/eyes_1.png') {
        this.characterService.updateExpression('./assets/img/expressions/eyes_2.png', this.expression().mouth);
        setTimeout(() => {
          this.characterService.updateExpression('./assets/img/expressions/eyes_1.png', this.expression().mouth);
        }, 150);
      }
    }, Math.random() * 4000 + 3000);
  }

  private stopBlinking(): void {
    if (this.blinkingInterval) {
      clearInterval(this.blinkingInterval);
    }
  }

  onCharacterClick(): void {
    const reaction = this.characterService.getAffinityReaction();

    if (reaction) {
      this.showReactionDialogue = true;

      // --- CORRECCIÓN AQUÍ ---
      // 1. Definimos el idioma actual tipado correctamente
      const currentLang = this.gameStateService.language() as keyof LocalizedText;

      // 2. Forzamos (cast) a reaction.text para que sea tratado como LocalizedText.
      // Esto habilita la indexación dinámica y elimina el error.
      const textObj = reaction.text as LocalizedText;

      // 3. Asignamos con fallback a inglés por seguridad
      this.reactionText = textObj[currentLang] || textObj['en'];

      // Guardamos estado original
      const originalEyes = this.expression().eyes;
      const originalMouth = this.expression().mouth;

      // Actualizamos expresión
      this.characterService.updateExpression(reaction.eyes, reaction.mouth);

      // Restauramos después de 1.5s
      setTimeout(() => {
        this.showReactionDialogue = false;
        this.characterService.updateExpression(originalEyes, originalMouth);
      }, 1500);
    }
  }
}
