import { createContext, useContext } from 'react'

export const StoreContext = createContext<any>(null)
export const useStore = () => useContext(StoreContext) || window.api.store