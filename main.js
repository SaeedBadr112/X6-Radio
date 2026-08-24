const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { autoUpdater } = require('electron-updater');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;

// ========== تهيئة autoUpdater ==========
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'Saeed-Badr',
  repo: 'X6-Radio',
  private: false
});
autoUpdater.autoDownload = false;
autoUpdater.logger = console;

autoUpdater.on('update-available', (info) => {
  console.log('update-available', info);
  if (mainWindow) mainWindow.webContents.send('update_available', info);
});
autoUpdater.on('update-downloaded', (info) => {
  console.log('update-downloaded', info);
  if (mainWindow) mainWindow.webContents.send('update_downloaded', info);
});
autoUpdater.on('update-not-available', (info) => {
  console.log('update-not-available', info);
  if (mainWindow) mainWindow.webContents.send('update_not_available', info);
});
autoUpdater.on('error', (err) => {
  console.error('AutoUpdater error:', err);
  if (mainWindow) mainWindow.webContents.send('update_error', err);
});

// ========== إنشاء النافذة الرئيسية ==========
// ========== إنشاء النافذة الرئيسية ==========
function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: false,
    frame: false,               // إخفاء شريط العنوان الأصلي
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'src', 'assets', 'X6 Radio.ico')
  });

  // إزالة شريط القوائم تماماً
  mainWindow.setMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
mainWindow.setMenuBarVisibility(true);

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.setMenuBarVisibility(false);

  // ========== التحكم في شريط العنوان المخصص عبر IPC ==========
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.on('window-is-maximized', (event) => {
    if (mainWindow) {
      event.returnValue = mainWindow.isMaximized();
    } else {
      event.returnValue = false;
    }
  });

  // ========== تسجيل الاختصارات العالمية ==========
  globalShortcut.register('CommandOrControl+Shift+Numpad1', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+shift+numpad1', 20);
  });
  globalShortcut.register('CommandOrControl+Shift+Numpad2', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+shift+numpad2', 40);
  });
  globalShortcut.register('CommandOrControl+Shift+Numpad3', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+shift+numpad3', 60);
  });
  globalShortcut.register('CommandOrControl+Shift+Numpad4', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+shift+numpad4', 80);
  });

  globalShortcut.register('CommandOrControl+Numpad1', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+numpad1');
  });
  globalShortcut.register('CommandOrControl+Numpad2', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+numpad2');
  });
  globalShortcut.register('CommandOrControl+Numpad3', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+numpad3');
  });
  globalShortcut.register('CommandOrControl+Numpad4', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+numpad4');
  });
  globalShortcut.register('CommandOrControl+Numpad5', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+numpad5');
  });

  globalShortcut.register('CommandOrControl+O', () => {
    mainWindow.webContents.send('shortcut-triggered', 'ctrl+o');
  });

  // ========== اختصار لفتح أدوات المطور (Ctrl+Shift+Alt+E) ==========
  globalShortcut.register('CommandOrControl+Shift+Alt+E', () => {
    if (mainWindow) {
      mainWindow.webContents.toggleDevTools();
    }
  });
}
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// ========== دوال إدارة اللغة ==========
ipcMain.handle('get-config-language', () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    if (require('fs').existsSync(configPath)) {
      const data = require('fs').readFileSync(configPath, 'utf8');
      const config = JSON.parse(data);
      return config.language || 'ar';
    }
  } catch (err) {
    console.error('Error reading config.json:', err);
  }
  return null;
});

ipcMain.handle('save-config-language', async (event, lang) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    await fs.writeFile(configPath, JSON.stringify({ language: lang }, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving config.json:', err);
    return false;
  }
});

ipcMain.handle('reset-config', () => {
    const configPath = path.join(app.getPath('userData'), 'config.json');
 console.log('🔧 reset-config called, path:', configPath);
    try {
        if (require('fs').existsSync(configPath)) {
            require('fs').unlinkSync(configPath);
            console.log('✅ config.json deleted');
        }
        return true;
    } catch (err) {
        console.error('Error resetting config:', err);
        return false;
    }
});

// ========== دوال التحكم الأساسية ==========
ipcMain.on('set-always-on-top', (event, flag) => {
  if (mainWindow) mainWindow.setAlwaysOnTop(flag);
});
ipcMain.on('close-app', () => {
  app.quit();
});
ipcMain.handle('set-menu-bar-visibility', (event, visible) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setMenuBarVisibility(visible);
    }
});
ipcMain.on('set-window-size', (event, width, height) => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setSize(width, height);
      }
    }, 50);
  }
});

// ========== دوال دعم الوضع المصغر ==========
ipcMain.handle('get-current-window-size', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const [width, height] = mainWindow.getSize();
    return { width, height };
  }
  return { width: 950, height: 700 };
});
ipcMain.handle('is-full-screen', () => mainWindow ? mainWindow.isFullScreen() : false);
ipcMain.handle('set-full-screen', (event, flag) => {
  if (mainWindow) mainWindow.setFullScreen(flag);
});
ipcMain.handle('is-maximized', () => mainWindow ? mainWindow.isMaximized() : false);
ipcMain.handle('unmaximize', () => {
  if (mainWindow && mainWindow.isMaximized()) mainWindow.unmaximize();
});
ipcMain.handle('get-always-on-top', () => mainWindow ? mainWindow.isAlwaysOnTop() : false);

// ========== دوال الحصول على وتعيين موضع النافذة ==========
ipcMain.handle('get-window-position', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const [x, y] = mainWindow.getPosition();
    return { x, y };
  }
  return { x: 0, y: 0 };
});
ipcMain.handle('set-window-position', (event, x, y) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setPosition(x, y);
  }
});

// ========== دالة الحصول على مسار مجلد الأصول ==========
ipcMain.handle('get-assets-dir', () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'assets');
  } else {
    return path.join(__dirname, 'src', 'assets');
  }
});

// ========== دوال أيقونات المستخدم ==========
ipcMain.handle('get-user-data-path', () => app.getPath('userData'));
ipcMain.handle('file-exists', async (event, filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
});
ipcMain.handle('save-file', async (event, filePath, data) => {
  try {
    await fs.writeFile(filePath, data);
    return true;
  } catch (err) {
    console.error('Error saving file:', err);
    return false;
  }
});
ipcMain.handle('mkdir', async (event, dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (err) {
    console.error('Error creating directory:', err);
    return false;
  }
});

// ========== دوال التحديثات ==========
ipcMain.handle('check-for-updates', () => {
  if (app.isPackaged) {
    try {
      autoUpdater.checkForUpdates();
    } catch (err) {
      console.error('Error checking for updates:', err);
      if (mainWindow) mainWindow.webContents.send('update_error', err);
    }
  } else {
    console.log('Update check skipped in development mode');
    if (mainWindow) mainWindow.webContents.send('update_not_available', null);
  }
});
ipcMain.handle('is-packaged', () => app.isPackaged);
ipcMain.on('quit-and-install', () => {
  autoUpdater.quitAndInstall();
});

// ========== 🎨 تغيير لون شريط العنوان ==========
ipcMain.on('set-title-bar-color', (event, color, symbolColor) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    try {
      mainWindow.setTitleBarOverlay({
        color: color || '#0a192f',
        symbolColor: symbolColor || '#ffffff'
      });
      console.log('✅ Title bar color set to:', color);
    } catch (err) {
      console.warn('setTitleBarOverlay error:', err);
    }
  }
});

ipcMain.on('toggle-dev-tools', () => {
  if (mainWindow) {
    mainWindow.webContents.toggleDevTools();
  }
});

// ========== بدء التطبيق ==========
app.whenReady().then(() => {
  createWindow();
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});