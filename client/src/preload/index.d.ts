import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      store: {
        get: <T>(key: string) => Promise<T>
        set: (key: string, value: any) => Promise<void>
        delete: (key: string) => Promise<void>
      }
      closeSettingsWindow: () => void
      tempUnlock: (unlock: boolean) => void
      onStockDataUpdated: (callback: (data: Record<string, any>) => void) => void
      offStockDataUpdated: () => void
      onStockPollStatus: (callback: (payload: Record<string, any>) => void) => void
      offStockPollStatus: () => void
      onConfigUpdated: (callback: (key: string) => void) => void
      offConfigUpdated: () => void
    }
  }
}
