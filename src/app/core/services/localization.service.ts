import { Injectable, inject } from '@angular/core';
import { UI_STRINGS } from '@core/constants/ui-strings';
import { LocalizedText } from '@core/interfaces/localized-text.interface';
import { Dialogue, DialogueOption } from '@core/interfaces/dialogue.interface';
import { resolveLocalizedText, resolveUiString } from '@core/utils/localization.util';
import { GameStateService } from '@core/services/game-state.service';
import { ItemCatalogService } from '@core/services/item-catalog.service';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private gameStateService = inject(GameStateService);
  private itemCatalog = inject(ItemCatalogService);

  t(key: string, ...args: any[]): string {
    return resolveUiString(UI_STRINGS, key, this.gameStateService.language(), ...args);
  }

  localized(entry: LocalizedText): string {
    return resolveLocalizedText(entry, this.gameStateService.language());
  }

  dialogueText(dialogue: Dialogue | null): string {
    if (!dialogue) {
      return '';
    }

    const localized = dialogue.text(this.gameStateService.playerName());
    return resolveLocalizedText(localized, this.gameStateService.language());
  }

  dialogueOptionText(option: DialogueOption): string {
    return resolveLocalizedText(option.text, this.gameStateService.language());
  }

  itemName(itemId: string | null | undefined): string {
    return this.itemCatalog.getItemName(itemId);
  }
}
