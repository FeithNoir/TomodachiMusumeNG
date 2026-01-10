const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('better-sqlite3');

let mainWindow;
let db;

function initDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'game_data.db');
    db = new Database(dbPath);
    
    // Create table if not exists
    db.prepare(`
        CREATE TABLE IF NOT EXISTS game_state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            data TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        icon: path.join(__dirname, '../public/favicon.ico')
    });

    const startUrl = isDev 
        ? 'http://localhost:4200' 
        : `file://${path.join(__dirname, '../dist/tomodachi-musume-ng/browser/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    initDatabase();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC Listeners for Persistence
ipcMain.handle('save-game', async (event, gameState) => {
    try {
        const stmt = db.prepare('INSERT OR REPLACE INTO game_state (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)');
        stmt.run(JSON.stringify(gameState));
        return { success: true };
    } catch (error) {
        console.error('Database save error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('load-game', async () => {
    try {
        const row = db.prepare('SELECT data FROM game_state WHERE id = 1').get();
        if (row) {
            return { success: true, data: JSON.parse(row.data) };
        }
        return { success: true, data: null };
    } catch (error) {
        console.error('Database load error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('quit-app', () => {
    app.quit();
});

ipcMain.handle('is-electron', () => true);
