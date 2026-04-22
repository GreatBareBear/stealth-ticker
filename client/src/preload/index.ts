import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store:delete', key)
  },
  closeSettingsWindow: () => ipcRenderer.send('close-settings-window'),
  tempUnlock: (unlock: boolean) => ipcRenderer.send('temp-unlock', unlock),
  onStockDataUpdated: (callback: (data: Record<string, any>) => void) => {
    ipcRenderer.on('stock-data-updated', (_event, data) => callback(data))
  },
  offStockDataUpdated: () => {
    ipcRenderer.removeAllListeners('stock-data-updated')
  },
  onConfigUpdated: (callback: (key: string) => void) => {
    ipcRenderer.on('config-updated', (_event, key) => callback(key))
  },
  offConfigUpdated: () => {
    ipcRenderer.removeAllListeners('config-updated')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
