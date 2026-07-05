import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { CraftingComponent } from '../../shared/crafting/crafting.component';
import { DialogueComponent } from '../../shared/dialogue/dialogue.component';
import { InfoComponent } from '../../shared/info/info.component';
import { InventoryComponent } from '../../shared/inventory/inventory.component';
import { MenuComponent } from '../../shared/menu/menu.component';
import { SidebarComponent, SidebarAction } from '../../shared/sidebar/sidebar.component';
import { OptionsComponent } from '../../shared/options/options.component';
import { ShopComponent } from '../shop/shop.component';
import { MissionComponent } from '../mission/mission.component';
import { TutorialComponent } from '../tutorial/tutorial.component';

import { GameStateService } from '../../core/services/game-state.service';
import { CharacterService } from '../../core/services/character.service';
import { Dialogue, DialogueOption } from '../../core/interfaces/dialogue.interface';
import { dialogues } from '../../core/data/dialogue-database';

type ActiveModal = SidebarAction | 'options' | null;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CraftingComponent,
    DialogueComponent,
    InfoComponent,
    InventoryComponent,
    MenuComponent,
    SidebarComponent,
    ShopComponent,
    MissionComponent,
    TutorialComponent,
    OptionsComponent,
  ],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  private gameStateService = inject(GameStateService);
  private characterService = inject(CharacterService);

  constructor() {
    this.gameStateService.syncCharacterState(this.characterService);
  }

  private activeModal = signal<ActiveModal>(null);
  public currentDialogue = signal<Dialogue | null>(null);

  isDialogueVisible = computed(() => this.activeModal() === 'talk');
  isInventoryVisible = computed(() => this.activeModal() === 'equip');
  isCraftingVisible = computed(() => this.activeModal() === 'craft');
  isMissionVisible = computed(() => this.activeModal() === 'mission');
  isMarketVisible = computed(() => this.activeModal() === 'market');
  isInteractVisible = computed(() => this.activeModal() === 'interact');
  isOptionsVisible = computed(() => this.activeModal() === 'options');

  public hasCompletedIntro = this.gameStateService.hasCompletedIntro;

  handleSidebarAction(action: SidebarAction): void {
    if (action === 'talk') {
      this.startRandomDialogue();
    } else {
      this.activeModal.set(action);
    }
  }

  handleMenuAction(action: string): void {
    if (action === 'options') {
      this.activeModal.set('options');
    }
  }

  closeActiveModal(): void {
    this.activeModal.set(null);
    this.currentDialogue.set(null);
  }

  private startRandomDialogue(): void {
    const dialogueList = Object.values(dialogues);
    if (dialogueList.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * dialogueList.length);
    const selectedDialogue = dialogueList[randomIndex] as Dialogue;
    this.currentDialogue.set(selectedDialogue);
    this.activeModal.set('talk');
  }

  handleDialogueOption(option: DialogueOption): void {
    if (option.affinityChange) {
      this.characterService.updateAffinity(option.affinityChange);
    }
    this.closeActiveModal();
  }
}
