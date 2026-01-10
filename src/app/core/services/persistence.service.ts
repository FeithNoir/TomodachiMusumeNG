import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PersistenceService {
    public isElectron: boolean = false;

    constructor() {
        this.checkEnvironment();
    }

    private async checkEnvironment() {
        // @ts-ignore
        if (window.electronAPI) {
            this.isElectron = true;
            console.log('Running in Electron environment.');
        } else {
            console.log('Running in Browser environment.');
        }
    }

    async save(key: string, data: any): Promise<boolean> {
        if (this.isElectron) {
            // @ts-ignore
            const result = await window.electronAPI.saveGame(data);
            return result.success;
        } else {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('LocalStorage save error:', e);
                return false;
            }
        }
    }

    async load(key: string): Promise<any | null> {
        if (this.isElectron) {
            // @ts-ignore
            const result = await window.electronAPI.loadGame();
            return result.success ? result.data : null;
        } else {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error('LocalStorage load error:', e);
                return null;
            }
        }
    }

    clear(key: string): void {
        if (!this.isElectron) {
            localStorage.removeItem(key);
        }
        // Note: In Electron, we might want to implement a 'clear' in main.js if needed,
        // but for now we just overwrite with initial state.
    }

    quit(): void {
        if (this.isElectron) {
            // @ts-ignore
            window.electronAPI.quitApp();
        }
    }
}
