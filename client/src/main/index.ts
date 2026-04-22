import { app, shell, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import { AlertService } from './alertService'

const StoreClass = typeof Store === 'function' ? Store : (Store as any).default
const store = new StoreClass()

let tray: Tray | null = null
let settingsWindow: BrowserWindow | null = null
let mainWindow: BrowserWindow | null = null
let aboutWindow: BrowserWindow | null = null
let isPanelLocked = store.get('panelLocked') === true
let alertService: AlertService | null = null
let isQuitting = false

app.on('before-quit', () => {
  isQuitting = true
})

function openAbout(): void {
  if (aboutWindow) {
    if (aboutWindow.isMinimized()) aboutWindow.restore()
    aboutWindow.focus()
    return
  }

  aboutWindow = new BrowserWindow({
    width: 320,
    height: 480,
    resizable: false,
    maximizable: false,
    minimizable: false,
    show: false,
    title: '关于',
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  aboutWindow.on('ready-to-show', () => {
    aboutWindow?.show()
  })

  aboutWindow.on('closed', () => {
    aboutWindow = null
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    aboutWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/about')
  } else {
    aboutWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'about' })
  }
}

function openSettings(): void {
  if (settingsWindow) {
    if (settingsWindow.isMinimized()) settingsWindow.restore()
    settingsWindow.show()
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 650,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: false,
    show: false,
    title: '设置',
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  settingsWindow.setMenu(null)
  settingsWindow.setMenuBarVisibility(false)

  settingsWindow.on('ready-to-show', () => {
    settingsWindow?.show()
    settingsWindow?.webContents.send('settings-shown')
  })

  settingsWindow.on('show', () => {
    settingsWindow?.webContents.send('settings-shown')
  })

  settingsWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      settingsWindow?.webContents.send('settings-closed')
      settingsWindow?.hide()
    }
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/settings')
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'settings' })
  }
}

function setPanelLocked(locked: boolean): void {
  isPanelLocked = locked
  store.set('panelLocked', locked)
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(locked, { forward: true })
    mainWindow.webContents.send('window-locked', locked)
  }
  if (tray) {
    tray.setContextMenu(buildTrayMenu())
  }
}

function buildTrayMenu(): Menu {
  return Menu.buildFromTemplate([
    {
      label: '锁定面板',
      type: 'checkbox',
      checked: isPanelLocked,
      click: (menuItem) => {
        setPanelLocked(menuItem.checked)
      }
    },
    { type: 'separator' },
    { label: '设置', click: openSettings },
    {
      label: '关于',
      click: openAbout
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[])
}

function createTray(): void {
  tray = new Tray(icon)
  tray.setToolTip('stealth-ticker')
  tray.setContextMenu(buildTrayMenu())
  if (alertService) alertService.setTray(tray)
}

function applySettings(settings: any): void {
  if (!settings) return

  if (mainWindow) {
    mainWindow.setAlwaysOnTop(settings.alwaysOnTop !== false)
    mainWindow.setSkipTaskbar(settings.ghostMode !== false)
  }

  if (settings.showTrayIcon !== false) {
    if (!tray) {
      createTray()
    }
  } else {
    if (tray) {
      tray.destroy()
      tray = null
    }
  }

  registerBossKey(settings)
}

function createWindow(): void {
  const settings: any = store.get('settings') || {}

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 100,
    resizable: false,
    show: false,
    title: 'stealth-ticker',
    frame: false,
    transparent: true,
    alwaysOnTop: settings.alwaysOnTop !== false,
    hasShadow: false,
    autoHideMenuBar: true,
    skipTaskbar: settings.ghostMode !== false,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerBossKey(settings: any) {
  globalShortcut.unregisterAll()
  if (settings && settings.bossKeyEnabled && settings.bossKeyCombo) {
    try {
      globalShortcut.register(settings.bossKeyCombo, () => {
        if (settings.bossKeyAction === 'exit') {
          app.quit()
        } else {
          // Hide action
          if (mainWindow) {
            if (mainWindow.isVisible()) {
              mainWindow.hide()
              mainWindow.setSkipTaskbar(true)
              if (process.platform === 'darwin' && app.dock) {
                app.dock.hide()
              }
              mainWindow.webContents.send('window-hidden')
            } else {
              mainWindow.show()
              mainWindow.setSkipTaskbar(settings.ghostMode !== false)
              if (process.platform === 'darwin' && app.dock) {
                if (settings.ghostMode === false) {
                  app.dock.show()
                }
              }
              mainWindow.webContents.send('window-shown')
            }
          }
          // Note: according to specs, setting window should remain visible during hide action
        }
      })
    } catch (e) {
      console.error('Failed to register boss key', e)
    }
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  const ALLOWED_STORE_KEYS = [
    'settings',
    'stocks',
    'alerts',
    'alertsGlobalPaused',
    'alertsTempPausedUntil',
    'alertsDndEnabled',
    'alertsDndStart',
    'alertsDndEnd',
    'alertsDndAllowedMethods',
    'chartSettings',
    'otherSettings',
    'dashboard',
    'panelLocked'
  ]

  function isValidKey(key: string): boolean {
    return ALLOWED_STORE_KEYS.includes(key)
  }

  function isValidValue(value: any): boolean {
    try {
      const serialized = JSON.stringify(value)
      // Max 5MB length (approx 5 * 1024 * 1024 characters)
      return serialized !== undefined && serialized.length <= 5 * 1024 * 1024
    } catch {
      return false
    }
  }

  // electron-store IPC handlers
  ipcMain.on('close-settings-window', () => {
    settingsWindow?.hide()
  })

  ipcMain.handle('store:get', (_event, key) => {
    if (!isValidKey(key)) return null
    return store.get(key)
  })

  ipcMain.handle('store:set', (_event, key, value) => {
    if (!isValidKey(key)) {
      throw new Error(`Store key "${key}" is not allowed.`)
    }
    if (!isValidValue(value)) {
      throw new Error(`Store value for key "${key}" is invalid or too large.`)
    }
    store.set(key, value)
    if (key === 'settings') {
      applySettings(value)
    }
    if (alertService) {
      alertService.reloadConfig()
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('config-updated', key)
    }
  })

  ipcMain.handle('store:delete', (_event, key) => {
    if (!isValidKey(key)) return
    store.delete(key)
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('config-updated', key)
    }
  })

  ipcMain.on('show-context-menu', (event) => {
    const settings: any = store.get('settings') || {}
    if (settings.enableContextMenu === false) return

    const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
      {
        label: '锁定面板',
        type: 'checkbox',
        checked: isPanelLocked,
        click: (menuItem) => {
          setPanelLocked(menuItem.checked)
        }
      },
      { type: 'separator' },
      { label: '设置', click: openSettings },
      {
        label: '关于',
        click: openAbout
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      menu.popup({ window })
    }
  })

  ipcMain.on('resize-window', (event, { width, height }) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.setSize(Math.ceil(width), Math.ceil(height))
  })

  ipcMain.on('drag-window', (event, { deltaX, deltaY }) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      const [x, y] = win.getPosition()
      win.setPosition(x + deltaX, y + deltaY)
    }
  })

  ipcMain.on('temp-unlock', (_event, unlock: boolean) => {
    if (!isPanelLocked) return
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(!unlock, { forward: true })
    }
  })

  let blinkInterval: NodeJS.Timeout | null = null

  ipcMain.on('trigger-alert', (_event, { method, message: _message }: { method: string; message?: string }) => {
    if (method === 'sound') {
      shell.beep()
    } else if (method === 'blink') {
      if (blinkInterval) {
        clearInterval(blinkInterval)
      }
      if (!tray) return
      
      let isHidden = false
      let count = 0
      const emptyImage = nativeImage.createEmpty()
      
      blinkInterval = setInterval(() => {
        if (!tray) {
          if (blinkInterval) clearInterval(blinkInterval)
          return
        }
        
        isHidden = !isHidden
        tray.setImage(isHidden ? emptyImage : icon)
        count++

        if (count >= 20) {
          clearInterval(blinkInterval!)
          blinkInterval = null
          if (tray) tray.setImage(icon)
        }
      }, 500)
    }
  })

  // Handle CORS for tencent API
  const { session } = require('electron')
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const url = details.url
    if (url.startsWith('https://qt.gtimg.cn') || url.startsWith('https://smartbox.gtimg.cn')) {
      const responseHeaders = Object.assign({}, details.responseHeaders)
      responseHeaders['Access-Control-Allow-Origin'] = ['*']
      callback({ cancel: false, responseHeaders })
    } else {
      callback({ cancel: false })
    }
  })

  const initialSettings = store.get('settings') || {}
  
  const existingStocks = store.get('stocks')
  const shouldInitStocks =
    !Array.isArray(existingStocks) || (Array.isArray(existingStocks) && existingStocks.length === 0)

  if (shouldInitStocks) {
    store.set('stocks', [
      { key: '1', symbol: 'sh000001', name: '上证指数', isIndex: true, visible: true },
      { key: '2', symbol: 'sz399001', name: '深证成指', isIndex: true, visible: true },
      { key: '3', symbol: 'sz000001', name: '平安银行', isIndex: false, visible: true },
      { key: '4', symbol: 'sh600519', name: '贵州茅台', isIndex: false, visible: false }
    ])
  }

  if ((initialSettings as any).showTrayIcon !== false) {
    createTray()
  }
  createWindow()
  registerBossKey(initialSettings)
  setPanelLocked(isPanelLocked)

  alertService = new AlertService(store, mainWindow, tray)
  alertService.start()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
