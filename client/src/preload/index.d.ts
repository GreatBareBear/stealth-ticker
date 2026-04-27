import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  type StockPollPhase = 'start' | 'success' | 'error'

  interface StockPollStatus {
    phase: StockPollPhase
    ts: number
    url?: string
    statusCode?: number
    bytes?: number
    parsedSymbols?: number
    error?: string
    consecutiveFailures?: number
    lastSuccessAt?: number | null
    lastEventAt?: number
  }

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
      getStockPollStatus: () => Promise<StockPollStatus | null>
      onStockPollStatus: (callback: (payload: StockPollStatus) => void) => void
      offStockPollStatus: () => void
      onConfigUpdated: (callback: (key: string) => void) => void
      offConfigUpdated: () => void
    }
  }
}
