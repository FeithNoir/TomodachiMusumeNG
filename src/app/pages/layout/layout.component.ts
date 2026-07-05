import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { CraftingComponent } from '@shared/crafting/crafting.component';
import { DialogueComponent } from '@shared/dialogue/dialogue.component';
import { EquipmentComponent } from '@shared/equipment/equipment.component';
import { InfoComponent } from '@shared/info/info.component';
import { InventoryComponent } from '@shared/inventory/inventory.component';
import { MenuComponent } from '@shared/menu/menu.component';
import { NotificationComponent } from '@shared/notification/notification.component';
import { SidebarComponent, SidebarAction } from '@shared/sidebar/sidebar.component';
import { OptionsComponent } from '@shared/options/options.component';
import { ShopComponent } from '@pages/shop/shop.component';
import { MissionComponent } from '@pages/mission/mission.component';
import { InteractComponent } from '@pages/interact/interact.component';
import { GalleryComponent } from '@shared/gallery/gallery.component';
import { TutorialsComponent } from '@shared/tutorials/tutorials.component';
import { CompanionsComponent } from '@shared/companions/companions.component';
import { MissionRewardModalComponent } from '@shared/mission-reward-modal/mission-reward-modal.component';
import { TutorialComponent } from '@pages/tutorial/tutorial.component';

import { GameStateService } from '@core/services/game-state.service';
import { CharacterService } from '@core/services/character.service';
import { MissionService } from '@core/services/mission.service';
import { Dialogue, DialogueOption } from '@core/interfaces/dialogue.interface';
import { dialogues } from '@core/data/dialogue-database';

type ActiveModal = SidebarAction | 'options' | 'gallery' | 'tutorials' | null;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CraftingComponent,
    DialogueComponent,
    EquipmentComponent,
    InfoComponent,
    InventoryComponent,
    MenuComponent,
    NotificationComponent,
    SidebarComponent,
    ShopComponent,
    MissionComponent,
    InteractComponent,
    GalleryComponent,
    TutorialsComponent,
    CompanionsComponent,
    MissionRewardModalComponent,
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
  private missionService = inject(MissionService);

  constructor() {
    this.gameStateService.syncCharacterState(this.characterService);
  }

  private activeModal = signal<ActiveModal>(null);
  public currentDialogue = signal<Dialogue | null>(null);

  isDialogueVisible = computed(() => this.activeModal() === 'talk');
  isEquipmentVisible = computed(() => this.activeModal() === 'equipment');
  isInventoryVisible = computed(() => this.activeModal() === 'inventory');
  isCraftingVisible = computed(() => this.activeModal() === 'craft');
  isMissionVisible = computed(() => this.activeModal() === 'mission');
  isMarketVisible = computed(() => this.activeModal() === 'market');
  isInteractVisible = computed(() => this.activeModal() === 'interact');
  isOptionsVisible = computed(() => this.activeModal() === 'options');
  isGalleryVisible = computed(() => this.activeModal() === 'gallery');
  isTutorialsVisible = computed(() => this.activeModal() === 'tutorials');
  isCompanionsVisible = computed(() => this.activeModal() === 'companions');

  public hasCompletedIntro = this.gameStateService.hasCompletedIntro;

  disabledSidebarActions = computed((): SidebarAction[] => {
    if (this.missionService.isCharacterAway()) {
      return ['talk', 'equipment', 'interact'];
    }
    return [];
  });

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
      return;
    }
    if (action === 'gallery') {
      this.activeModal.set('gallery');
      return;
    }
    if (action === 'tutorials') {
      this.activeModal.set('tutorials');
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
