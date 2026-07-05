import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  readonly isElectron = signal(this.detectElectron());

  hasSavedData(key: string): boolean {
    if (this.isElectron()) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }

  save(key: string, data: unknown): void {
    if (this.isElectron()) {
      void this.saveToElectron(data);
      return;
    }

    this.saveToLocalStorage(key, data);
  }

  load(key: string): unknown | null {
    if (this.isElectron()) {
      return null;
    }

    return this.loadFromLocalStorage(key);
  }

  loadFromElectron(): Promise<unknown | null> {
    if (!this.isElectron()) {
      return Promise.resolve(null);
    }

    return window.electronAPI!.loadGame().then(result => (result.success ? result.data ?? null : null));
  }

  clear(key: string): void {
    if (!this.isElectron()) {
      localStorage.removeItem(key);
    }
  }

  quit(): void {
    if (this.isElectron()) {
      window.electronAPI!.quitApp();
    }
  }

  private detectElectron(): boolean {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }

  private saveToLocalStorage(key: string, data: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('LocalStorage save error:', error);
      return false;
    }
  }

  private loadFromLocalStorage(key: string): unknown | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('LocalStorage load error:', error);
      return null;
    }
  }

  private saveToElectron(data: unknown): Promise<boolean> {
    return window.electronAPI!.saveGame(data).then(result => result.success);
  }
}

declare global {
  interface Window {
    electronAPI?: {
      saveGame: (data: unknown) => Promise<{ success: boolean }>;
      loadGame: () => Promise<{ success: boolean; data?: unknown }>;
      quitApp: () => void;
    };
  }
}
