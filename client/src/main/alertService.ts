import { BrowserWindow, Tray, shell, Notification } from 'electron'
import { net } from 'electron'

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

interface Stock {
  symbol: string
  name?: string
  visible: boolean
  alerts?: AlertConfig[]
}

export class AlertService {
  private store: any
  private mainWindow: BrowserWindow | null
  private tray: Tray | null
  private pollTimeout: NodeJS.Timeout | null = null
  private blinkInterval: NodeJS.Timeout | null = null

  private lastTriggeredAt: Map<string, number> = new Map()
  private triggeredKeys: Set<string> = new Set()
  private consecutiveFailures: number = 0

  constructor(store: any, mainWindow: BrowserWindow | null, tray: Tray | null) {
    this.store = store
    this.mainWindow = mainWindow
    this.tray = tray
  }

  public setMainWindow(win: BrowserWindow | null) {
    this.mainWindow = win
  }

  public setTray(t: Tray | null) {
    this.tray = t
  }

  public reloadConfig() {
    this.stop()
    this.start()
  }

  public start() {
    this.stop()
    this.consecutiveFailures = 0
    this.poll()
  }

  public stop() {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout)
      this.pollTimeout = null
    }
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval)
      this.blinkInterval = null
    }
  }

  private scheduleNextPoll() {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout)
    }
    
    const settings = this.store.get('settings') || {}
    const baseRefreshRate = settings.refreshRate || 3
    
    // Exponential backoff: base * (2 ^ consecutiveFailures), max 60 seconds
    const backoffMultiplier = Math.pow(2, Math.min(this.consecutiveFailures, 6)) // max 2^6 = 64
    const nextInterval = Math.min(baseRefreshRate * backoffMultiplier, 60)
    
    this.pollTimeout = setTimeout(() => this.poll(), nextInterval * 1000)
  }

  private async poll() {
    try {
      const stocks: Stock[] = this.store.get('stocks') || []
      const visibleStocks = stocks.filter((s) => s.visible)
      if (visibleStocks.length === 0) {
        this.scheduleNextPoll()
        return
      }

      const symbols = visibleStocks.map((s) => encodeURIComponent(s.symbol.toLowerCase().trim())).join(',')
      const url = `https://qt.gtimg.cn/q=${symbols}`

      const request = net.request(url)
      
      // Setup timeout (e.g., 5 seconds)
      const reqTimeout = setTimeout(() => {
        request.abort()
      }, 5000)

      request.on('response', (response) => {
        let data = Buffer.alloc(0)
        response.on('data', (chunk) => {
          data = Buffer.concat([data, chunk])
        })
        response.on('end', () => {
          clearTimeout(reqTimeout)
          try {
            let text = ''
            try {
              const decoder = new TextDecoder('gbk')
              text = decoder.decode(data)
            } catch (e) {
              text = data.toString('utf8')
            }
            const newData = this.parseResponse(text)
            
            // 1. Send data to renderer
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
              this.mainWindow.webContents.send('stock-data-updated', newData)
            }

            // 2. Check alerts
            this.checkAlerts(newData, stocks)

            // Reset failures on success
            this.consecutiveFailures = 0
          } catch (err) {
            console.error('Failed to parse response:', err)
            this.consecutiveFailures++
          } finally {
            this.scheduleNextPoll()
          }
        })
      })
      
      request.on('error', (err) => {
        clearTimeout(reqTimeout)
        console.error('Fetch stock data failed in main process:', err)
        this.consecutiveFailures++
        this.scheduleNextPoll()
      })
      
      request.end()
    } catch (e) {
      console.error('Error in alert poll:', e)
      this.consecutiveFailures++
      this.scheduleNextPoll()
    }
  }

  private parseResponse(text: string) {
    const lines = text.split('\n')
    const newData: Record<string, any> = {}
    lines.forEach((line) => {
      line = line.trim()
      if (!line) return
      const match = line.match(/^v_(.*?)="(.*)";?$/)
      if (match) {
        const fullSymbol = match[1]
        const parts = match[2].split('~')
        if (parts.length > 10) {
          const stockInfo = {
            symbol: fullSymbol,
            name: parts[1],
            price: parts[3],
            changeAmt: parts[31] || '0',
            changePct: parts[32] || '0',
            high: parts[33] || '0',
            low: parts[34] || '0'
          }
          newData[fullSymbol] = stockInfo
          newData[fullSymbol.toLowerCase()] = stockInfo
          newData[fullSymbol.toUpperCase()] = stockInfo
          
          const codeOnly = parts[2]
          if (codeOnly) {
            newData[codeOnly] = stockInfo
            newData[codeOnly.toLowerCase()] = stockInfo
            newData[codeOnly.toUpperCase()] = stockInfo
          }
        }
      }
    })
    return newData
  }

  private checkAlerts(newData: Record<string, any>, stocks: Stock[]) {
    const isGlobalPaused = this.store.get('alertsGlobalPaused') === true
    if (isGlobalPaused) return

    const nowMs = Date.now()
    const alertsTempPausedUntilRaw = this.store.get('alertsTempPausedUntil')
    const alertsTempPausedUntil =
      typeof alertsTempPausedUntilRaw === 'number'
        ? alertsTempPausedUntilRaw
        : Number(alertsTempPausedUntilRaw)
    const tempPausedActive = Number.isFinite(alertsTempPausedUntil) && alertsTempPausedUntil > nowMs

    const alertsDndEnabled = this.store.get('alertsDndEnabled') === true
    const alertsDndStart = this.store.get('alertsDndStart')
    const alertsDndEnd = this.store.get('alertsDndEnd')
    const alertsDndAllowedMethodsRaw = this.store.get('alertsDndAllowedMethods')
    const alertsDndAllowedMethods = Array.isArray(alertsDndAllowedMethodsRaw)
      ? (alertsDndAllowedMethodsRaw.filter((x) => typeof x === 'string') as string[])
      : []

    const startMin = this.parseTimeToMinutes(alertsDndStart)
    const endMin = this.parseTimeToMinutes(alertsDndEnd)
    const nowDate = new Date(nowMs)
    const nowMin = nowDate.getHours() * 60 + nowDate.getMinutes()
    let rangeActive = false

    if (alertsDndEnabled && startMin !== null && endMin !== null) {
      if (startMin <= endMin) {
        rangeActive = nowMin >= startMin && nowMin < endMin
      } else {
        rangeActive = nowMin >= startMin || nowMin < endMin
      }
    }

    const dndActive = tempPausedActive || rangeActive

    // Global alerts config
    const globalAlerts: AlertConfig[] = this.store.get('alerts') || []

    for (const stock of stocks) {
      const cleanSymbol = stock.symbol.trim(); const data = newData[cleanSymbol] || newData[cleanSymbol.toLowerCase()] || newData[cleanSymbol.toUpperCase()]
      if (!data) continue

      const price = parseFloat(data.price)
      const pct = parseFloat(data.changePct)
      if (isNaN(price) || isNaN(pct)) continue

      const allAlerts = [...globalAlerts, ...(stock.alerts || [])]

      allAlerts.forEach((alert, index) => {
        if (alert.enabled === false) return

        const val = alert.type === 'price' ? price : pct
        const conditionMet =
          alert.condition === 'above' ? val >= alert.threshold : val <= alert.threshold

        const key = `${stock.symbol}-${index}`
        const hysteresis = alert.hysteresis ?? 0
        const isTriggered = this.triggeredKeys.has(key)

        if (!conditionMet) {
          if (isTriggered) {
            const recoveryMet =
              alert.condition === 'above'
                ? val < alert.threshold - hysteresis
                : val > alert.threshold + hysteresis
            if (recoveryMet) {
              this.triggeredKeys.delete(key)
            }
          }
          return
        }

        if (isTriggered) return

        const lastTime = this.lastTriggeredAt.get(key) || 0
        const cooldown = (alert.cooldownSeconds ?? 60) * 1000
        if (nowMs - lastTime < cooldown) return

        if (dndActive && !alertsDndAllowedMethods.includes(alert.method)) return

        this.triggeredKeys.add(key)
        this.lastTriggeredAt.set(key, nowMs)

        const title = `${data.name || stock.symbol} 预警`
        const message = alert.message || `当前值: ${val}`
        this.triggerAction(alert.method, title, message)
      })
    }
  }

  private triggerAction(method: string, title: string, message: string) {
    if (method === 'popup') {
      new Notification({
        title,
        body: message,
        silent: true // handle sound separately if needed, but 'popup' method shouldn't play sound by default based on old logic
      }).show()
    } else if (method === 'sound') {
      shell.beep()
    } else if (method === 'blink') {
      this.startBlinking()
    }
  }

  private startBlinking() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval)
    }
    if (!this.tray || this.tray.isDestroyed()) return

    let isHidden = false
    let count = 0
    const emptyImage = require('electron').nativeImage.createEmpty()
    const icon = require('electron').nativeImage.createFromPath(
      require('path').join(__dirname, '../../resources/icon.png')
    )

    this.blinkInterval = setInterval(() => {
      if (!this.tray || this.tray.isDestroyed()) {
        if (this.blinkInterval) clearInterval(this.blinkInterval)
        return
      }

      isHidden = !isHidden
      this.tray.setImage(isHidden ? emptyImage : icon)
      count++

      if (count >= 20) {
        clearInterval(this.blinkInterval!)
        this.blinkInterval = null
        if (this.tray && !this.tray.isDestroyed()) this.tray.setImage(icon)
      }
    }, 500)
  }

  private parseTimeToMinutes(value: unknown): number | null {
    if (typeof value !== 'string') return null
    const m = value.match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return null
    const hh = Number(m[1])
    const mm = Number(m[2])
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null
    return hh * 60 + mm
  }
}
