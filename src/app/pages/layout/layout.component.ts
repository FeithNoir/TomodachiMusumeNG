import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { CraftingComponent } from '../../shared/crafting/crafting.component';
import { DialogueComponent } from '../../shared/dialogue/dialogue.component';
import { InfoComponent } from '../../shared/info/info.component';
import { InventoryComponent } from '../../shared/inventory/inventory.component';
import { MenuComponent } from '../../shared/menu/menu.component';
import { SidebarComponent, SidebarAction } from '../../shared/sidebar/sidebar.component';
import { ShopComponent } from '../shop/shop.component';
import { MissionComponent } from '../mission/mission.component'; // 1. Importar

import { GameStateService } from '../../core/services/game-state.service';
import { CharacterService } from '../../core/services/character.service';
// Importamos LocalizedText para los castings de idioma
import { Dialogue, DialogueOption, LocalizedText } from '../../core/interfaces/dialogue.interface';
import { dialogues } from '../../core/data/dialogue-database';

type ActiveModal = SidebarAction | 'options' | null;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, CraftingComponent, DialogueComponent,
    InfoComponent, InventoryComponent, MenuComponent, SidebarComponent,
    ShopComponent, MissionComponent // 2. Añadir a imports
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  private gameStateService = inject(GameStateService);
  private characterService = inject(CharacterService);

  private activeModal = signal<ActiveModal>(null);
  public currentDialogue = signal<Dialogue | null>(null);

  // Señales computadas
  isDialogueVisible = computed(() => this.activeModal() === 'talk');
  isInventoryVisible = computed(() => this.activeModal() === 'equip');
  isCraftingVisible = computed(() => this.activeModal() === 'craft');
  isMissionVisible = computed(() => this.activeModal() === 'mission');
  isMarketVisible = computed(() => this.activeModal() === 'market');
  isInteractVisible = computed(() => this.activeModal() === 'interact');
  isOptionsVisible = computed(() => this.activeModal() === 'options');

  // --- HELPERS PARA LA VISTA (HTML) ---

  // Helper para obtener el texto principal del diálogo ya traducido y con el nombre
  get currentDialogueText(): string {
    const dialogue = this.currentDialogue();
    if (!dialogue) return '';

    const lang = this.gameStateService.language() as keyof LocalizedText;
    const playerName = this.gameStateService.playerName();

    // 1. Ejecutamos la función pasando el nombre
    // 2. Accedemos al idioma
    return dialogue.text(playerName)[lang] || dialogue.text(playerName)['en'];
  }

  // Helper para obtener el texto de una opción
  getOptionText(option: DialogueOption): string {
    const lang = this.gameStateService.language() as keyof LocalizedText;
    return option.text[lang] || option.text['en'];
  }
  // ------------------------------------

  handleSidebarAction(action: SidebarAction): void {
    if (action === 'talk') {
      this.startRandomDialogue();
    } else {
      this.activeModal.set(action);
    }
    console.log(`Action received: ${action}`);
  }

  handleMenuAction(action: string): void {
    if (action === 'options') {
      this.activeModal.set('options');
    }
    console.log(`Menu action: ${action}`);
  }

  closeActiveModal(): void {
    this.activeModal.set(null);
    this.currentDialogue.set(null);
  }

  private startRandomDialogue(): void {
    // CORRECCIÓN 1: Convertimos el objeto de diálogos a un array para usar .length
    const dialogueList = Object.values(dialogues);

    if (dialogueList.length === 0) return;

    // Elegimos uno al azar
    const randomIndex = Math.floor(Math.random() * dialogueList.length);
    const selectedDialogue = dialogueList[randomIndex];

    // CORRECCIÓN 2: No intentamos modificar el objeto ni "procesar" el texto aquí.
    // Pasamos el objeto Dialogue puro. La transformación se hace en los getters (helpers) de arriba.
    this.currentDialogue.set(selectedDialogue);

    this.activeModal.set('talk');
  }

  handleDialogueOption(option: DialogueOption): void {
    if (option.affinityChange) {
      this.gameStateService.updateAffinity(option.affinityChange);
      console.log(`Affinity changed by: ${option.affinityChange}`);
    }
    this.closeActiveModal();
  }
}
