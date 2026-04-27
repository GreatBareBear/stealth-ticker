import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'

interface Stock {
  key: string
  symbol: string
  name: string
  isIndex: boolean
  visible: boolean
}

interface Settings {
  theme: boolean
  colorTheme: 'red-green' | 'green-red'
  opacity: number
  showChangePercent: boolean
  showHighLow: boolean
  fontSize: 'small' | 'medium' | 'large'
  lineHeight: number
  refreshRate: number
  symbolFormat?: 'full' | 'last3' | 'last2' | 'none'
  nameFormat?: 'full' | 'first2' | 'first1' | 'last2' | 'last1' | 'none' | 'force4'
  priceFormat?: 'price' | 'none' | 'priceAndChange'
  changeFormat?: 'red-green' | 'black' | 'none' | 'custom'
  bgColor?: string
  customColor?: string
  enableContextMenu?: boolean
}

interface StockDataOk {
  symbol: string
  name: string
  price: string
  changeAmt: string
  changePct: string
  high: string
  low: string
}

interface StockDataError {
  symbol: string
  name?: string
  error: string
}

type StockData = StockDataOk | StockDataError

const DEFAULT_SETTINGS: Settings = {
  theme: true,
  colorTheme: 'red-green',
  opacity: 80,
  showChangePercent: true,
  showHighLow: false,
  fontSize: 'medium',
  lineHeight: 1.5,
  refreshRate: 3,
  enableContextMenu: true
}

function normalizeOpacity(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 80
  return Math.min(100, Math.max(1, num))
}

function Monitor(): React.JSX.Element {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [stockData, setStockData] = useState<Record<string, StockData>>({})
  const [pollStatus, setPollStatus] = useState<StockPollStatus | null>(null)
  const [nowTick, setNowTick] = useState(() => Date.now())
  const [copyTip, setCopyTip] = useState<string>('')
  const [mountedAt] = useState(() => Date.now())
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const dragPosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleLock = (_event: unknown, locked: boolean): void => {
      setIsLocked(locked)
      if (locked) {
        setIsDragging(false)
      }
    }

    window?.electron?.ipcRenderer?.on('window-locked', handleLock)

    return () => {
      window?.electron?.ipcRenderer?.removeListener('window-locked', handleLock)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (isLocked) return
    if (e.button === 0) {
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)
      dragPosRef.current = { x: e.screenX, y: e.screenY }
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (isLocked) return
    if (isDragging) {
      const deltaX = e.screenX - dragPosRef.current.x
      const deltaY = e.screenY - dragPosRef.current.y
      dragPosRef.current = { x: e.screenX, y: e.screenY }
      window?.electron?.ipcRenderer?.send('drag-window', { deltaX, deltaY })
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (isLocked) return
    if (e.button === 0) {
      e.currentTarget.releasePointerCapture(e.pointerId)
      setIsDragging(false)
    }
  }

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement
        window?.electron?.ipcRenderer?.send('resize-window', {
          width: target.offsetWidth,
          height: target.offsetHeight
        })
      }
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  React.useEffect(() => {
    let isHovering = false
    let isTempUnlocked = false

    const checkUnlock = (shouldUnlock: boolean): void => {
      const active = isHovering && shouldUnlock
      if (active !== isTempUnlocked) {
        isTempUnlocked = active
        window?.api?.tempUnlock(active)
      }
    }

    const handleMouseMove = (e: MouseEvent): void => {
      isHovering = true
      checkUnlock(e.altKey)
    }

    const handleMouseLeave = (): void => {
      isHovering = false
      checkUnlock(false)
    }

    const handleKeyUp = (e: KeyboardEvent): void => {
      if (e.key === 'Alt') {
        checkUnlock(false)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('keyup', handleKeyUp)
      if (isTempUnlocked) {
        window?.api?.tempUnlock(false)
      }
    }
  }, [])

  const handleContextMenu = (e: React.MouseEvent): void => {
    e.preventDefault()
    if (isLocked) return
    if (settings.enableContextMenu === false) return
    window?.electron?.ipcRenderer?.send('show-context-menu')
  }

  const fallbackStore = {
    get: async (key: string): Promise<unknown> => {
      try {
        const item = localStorage.getItem(`store_${key}`)
        return item ? JSON.parse(item) : null
      } catch {
        return null
      }
    }
  }

  const loadConfigAndData = React.useCallback(async (): Promise<void> => {
    try {
      const getStore = (key: string) => window?.api?.store?.get?.(key) ?? fallbackStore.get(key)
      const storeSettings = await getStore('settings')
      const currentSettings = { ...DEFAULT_SETTINGS, ...(storeSettings || {}) }
      setSettings(currentSettings)

      const storeStocks = await getStore('stocks')
      const currentStocks = Array.isArray(storeStocks) ? storeStocks : []
      setStocks(currentStocks)
    } catch (error) {
      console.error('Failed to load initial config', error)
    }
  }, [])

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void loadConfigAndData()
    }, 0)

    let cancelled = false
    window?.api
      ?.getStockPollStatus?.()
      ?.then((status) => {
        if (cancelled) return
        if (status) setPollStatus(status)
      })
      .catch(() => {})

    // Listen for stock data pushed from main process
    const handleStockData = (newData: Record<string, StockData>): void => {
      console.log('Received stock data:', newData);
      setStockData(newData)
    }
    
    window?.api?.onStockDataUpdated?.(handleStockData)

    const handlePollStatus = (payload: StockPollStatus): void => {
      setPollStatus(payload)
    }

    window?.api?.onStockPollStatus?.(handlePollStatus)

    // Listen for configuration changes
    const handleConfigUpdated = (key: string): void => {
      if (key === 'settings' || key === 'stocks') {
        void loadConfigAndData()
      }
    }
    window?.api?.onConfigUpdated?.(handleConfigUpdated)

    // Fallback for browser environment using storage event
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === 'store_settings' || e.key === 'store_stocks') {
        void loadConfigAndData()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      cancelled = true
      window.clearTimeout(initialLoadTimer)
      window?.api?.offStockDataUpdated?.()
      window?.api?.offStockPollStatus?.()
      window?.api?.offConfigUpdated?.()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [loadConfigAndData])

  useEffect(() => {
    const handleShown = (): void => {
      void loadConfigAndData()
    }

    window?.electron?.ipcRenderer?.on('window-shown', handleShown)

    return () => {
      window?.electron?.ipcRenderer?.removeListener('window-shown', handleShown)
    }
  }, [loadConfigAndData])

  const getFontSize = (): string => {
    switch (settings.fontSize) {
      case 'small':
        return '12px'
      case 'large':
        return '16px'
      case 'medium':
      default:
        return '14px'
    }
  }

  const getColor = (changeAmt: string): string => {
    const num = parseFloat(changeAmt)
    const defaultColor = settings.theme ? '#fff' : '#000'
    if (isNaN(num) || num === 0) return defaultColor

    const format = settings.changeFormat
    if (format === 'none') return defaultColor
    if (format === 'black') return '#000'
    if (format === 'custom') return settings.customColor || defaultColor

    const isUp = num > 0
    if (settings.colorTheme === 'green-red') {
      return isUp ? '#00ff00' : '#ff0000'
    }
    return isUp ? '#ff0000' : '#00ff00'
  }

  const getBackgroundColor = (): string => {
    if (settings.bgColor) {
      return settings.bgColor
    }
    return settings.theme ? '#000000' : '#ffffff'
  }

  const bgColor = getBackgroundColor()
  const defaultTextColor = settings.theme ? '#fff' : '#000'
  const lastSuccessText = pollStatus?.lastSuccessAt ? new Date(pollStatus.lastSuccessAt).toLocaleTimeString() : ''
  const pollEventTs =
    typeof pollStatus?.lastEventAt === 'number'
      ? pollStatus.lastEventAt
      : typeof pollStatus?.ts === 'number'
        ? pollStatus.ts
        : null
  const watchdogThresholdMs = Math.max(2 * (settings.refreshRate || DEFAULT_SETTINGS.refreshRate) * 1000, 10000)
  const pollAgeMs = pollEventTs ? nowTick - pollEventTs : nowTick - mountedAt
  const watchdogStale = pollAgeMs > watchdogThresholdMs

  const copyDiagnostics = async (): Promise<void> => {
    const diagnostics = [
      `ts=${new Date().toISOString()}`,
      `refreshRate=${settings.refreshRate}`,
      `stocks=${JSON.stringify(stocks)}`,
      `pollStatus=${JSON.stringify(pollStatus)}`
    ].join('\n')

    const setTip = (text: string): void => {
      setCopyTip(text)
      window.setTimeout(() => setCopyTip(''), 1500)
    }

    try {
      await navigator.clipboard.writeText(diagnostics)
      setTip('已复制')
    } catch {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = diagnostics
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(textarea)
        setTip(ok ? '已复制' : '复制失败')
      } catch {
        setTip('复制失败')
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={
        {
          display: 'inline-flex',
          minWidth: '150px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          color: defaultTextColor,
          backgroundColor: bgColor,
          opacity: normalizeOpacity(settings.opacity ?? 80) / 100,
          userSelect: 'none',
          cursor: isLocked ? 'default' : 'move',
          borderRadius: '8px',
          overflow: 'hidden',
          fontFamily: 'monospace',
          fontSize: getFontSize(),
          lineHeight: settings.lineHeight || 1.5,
          padding: '10px',
          boxSizing: 'border-box'
        } as React.CSSProperties
      }
    >
      <div
        style={
          {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '11px',
            opacity: 0.85,
            marginBottom: '6px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          } as React.CSSProperties
        }
      >
        <div
          style={
            {
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            } as React.CSSProperties
          }
        >
          {watchdogStale
            ? 'Polling Status: Polling not running / IPC disconnected'
            : pollStatus
              ? `Polling Status: ${pollStatus.phase} ${Math.max(0, Math.round(pollAgeMs / 1000))}s` +
                (typeof pollStatus.statusCode === 'number' ? ` sc=${pollStatus.statusCode}` : '') +
                (typeof pollStatus.bytes === 'number' ? ` b=${pollStatus.bytes}` : '') +
                (typeof pollStatus.parsedSymbols === 'number' ? ` syms=${pollStatus.parsedSymbols}` : '') +
                (pollStatus.error ? ` err=${pollStatus.error}` : '')
              : 'Polling Status: waiting...'}
        </div>
        <button
          type="button"
          onClick={copyDiagnostics}
          style={
            {
              flex: 'none',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '6px',
              border: `1px solid ${settings.theme ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}`,
              background: 'transparent',
              color: defaultTextColor,
              opacity: 0.9,
              cursor: 'pointer'
            } as React.CSSProperties
          }
        >
          {copyTip ? copyTip : '复制诊断'}
        </button>
      </div>
      <div style={{ width: '100%' } as React.CSSProperties}>
        {stocks
          .filter((s) => s.visible)
          .map((stock) => {
            const cleanSymbol = stock.symbol.trim()
            const data =
              stockData[cleanSymbol] || stockData[cleanSymbol.toLowerCase()] || stockData[cleanSymbol.toUpperCase()]
            if (!data) {
              const phase = pollStatus?.phase
              const error = pollStatus?.error
              const statusText =
                watchdogStale
                  ? 'Polling not running / IPC disconnected'
                  : phase === 'error' && error
                    ? `Error: ${error}`
                    : 'Loading...'
              return (
                <div key={stock.key} style={{ display: 'flex', padding: '2px 0' }}>
                  <span>
                    {stock.name} - {statusText}{lastSuccessText ? ` (last ok ${lastSuccessText})` : ''}
                  </span>
                </div>
              )
            }

            if ('error' in data) {
              return (
                <div key={stock.key} style={{ display: 'flex', padding: '2px 0', color: '#ff4d4f' }}>
                  <span>
                    {stock.name} - {data.error}
                  </span>
                </div>
              )
            }

            const color = getColor(data.changeAmt)
            const isUp = parseFloat(data.changeAmt) > 0
            const sign = isUp ? '+' : ''

            const renderSymbol = (): React.ReactNode => {
              const format = settings.symbolFormat
              if (format === 'none') return null
              let text = stock.symbol
              if (format === 'last3') text = text.slice(-3)
              else if (format === 'last2') text = text.slice(-2)
              else if (!format || format === 'full') text = stock.symbol
              if (!text) return null
              return <span style={{ minWidth: '50px' }}>{text}</span>
            }

            const renderName = (): React.ReactNode => {
              const format = settings.nameFormat
              if (format === 'none') return null
              let text = stock.name
              if (format === 'first2') text = text.slice(0, 2)
              else if (format === 'first1') text = text.slice(0, 1)
              else if (format === 'last2') text = text.slice(-2)
              else if (format === 'last1') text = text.slice(-1)
              else if (format === 'force4') {
                text = text.slice(0, 4)
                while (text.length < 4) {
                  text += '　'
                }
              }
              return <span style={{ minWidth: '80px' }}>{text}</span>
            }

            const renderPrice = (): React.ReactNode => {
              const format = settings.priceFormat
              if (format === 'none') return null
              if (format === 'priceAndChange') {
                return (
                  <span style={{ minWidth: '100px', textAlign: 'right' }}>
                    {data.price} {sign}
                    {data.changePct}%
                  </span>
                )
              }
              return <span style={{ minWidth: '60px', textAlign: 'right' }}>{data.price}</span>
            }

            return (
              <div
                key={stock.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color,
                  padding: '2px 0'
                }}
              >
                {renderSymbol()}
                {renderName()}
                {renderPrice()}
                {settings.showChangePercent && settings.priceFormat !== 'priceAndChange' && (
                  <span style={{ minWidth: '65px', textAlign: 'right' }}>
                    {sign}
                    {data.changePct}%
                  </span>
                )}
                {settings.showHighLow && (
                  <span style={{ fontSize: '0.85em', opacity: 0.8, marginLeft: '4px' }}>
                    H:{data.high} L:{data.low}
                  </span>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Monitor
