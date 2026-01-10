const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveGame: (gameState) => ipcRenderer.invoke('save-game', gameState),
    loadGame: () => ipcRenderer.invoke('load-game'),
    isElectron: () => ipcRenderer.invoke('is-electron'),
    quitApp: () => ipcRenderer.invoke('quit-app')
});
