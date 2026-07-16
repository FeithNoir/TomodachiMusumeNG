import { Component, computed, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { EGG_DEFINITIONS } from '@core/data/egg-database';
import { STAT_KEYS, StatKey } from '@core/interfaces/character-stats.interface';
import { IncubatingEgg, Pet, PetVisual } from '@core/interfaces/pet.interface';
import { LocalizationService } from '@core/services/localization.service';
import { PetService } from '@core/services/pet.service';
import { TemporaryEffectService } from '@core/services/temporary-effect.service';

@Component({
  selector: 'app-companions',
  standalone: true,
  imports: [],
  templateUrl: './companions.component.html',
  styleUrl: './companions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanionsComponent {
  private petService = inject(PetService);
  private tempEffects = inject(TemporaryEffectService);
  private localization = inject(LocalizationService);

  @Output() close = new EventEmitter<void>();

  readonly pets = this.petService.pets;
  readonly incubatingEggs = this.petService.incubatingEggs;
  readonly slotCapacity = this.petService.slotCapacity;
  readonly statKeys = STAT_KEYS;
  readonly getText = this.localization.t.bind(this.localization);

  slotsUsed = computed(() => this.pets().length);

  onClose(): void {
    this.close.emit();
  }

  getStatLabel(key: StatKey): string {
    return this.getText(`stat${key.charAt(0).toUpperCase()}${key.slice(1)}`);
  }

  petTotalStat(pet: Pet, key: StatKey): number {
    const temp = this.tempEffects.getPetTemporaryBonus(pet.id);
    return (pet.baseStats[key] ?? 0) + (pet.bonusStats[key] ?? 0) + (temp[key] ?? 0);
  }

  incubationProgress(entry: IncubatingEgg): number {
    return this.petService.getIncubationProgress(entry);
  }

  eggLabel(entry: IncubatingEgg): string {
    const egg = EGG_DEFINITIONS[entry.eggId];
    return egg ? this.localization.localized(egg.name) : entry.eggId;
  }

  eggVisual(entry: IncubatingEgg): PetVisual | null {
    return EGG_DEFINITIONS[entry.eggId]?.visual ?? null;
  }

  isImageVisual(visual: PetVisual): boolean {
    return this.petService.isImageVisual(visual);
  }
}
