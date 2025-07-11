const { app, BrowserWindow } = require('electron');

// Разрешаем авто-воспроизведение видео без клика пользователя
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Подключаемся к Vite dev server (порт 5173)
  win.loadURL('http://localhost:5173/');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
