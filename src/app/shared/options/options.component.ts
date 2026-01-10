import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';
import { LocalizedText } from '../../core/interfaces/item.interface';

const UI_TEXTS: Record<string, LocalizedText> = {
    optionsTitle: { es: 'Opciones', en: 'Options' },
    languageLabel: { es: 'Idioma', en: 'Language' },
    closeBtn: { es: 'Cerrar', en: 'Close' },
    english: { es: 'Inglés', en: 'English' },
    spanish: { es: 'Español', en: 'Spanish' },
};

@Component({
    selector: 'app-options',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.css']
})
export class OptionsComponent {
    private gameStateService = inject(GameStateService);

    @Output() close = new EventEmitter<void>();

    public currentLang = this.gameStateService.language;

    setLanguage(lang: string): void {
        this.gameStateService.setLanguage(lang);
        this.gameStateService.saveGame();
    }

    getText(key: string): string {
        const lang = this.currentLang() as keyof LocalizedText;
        return UI_TEXTS[key]?.[lang] || UI_TEXTS[key]?.['en'] || key;
    }

    onClose(): void {
        this.close.emit();
    }
}
