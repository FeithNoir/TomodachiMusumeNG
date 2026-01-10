import { Component, OnInit, OnDestroy, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MissionService, MissionReward } from '../../core/services/mission.service';
import { GameStateService } from '../../core/services/game-state.service';
import { masterItemList } from '../../core/data/item-database'; // Importante para nombres de items
import { LocalizedText } from '../../core/interfaces/item.interface';

const UI_TEXTS: Record<string, LocalizedText> = {
  sending: { es: 'Enviando a Misión...', en: 'Sending on Mission...' },
  complete: { es: '¡Misión Completada!', en: 'Mission Complete!' },
  noEnergy: { es: 'Sin Energía', en: 'No Energy' },
  noEnergyMsg: { es: 'No tienes suficiente energía para la misión.', en: 'Not enough energy for the mission.' },
  returned: { es: '¡Ha vuelto de la misión!', en: 'She has returned from the mission!' },
  returnedNothing: { es: 'No encontró nada esta vez...', en: 'She did not find anything this time...' },
  gains: { es: 'Ganancias', en: 'Earnings' },
  items: { es: 'Objetos', en: 'Items' },
  close: { es: 'Cerrar', en: 'Close' },
};

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit, OnDestroy {
  private missionService = inject(MissionService);
  private gameStateService = inject(GameStateService);

  @Output() close = new EventEmitter<void>();

  public progress = signal(0);
  public title = signal('');
  public resultText = signal('');
  public isComplete = signal(false);

  private progressInterval: any;
  private language = this.gameStateService.language;

  constructor() {
    this.title.set(this.getText('sending'));
  }

  ngOnInit(): void {
    this.runMissionSequence();
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private runMissionSequence(): void {
    // 1. Verificamos energía usando el nuevo método
    if (!this.missionService.hasEnoughEnergy()) {
      this.title.set(this.getText('noEnergy'));
      this.resultText.set(this.getText('noEnergyMsg'));
      this.isComplete.set(true);
      return;
    }

    // 2. Consumimos la energía INMEDIATAMENTE al iniciar la secuencia
    this.missionService.startMission();

    // 3. Iniciamos la animación
    this.progressInterval = setInterval(() => {
      this.progress.update(p => {
        const newProgress = p + 10;
        if (newProgress >= 100) {
          clearInterval(this.progressInterval);
          this.finishMission();
          return 100;
        }
        return newProgress;
      });
    }, 300);
  }

  private finishMission(): void {
    // 4. Calculamos las recompensas (ya no gastamos energía aquí)
    const result: MissionReward = this.missionService.calculateMissionRewards();

    this.title.set(this.getText('complete'));
    this.resultText.set(this.formatResultText(result));
    this.isComplete.set(true);
  }

  private formatResultText(result: MissionReward): string {
    // Determinamos si hubo éxito basado en si ganó algo
    const success = result.moneyEarned > 0 || result.itemsFound.length > 0;

    let text = success ? this.getText('returned') : this.getText('returnedNothing');
    text += '<br>';

    // Usamos 'moneyEarned' que es como se llama en la interfaz
    if (result.moneyEarned > 0) {
      text += `${this.getText('gains')}: ${result.moneyEarned}<br>`;
    }

    if (result.itemsFound.length > 0) {
      // Mapeamos los IDs a Nombres reales
      const itemNames = result.itemsFound.map(item => {
        const itemData = masterItemList[item.id];
        const name = itemData ? (itemData.name[this.language() as keyof LocalizedText] || itemData.name['en']) : item.id;
        return `${name} (x${item.quantity})`;
      });

      text += `${this.getText('items')}: ${itemNames.join(', ')}`;
    }

    return text;
  }

  public getText(key: string): string {
    const lang = this.language() as keyof LocalizedText;
    const entry = UI_TEXTS[key];
    return entry ? (entry[lang] || entry['en']) : key;
  }

  public onClose(): void {
    this.close.emit();
  }
}
