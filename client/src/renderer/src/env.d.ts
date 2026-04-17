/// <reference types="vite/client" />

interface Window {
  api: {
    store: {
      get: <T = any>(key: string) => Promise<T>
      set: (key: string, value: any) => Promise<void>
      delete: (key: string) => Promise<void>
    }
    tempUnlock: (unlock: boolean) => void
  }
}
