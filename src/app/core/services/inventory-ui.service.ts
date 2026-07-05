import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InventoryUiService {
  readonly equipMode = signal(false);

  openForEquip(): void {
    this.equipMode.set(true);
  }

  reset(): void {
    this.equipMode.set(false);
  }
}
