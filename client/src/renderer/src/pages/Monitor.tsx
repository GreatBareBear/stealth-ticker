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

interface StockData {
  symbol: string
  name: string
  price: string
  changeAmt: string
  changePct: string
  high: string
  low: string
}

interface AlertConfig {
  type: 'price' | 'percent'
  condition: 'above' | 'below'
  threshold: number
  message: string
  method: 'popup' | 'sound' | 'blink'
  enabled?: boolean
  cooldownSeconds?: number
  hysteresis?: number
}

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

const DEFAULT_STOCKS: Stock[] = [
  { key: '1', symbol: 'sh000001', name: '上证指数', isIndex: true, visible: true },
  { key: '2', symbol: 'sz399001', name: '深证成指', isIndex: true, visible: true },
  { key: '3', symbol: 'sz000001', name: '平安银行', isIndex: false, visible: true }
]

function normalizeOpacity(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 80
  return Math.min(100, Math.max(1, num))
}

function Monitor(): React.JSX.Element {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [stockData, setStockData] = useState<Record<string, StockData>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isWindowHidden, setIsWindowHidden] = useState(false)
  const dragPosRef = useRef({ x: 0, y: 0 })
  const triggeredKeys = useRef<Set<string>>(new Set())
  const lastTriggeredAtRef = useRef<Map<string, number>>(new Map())
  const lastGlobalPausedRef = useRef<boolean>(false)
  const lastEnabledMapRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const handleLock = (_event: any, locked: boolean) => {
      setIsLocked(locked)
      if (locked) {
        setIsDragging(false)
      }
    }

    window.electron.ipcRenderer.on('window-locked', handleLock)
    
    return () => {
      window.electron.ipcRenderer.removeListener('window-locked', handleLock)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return
    if (e.button === 0) {
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)
      dragPosRef.current = { x: e.screenX, y: e.screenY }
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return
    if (isDragging) {
      const deltaX = e.screenX - dragPosRef.current.x
      const deltaY = e.screenY - dragPosRef.current.y
      dragPosRef.current = { x: e.screenX, y: e.screenY }
      window.electron.ipcRenderer.send('drag-window', { deltaX, deltaY })
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
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
        window.electron.ipcRenderer.send('resize-window', {
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

  React.useEffect(() => {
    let isHovering = false
    let isTempUnlocked = false

    const checkUnlock = (shouldUnlock: boolean) => {
      const active = isHovering && shouldUnlock
      if (active !== isTempUnlocked) {
        isTempUnlocked = active
        window.api.tempUnlock(active)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      isHovering = true
      checkUnlock(e.altKey)
    }

    const handleMouseLeave = () => {
      isHovering = false
      checkUnlock(false)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
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
        window.api.tempUnlock(false)
      }
    }
  }, [])

  const handleContextMenu = (e: React.MouseEvent): void => {
    e.preventDefault()
    if (isLocked) return
    if (settings.enableContextMenu === false) return
    window.electron.ipcRenderer.send('show-context-menu')
  }

  const loadConfigAndData = React.useCallback(async (): Promise<void> => {
    try {
      const storeSettings = await window.api.store.get('settings')
      const currentSettings = { ...DEFAULT_SETTINGS, ...(storeSettings || {}) }
      setSettings(currentSettings)

      const storeStocks = await window.api.store.get('stocks')
      const currentStocks =
        Array.isArray(storeStocks) && storeStocks.length > 0 ? storeStocks : DEFAULT_STOCKS
      setStocks(currentStocks)

      const visibleStocks = currentStocks.filter((s: Stock) => s.visible)
      if (visibleStocks.length === 0) return

      const symbols = visibleStocks.map((s: Stock) => s.symbol).join(',')
      const url = `https://qt.gtimg.cn/q=${symbols}`
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      const decoder = new TextDecoder('gbk')
      const text = decoder.decode(buffer)

      const lines = text.split('\n')
      const newData: Record<string, StockData> = {}

      lines.forEach((line) => {
        line = line.trim()
        if (!line) return
        const match = line.match(/^v_(.*?)="(.*)";$/)
        if (match) {
          const fullSymbol = match[1]
          const parts = match[2].split('~')
          if (parts.length > 34) {
            newData[fullSymbol] = {
              symbol: fullSymbol,
              name: parts[1],
              price: parts[3],
              changeAmt: parts[31],
              changePct: parts[32],
              high: parts[33],
              low: parts[34]
            }
          }
        }
      })

      setStockData(newData)

      const alertsGlobalPaused = await window.api.store.get('alertsGlobalPaused')
      const isGlobalPaused = alertsGlobalPaused === true
      if (lastGlobalPausedRef.current && !isGlobalPaused) {
        triggeredKeys.current.clear()
      }
      lastGlobalPausedRef.current = isGlobalPaused

      const clearTriggeredKeysForSymbol = (symbol: string) => {
        for (const k of triggeredKeys.current) {
          if (k.startsWith(`${symbol}-`)) {
            triggeredKeys.current.delete(k)
          }
        }
      }
      const clearLastTriggeredAtForSymbol = (symbol: string) => {
        for (const k of lastTriggeredAtRef.current.keys()) {
          if (k.startsWith(`${symbol}-`)) {
            lastTriggeredAtRef.current.delete(k)
          }
        }
      }

      if (isGlobalPaused) return

      const parseTimeToMinutes = (value: unknown): number | null => {
        if (typeof value !== 'string') return null
        const m = value.match(/^(\d{1,2}):(\d{2})$/)
        if (!m) return null
        const hh = Number(m[1])
        const mm = Number(m[2])
        if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
        if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null
        return hh * 60 + mm
      }

      const nowMs = Date.now()
      const alertsTempPausedUntilRaw = await window.api.store.get('alertsTempPausedUntil')
      const alertsTempPausedUntil =
        typeof alertsTempPausedUntilRaw === 'number' ? alertsTempPausedUntilRaw : Number(alertsTempPausedUntilRaw)
      const tempPausedActive = Number.isFinite(alertsTempPausedUntil) && alertsTempPausedUntil > nowMs

      const alertsDndEnabled = (await window.api.store.get('alertsDndEnabled')) === true
      const alertsDndStart = await window.api.store.get('alertsDndStart')
      const alertsDndEnd = await window.api.store.get('alertsDndEnd')
      const alertsDndAllowedMethodsRaw = await window.api.store.get('alertsDndAllowedMethods')
      const alertsDndAllowedMethods = Array.isArray(alertsDndAllowedMethodsRaw)
        ? (alertsDndAllowedMethodsRaw.filter((x) => typeof x === 'string') as string[])
        : []

      const startMin = parseTimeToMinutes(alertsDndStart)
      const endMin = parseTimeToMinutes(alertsDndEnd)
      const nowDate = new Date(nowMs)
      const nowMin = nowDate.getHours() * 60 + nowDate.getMinutes()
      const rangeActive =
        alertsDndEnabled &&
        startMin !== null &&
        endMin !== null &&
        (startMin === endMin
          ? true
          : startMin < endMin
            ? nowMin >= startMin && nowMin < endMin
            : nowMin >= startMin || nowMin < endMin)

      const isDndActive = tempPausedActive || rangeActive

      const alerts = await window.api.store.get('alerts')
      if (alerts) {
        visibleStocks.forEach((stock: Stock) => {
          const data = newData[stock.symbol]
          const alert = alerts[stock.symbol] as AlertConfig
          if (data && alert) {
            const enabled = alert.enabled !== false
            const lastEnabled = lastEnabledMapRef.current[stock.symbol]
            if (lastEnabled === false && enabled) {
              clearTriggeredKeysForSymbol(stock.symbol)
              clearLastTriggeredAtForSymbol(stock.symbol)
            }
            lastEnabledMapRef.current[stock.symbol] = enabled
            if (!enabled) {
              clearTriggeredKeysForSymbol(stock.symbol)
              return
            }

            const value = alert.type === 'price' ? parseFloat(data.price) : parseFloat(data.changePct)
            if (isNaN(value)) return

            let isTriggered = false
            if (alert.condition === 'above' && value > alert.threshold) {
              isTriggered = true
            } else if (alert.condition === 'below' && value < alert.threshold) {
              isTriggered = true
            }

            const key = `${stock.symbol}-${alert.type}-${alert.condition}-${alert.threshold}`
            const cooldownSeconds = typeof alert.cooldownSeconds === 'number' ? Math.max(0, alert.cooldownSeconds) : 60
            const hysteresis = typeof alert.hysteresis === 'number' ? Math.max(0, alert.hysteresis) : 0
            const resetTriggered =
              alert.condition === 'above'
                ? value < alert.threshold - hysteresis
                : value > alert.threshold + hysteresis

            if (isTriggered) {
              if (!triggeredKeys.current.has(key)) {
                triggeredKeys.current.add(key)

                const lastTriggeredAt = lastTriggeredAtRef.current.get(key) || 0
                if (cooldownSeconds === 0 || nowMs - lastTriggeredAt >= cooldownSeconds * 1000) {
                  lastTriggeredAtRef.current.set(key, nowMs)

                  const suppressByDnd =
                    isDndActive &&
                    (alertsDndAllowedMethods.length === 0 || !alertsDndAllowedMethods.includes(alert.method))

                  if (!suppressByDnd) {
                    let message = alert.message || `${stock.name}当前${alert.type === 'price' ? '价格' : '涨跌幅'}${alert.type === 'price' ? data.price : data.changePct}已突破${alert.threshold}`
                    message = message.replace(/\$\{股票名称\}/g, stock.name)
                      .replace(/\$\{价格\}/g, data.price)
                      .replace(/\$\{阈值\}/g, String(alert.threshold))

                    if (alert.method === 'popup') {
                      const notification = new Notification('股票预警', { body: message })
                      setTimeout(() => notification.close(), 3000)
                    } else if (alert.method === 'sound' || alert.method === 'blink') {
                      window.electron.ipcRenderer.send('trigger-alert', { method: alert.method, message })
                    }
                  }
                }
              }
            } else if (resetTriggered) {
              if (triggeredKeys.current.has(key)) {
                triggeredKeys.current.delete(key)
              }
            }
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch stock data', error)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line
    loadConfigAndData()
  }, [])

  useEffect(() => {
    const handleHidden = () => setIsWindowHidden(true)
    const handleShown = () => {
      setIsWindowHidden(false)
      loadConfigAndData()
    }

    window.electron.ipcRenderer.on('window-hidden', handleHidden)
    window.electron.ipcRenderer.on('window-shown', handleShown)

    return () => {
      window.electron.ipcRenderer.removeListener('window-hidden', handleHidden)
      window.electron.ipcRenderer.removeListener('window-shown', handleShown)
    }
  }, [loadConfigAndData])

  useEffect(() => {
    if (isWindowHidden) return

    const rate = settings.refreshRate || 3
    const interval = setInterval(() => {
      loadConfigAndData()
    }, rate * 1000)
    return () => clearInterval(interval)
  }, [settings.refreshRate, isWindowHidden, loadConfigAndData])

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

  const getBackgroundColor = () => {
    if (settings.bgColor) {
      return settings.bgColor
    }
    return settings.theme ? '#000000' : '#ffffff'
  }

  const bgColor = getBackgroundColor()
  const defaultTextColor = settings.theme ? '#fff' : '#000'

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
      <div style={{ width: '100%' } as React.CSSProperties}>
        {stocks
          .filter((s) => s.visible)
          .map((stock) => {
            const data = stockData[stock.symbol]
            if (!data) {
              return (
                <div key={stock.key} style={{ display: 'flex', padding: '2px 0' }}>
                  <span>{stock.name} - Loading...</span>
                </div>
              )
            }

            const color = getColor(data.changeAmt)
            const isUp = parseFloat(data.changeAmt) > 0
            const sign = isUp ? '+' : ''

            const renderSymbol = () => {
              const format = settings.symbolFormat
              if (format === 'none') return null
              let text = stock.symbol
              if (format === 'last3') text = text.slice(-3)
              else if (format === 'last2') text = text.slice(-2)
              else if (!format || format === 'full') text = stock.symbol
              if (!text) return null
              return <span style={{ minWidth: '50px' }}>{text}</span>
            }

            const renderName = () => {
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

            const renderPrice = () => {
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
