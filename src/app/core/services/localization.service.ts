import { Injectable, inject } from '@angular/core';
import { UI_STRINGS } from '../constants/ui-strings';
import { LocalizedText } from '../interfaces/localized-text.interface';
import { Dialogue, DialogueOption } from '../interfaces/dialogue.interface';
import { resolveLocalizedText, resolveUiString } from '../utils/localization.util';
import { GameStateService } from './game-state.service';
import { ItemCatalogService } from './item-catalog.service';

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
