import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';
import { InventoryService } from '../../core/services/inventory.service';
import { MissionService } from '../../core/services/mission.service';
import { ShopService } from '../../core/services/shop.service';
import { CraftingService } from '../../core/services/crafting.service';
import { LocalizedText } from '../../core/interfaces/item.interface'; // Import LocalizedText

// This would ideally come from a dedicated i18n service
// 1. Tipamos explícitamente el objeto de textos
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
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private gameStateService = inject(GameStateService);
  private inventoryService = inject(InventoryService);
  private missionService = inject(MissionService);
  private shopService = inject(ShopService);
  private craftingService = inject(CraftingService);

  protected language = this.gameStateService.language;

  // Definimos los botones como datos
  public menuActions = [
    {
      id: 'talkButton',
      label: 'talk',
      action: () => this.onTalkClick(),
      icon: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
    },
    {
      id: 'equipButton',
      label: 'equip',
      action: () => this.onEquipClick(),
      icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
    },
    {
      id: 'interactButton',
      label: 'interact',
      action: () => this.onInteractClick(),
      icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
    },
    {
      id: 'missionButton',
      label: 'mission',
      action: () => this.onMissionClick(),
      icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      id: 'marketButton',
      label: 'market',
      action: () => this.onMarketClick(),
      icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.82-6.781a1.125 1.125 0 00-1.087-1.418H4.871c-.51 0-.962.343-1.087.835L2.25 3z',
    },
    {
      id: 'craftingButton',
      label: 'craft',
      action: () => this.onCraftClick(),
      icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3.75h16.5M12 18.75h3.75a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0015.75 4.5h-3.75a2.25 2.25 0 00-2.25 2.25v11.25',
    },
  ];

  // 2. Corregimos el método getText
  getText(key: string): string {
    const currentLang = this.language() as keyof LocalizedText;

    // Verificamos si la key existe en nuestro diccionario
    if (UI_TEXTS[key]) {
      // Accedemos de forma segura. Si no existe el idioma actual, usa inglés.
      return UI_TEXTS[key][currentLang] || UI_TEXTS[key]['en'];
    }

    return key;
  }

  onTalkClick(): void {
    console.log('Talk button clicked');
    // TODO: Implement logic to open dialogue modal
  }

  onEquipClick(): void {
    console.log('Equip button clicked');
    // TODO: Implement logic to open inventory modal
  }

  onInteractClick(): void {
    console.log('Interact button clicked');
    // TODO: Implement logic to open interact modal
  }

  onMissionClick(): void {
    console.log('Mission button clicked');
    const missionStarted = this.missionService.startMission();
    if (missionStarted) {
      // TODO: Show mission progress modal
      console.log('Mission started!');
    } else {
      // TODO: Show notification: Not enough energy
      console.log('Not enough energy for mission.');
    }
  }

  onMarketClick(): void {
    console.log('Market button clicked');
    // TODO: Implement logic to open market modal
  }

  onCraftClick(): void {
    console.log('Craft button clicked');
    // TODO: Implement logic to open crafting modal
  }
}
