import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Popconfirm, Switch, message, Select, Spin, Modal, Form, Radio, InputNumber, Input, Space, Tooltip, Divider, Badge } from 'antd'
import { PlusOutlined, DeleteOutlined, DragOutlined, BellOutlined, BellFilled, ClockCircleOutlined } from '@ant-design/icons'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface Stock {
  key: string
  symbol: string
  name: string
  isIndex: boolean
  visible: boolean
}

export interface AlertConfig {
  type: 'price' | 'percent'
  condition: 'above' | 'below'
  threshold: number
  message: string
  method: 'popup' | 'sound' | 'blink'
  enabled: boolean
  cooldownSeconds?: number
  hysteresis?: number
}

export interface OptionData {
  symbol: string
  name: string
  type: string
}

export interface OptionType {
  value: string
  label: string
  data: OptionData
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners?: Record<string, any>
}

const RowContext = React.createContext<RowContextProps>({})

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = React.useContext(RowContext)
  return (
    <DragOutlined
      ref={setActivatorNodeRef}
      style={{ cursor: 'grab', color: '#999' }}
      {...listeners}
    />
  )
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const Row = (props: RowProps): React.JSX.Element => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
  }

  const contextValue = React.useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  )

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  )
}

function parseHHmm(value: string): number | null {
  const match = value.match(/^(\d{2}):(\d{2})$/)
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

function isInDndTimeRange(now: Date, start: string, end: string): boolean {
  const startMin = parseHHmm(start)
  const endMin = parseHHmm(end)
  if (startMin === null || endMin === null) return false
  const nowMin = now.getHours() * 60 + now.getMinutes()
  if (startMin === endMin) return true
  if (startMin < endMin) return nowMin >= startMin && nowMin < endMin
  return nowMin >= startMin || nowMin < endMin
}

function formatRemaining(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return ''
  const totalSeconds = Math.ceil(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  if (m <= 0) return `${s}秒`
  if (s === 0) return `${m}分钟`
  return `${m}分钟${s}秒`
}

import { useStore } from '../../StoreContext'

export function StocksTab(): React.JSX.Element {
  const store = useStore()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [options, setOptions] = useState<OptionType[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [selectedStock, setSelectedStock] = useState<OptionData | null>(null)

  const [alerts, setAlerts] = useState<Record<string, AlertConfig>>({})
  const [alertsGlobalPaused, setAlertsGlobalPaused] = useState<boolean>(false)
  const [isAlertModalVisible, setIsAlertModalVisible] = useState<boolean>(false)
  const [currentAlertSymbol, setCurrentAlertSymbol] = useState<string | null>(null)
  const [form] = Form.useForm()
  const alertModalEnabled = Form.useWatch('enabled', form)

  const [isDndModalVisible, setIsDndModalVisible] = useState<boolean>(false)
  const [alertsTempPausedUntil, setAlertsTempPausedUntil] = useState<number>(0)
  const [alertsDndEnabled, setAlertsDndEnabled] = useState<boolean>(false)
  const [alertsDndStart, setAlertsDndStart] = useState<string>('22:00')
  const [alertsDndEnd, setAlertsDndEnd] = useState<string>('08:00')
  const [alertsDndAllowedMethods, setAlertsDndAllowedMethods] = useState<Array<'popup' | 'sound' | 'blink'>>([])
  const [nowTick, setNowTick] = useState<number>(Date.now())

  const fetchRef = useRef<number>(0)

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000 * 10)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const savedAlerts = await store.get('alerts')
        if (savedAlerts && typeof savedAlerts === 'object') {
          let hasLegacyAlert = false
          const normalizedAlerts = Object.fromEntries(
            Object.entries(savedAlerts as Record<string, Partial<AlertConfig>>).map(([symbol, config]) => {
              const safeConfig = config && typeof config === 'object' ? config : {}
              if (config && typeof config === 'object' && typeof config.enabled !== 'boolean') {
                hasLegacyAlert = true
              }
              const cooldownSeconds =
                typeof (safeConfig as any).cooldownSeconds === 'number' ? (safeConfig as any).cooldownSeconds : 60
              const hysteresis = typeof (safeConfig as any).hysteresis === 'number' ? (safeConfig as any).hysteresis : 0
              if (typeof (safeConfig as any).cooldownSeconds !== 'number' || typeof (safeConfig as any).hysteresis !== 'number') {
                hasLegacyAlert = true
              }
              return [
                symbol,
                { ...(safeConfig as AlertConfig), enabled: safeConfig.enabled !== false, cooldownSeconds, hysteresis }
              ]
            })
          ) as Record<string, AlertConfig>
          setAlerts(normalizedAlerts)
          if (hasLegacyAlert) {
            await store.set('alerts', normalizedAlerts)
          }
        }

        const savedAlertsGlobalPaused = await store.get('alertsGlobalPaused')
        if (typeof savedAlertsGlobalPaused === 'boolean') {
          setAlertsGlobalPaused(savedAlertsGlobalPaused)
        }

        const [
          savedAlertsTempPausedUntil,
          savedAlertsDndEnabled,
          savedAlertsDndStart,
          savedAlertsDndEnd,
          savedAlertsDndAllowedMethods
        ] = await Promise.all([
          store.get('alertsTempPausedUntil'),
          store.get('alertsDndEnabled'),
          store.get('alertsDndStart'),
          store.get('alertsDndEnd'),
          store.get('alertsDndAllowedMethods')
        ])

        if (typeof savedAlertsTempPausedUntil === 'number' && Number.isFinite(savedAlertsTempPausedUntil)) {
          setAlertsTempPausedUntil(savedAlertsTempPausedUntil)
        }

        if (typeof savedAlertsDndEnabled === 'boolean') {
          setAlertsDndEnabled(savedAlertsDndEnabled)
        }

        if (typeof savedAlertsDndStart === 'string' && parseHHmm(savedAlertsDndStart) !== null) {
          setAlertsDndStart(savedAlertsDndStart)
        }

        if (typeof savedAlertsDndEnd === 'string' && parseHHmm(savedAlertsDndEnd) !== null) {
          setAlertsDndEnd(savedAlertsDndEnd)
        }

        if (Array.isArray(savedAlertsDndAllowedMethods)) {
          const normalized = savedAlertsDndAllowedMethods.filter((m) => m === 'popup' || m === 'sound' || m === 'blink') as Array<
            'popup' | 'sound' | 'blink'
          >
          setAlertsDndAllowedMethods(normalized)
        }

        const savedStocks = await store.get('stocks')
        if (savedStocks && Array.isArray(savedStocks)) {
          setStocks(savedStocks)
        } else {
          setStocks([
            { key: '1', symbol: 'sh000001', name: '上证指数', isIndex: true, visible: true },
            { key: '2', symbol: 'sz399001', name: '深证成指', isIndex: true, visible: true },
            { key: '3', symbol: 'sz000001', name: '平安银行', isIndex: false, visible: true },
            { key: '4', symbol: 'sh600519', name: '贵州茅台', isIndex: false, visible: false }
          ])
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const saveAlerts = async (newAlerts: Record<string, AlertConfig>): Promise<void> => {
    setAlerts(newAlerts)
    try {
      await store.set('alerts', newAlerts)
    } catch (error) {
      console.error('Failed to save alerts:', error)
    }
  }

  const saveAlertsGlobalPaused = async (paused: boolean): Promise<void> => {
    setAlertsGlobalPaused(paused)
    try {
      await store.set('alertsGlobalPaused', paused)
    } catch (error) {
      console.error('Failed to save alertsGlobalPaused:', error)
    }
  }

  const saveAlertsTempPausedUntil = async (until: number): Promise<void> => {
    setAlertsTempPausedUntil(until)
    try {
      await store.set('alertsTempPausedUntil', until)
    } catch (error) {
      console.error('Failed to save alertsTempPausedUntil:', error)
    }
  }

  const saveAlertsDndEnabled = async (enabled: boolean): Promise<void> => {
    setAlertsDndEnabled(enabled)
    try {
      await store.set('alertsDndEnabled', enabled)
    } catch (error) {
      console.error('Failed to save alertsDndEnabled:', error)
    }
  }

  const saveAlertsDndStart = async (value: string): Promise<void> => {
    setAlertsDndStart(value)
    try {
      await store.set('alertsDndStart', value)
    } catch (error) {
      console.error('Failed to save alertsDndStart:', error)
    }
  }

  const saveAlertsDndEnd = async (value: string): Promise<void> => {
    setAlertsDndEnd(value)
    try {
      await store.set('alertsDndEnd', value)
    } catch (error) {
      console.error('Failed to save alertsDndEnd:', error)
    }
  }

  const saveAlertsDndAllowedMethods = async (methods: Array<'popup' | 'sound' | 'blink'>): Promise<void> => {
    setAlertsDndAllowedMethods(methods)
    try {
      await store.set('alertsDndAllowedMethods', methods)
    } catch (error) {
      console.error('Failed to save alertsDndAllowedMethods:', error)
    }
  }

  const openAlertModal = (record: Stock): void => {
    setCurrentAlertSymbol(record.symbol)
    const existingAlert = alerts[record.symbol]
    if (existingAlert) {
      form.setFieldsValue({
        ...existingAlert,
        enabled: existingAlert.enabled !== false,
        cooldownSeconds: typeof existingAlert.cooldownSeconds === 'number' ? existingAlert.cooldownSeconds : 60,
        hysteresis: typeof existingAlert.hysteresis === 'number' ? existingAlert.hysteresis : 0
      })
    } else {
      form.setFieldsValue({
        type: 'price',
        condition: 'above',
        threshold: undefined,
        message: `\${股票名称}当前价格\${价格}已突破\${阈值}`,
        method: 'popup',
        enabled: true,
        cooldownSeconds: 60,
        hysteresis: 0
      })
    }
    setIsAlertModalVisible(true)
  }

  const handleAlertModalOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields()
      if (currentAlertSymbol) {
        const enabled = form.getFieldValue('enabled')
        const newAlerts = {
          ...alerts,
          [currentAlertSymbol]: { ...(values as AlertConfig), enabled: enabled !== false }
        }
        await saveAlerts(newAlerts)
      }
      setIsAlertModalVisible(false)
    } catch {
      return
    }
  }

  const handleAlertModalCancel = (): void => {
    setIsAlertModalVisible(false)
  }

  const handleDeleteAlert = async (symbol: string): Promise<void> => {
    const newAlerts = { ...alerts }
    delete newAlerts[symbol]
    await saveAlerts(newAlerts)
  }

  const handleAlertEnabledChange = async (symbol: string, enabled: boolean): Promise<void> => {
    const existingAlert = alerts[symbol]
    if (!existingAlert) return
    await saveAlerts({ ...alerts, [symbol]: { ...existingAlert, enabled } })
  }

  const updateStocks = async (newStocks: Stock[]): Promise<void> => {
    setStocks(newStocks)
    try {
      await store.set('stocks', newStocks)
    } catch (error) {
      console.error('Failed to save stocks:', error)
    }
  }

  const handleSearch = async (value: string): Promise<void> => {
    if (!value.trim()) {
      setOptions([])
      return
    }

    fetchRef.current += 1
    const fetchId = fetchRef.current

    setSearchLoading(true)

    try {
      const response = await window.fetch(
        `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(value)}&t=all`
      )
      let text = await response.text()

      // 解析 Unicode 转义字符
      text = text.replace(/\\u[\dA-F]{4}/gi, (match) =>
        String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      )

      if (fetchId !== fetchRef.current) return

      const match = text.match(/v_hint="([^"]*)"/)
      if (match && match[1]) {
        const items = match[1].split('^')
        const newOptions = items.map((item) => {
          const parts = item.split('~')
          const exchange = parts[0]
          const code = parts[1]
          const name = parts[2]
          const type = parts[4]

          const symbol = `${exchange}${code}`
          return {
            value: symbol,
            label: `${name} (${symbol})`,
            data: { symbol, name, type }
          }
        })
        setOptions(newOptions)
      } else {
        setOptions([])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      if (fetchId === fetchRef.current) {
        setSearchLoading(false)
      }
    }
  }

  const handleSelect = (_value: string, option?: OptionType | OptionType[]): void => {
    if (option && !Array.isArray(option)) {
      setSelectedStock(option.data)
    }
  }

  const handleAdd = (): void => {
    if (!selectedStock) return

    if (stocks.length >= 9) {
      message.warning('免费版最多只能添加 9 只股票')
      return
    }

    if (stocks.some((s) => s.symbol === selectedStock.symbol)) {
      message.warning('该股票已存在')
      return
    }

    const newKey = Date.now().toString()
    const newStocks = [
      ...stocks,
      {
        key: newKey,
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        isIndex: selectedStock.type === 'ZS',
        visible: true
      }
    ]

    updateStocks(newStocks)
    setSelectedStock(null)
    setOptions([])
  }

  const handleDelete = (key: string): void => {
    updateStocks(stocks.filter((s) => s.key !== key))
  }

  const handleVisibleChange = (key: string, checked: boolean): void => {
    updateStocks(stocks.map((s) => (s.key === key ? { ...s, visible: checked } : s)))
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1
      }
    })
  )

  const onDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const activeIndex = stocks.findIndex((i) => i.key === active.id)
      const overIndex = stocks.findIndex((i) => i.key === over?.id)
      const newStocks = arrayMove(stocks, activeIndex, overIndex)
      updateStocks(newStocks)
    }
  }

  const columns = [
    {
      title: '',
      key: 'drag',
      width: 40,
      render: (): React.JSX.Element => <DragHandle />
    },
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '显示',
      key: 'visible',
      render: (_, record: Stock): React.JSX.Element => (
        <Switch
          checked={record.visible}
          onChange={(checked): void => handleVisibleChange(record.key, checked)}
          size="small"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Stock): React.JSX.Element => (
        <Space size="small">
          <Tooltip title={alerts[record.symbol] ? (alerts[record.symbol].enabled !== false ? '暂停预警' : '恢复预警') : '未设置预警'}>
            <Switch
              size="small"
              checked={!!alerts[record.symbol] && alerts[record.symbol].enabled !== false}
              disabled={!alerts[record.symbol]}
              onChange={(checked): void => {
                handleAlertEnabledChange(record.symbol, checked)
              }}
            />
          </Tooltip>
          <Tooltip title="预警设置">
            <Button
              type="text"
              icon={
                alerts[record.symbol] ? (
                  alertsGlobalPaused || alerts[record.symbol].enabled === false ? (
                    <BellFilled style={{ color: '#bfbfbf' }} />
                  ) : (
                    <BellFilled style={{ color: '#faad14' }} />
                  )
                ) : (
                  <BellOutlined />
                )
              }
              size="small"
              onClick={() => openAlertModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除该股票吗？"
            onConfirm={(): void => handleDelete(record.key)}
            okText="是"
            cancelText="否"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ]

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin />
      </div>
    )
  }

  const isTempPausedActive = alertsTempPausedUntil > nowTick
  const isTimeDndActive = alertsDndEnabled && isInDndTimeRange(new Date(nowTick), alertsDndStart, alertsDndEnd)
  const isDndActive = isTempPausedActive || isTimeDndActive
  const isScheduleEnabledButInactive = alertsDndEnabled && !isDndActive
  const dndScheduleRangeText = `${alertsDndStart} - ${alertsDndEnd}`
  
  let dndEntryText = ''
  let dndBtnType: 'text' | 'primary' = 'text'
  let dndBtnDanger = false
  let dndBtnStyle: React.CSSProperties | undefined = undefined
  let dndIconStyle: React.CSSProperties | undefined = undefined

  if (isDndActive) {
    if (isTempPausedActive) {
      dndEntryText = `剩余 ${formatRemaining(alertsTempPausedUntil - nowTick)}`
      dndBtnDanger = true
    } else {
      dndEntryText = '免打扰中'
      dndBtnStyle = { color: '#fa8c16' }
      dndIconStyle = { color: '#fa8c16' }
    }
  } else {
    dndEntryText = '免打扰'
  }

  const dndModalStatusText = isTempPausedActive
    ? `剩余 ${formatRemaining(alertsTempPausedUntil - nowTick)}`
    : isTimeDndActive
      ? `免打扰生效中 ${dndScheduleRangeText}`
      : isScheduleEnabledButInactive
        ? `已开启时间段（未生效）${dndScheduleRangeText}`
        : '未开启'

  const dndBaseIcon = <ClockCircleOutlined style={dndIconStyle} />
  const dndIcon = isScheduleEnabledButInactive ? <Badge color="#1677ff" dot>{dndBaseIcon}</Badge> : dndBaseIcon

  return (
    <div style={{ padding: '0 16px' }}>
      <Modal
        title="免打扰"
        open={isDndModalVisible}
        onCancel={() => setIsDndModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDndModalVisible(false)}>
            关闭
          </Button>
        ]}
        destroyOnClose
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>当前状态</div>
              <div style={{ color: 'rgba(0,0,0,0.65)' }}>{dndModalStatusText}</div>
            </div>
            <Button
              onClick={() => {
                saveAlertsTempPausedUntil(0)
              }}
            >
              立即恢复
            </Button>
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 600 }}>临时暂停预警</div>
            <Space size="small" wrap>
              <Button
                onClick={() => {
                  saveAlertsTempPausedUntil(Date.now() + 30 * 60 * 1000)
                }}
              >
                30 分钟
              </Button>
              <Button
                onClick={() => {
                  saveAlertsTempPausedUntil(Date.now() + 60 * 60 * 1000)
                }}
              >
                60 分钟
              </Button>
              <Button
                onClick={() => {
                  saveAlertsTempPausedUntil(Date.now() + 120 * 60 * 1000)
                }}
              >
                120 分钟
              </Button>
            </Space>
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600 }}>时间段免打扰</div>
              <Switch
                checked={alertsDndEnabled}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={(checked) => saveAlertsDndEnabled(checked)}
              />
            </div>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={alertsDndStart}
                onChange={(e) => {
                  const next = e.target.value
                  setAlertsDndStart(next)
                  if (parseHHmm(next) !== null) {
                    saveAlertsDndStart(next)
                  }
                }}
                placeholder="开始 HH:mm"
                disabled={!alertsDndEnabled}
              />
              <Input
                value={alertsDndEnd}
                onChange={(e) => {
                  const next = e.target.value
                  setAlertsDndEnd(next)
                  if (parseHHmm(next) !== null) {
                    saveAlertsDndEnd(next)
                  }
                }}
                placeholder="结束 HH:mm"
                disabled={!alertsDndEnabled}
              />
            </Space.Compact>
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 600 }}>免打扰期间提醒方式</div>
            <Select
              mode="multiple"
              allowClear
              placeholder="不选表示全部静默"
              value={alertsDndAllowedMethods}
              onChange={(values) => saveAlertsDndAllowedMethods(values as Array<'popup' | 'sound' | 'blink'>)}
              options={[
                { label: '弹窗', value: 'popup' },
                { label: '提示音', value: 'sound' },
                { label: '托盘闪烁', value: 'blink' }
              ]}
            />
          </div>
        </div>
      </Modal>

      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 8,
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <Select
            showSearch
            value={selectedStock ? selectedStock.symbol : null}
            placeholder="输入股票代码/拼音/名称"
            style={{ width: 300 }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleSelect}
            notFoundContent={searchLoading ? <Spin size="small" /> : null}
            options={options}
            popupMatchSelectWidth={false}
            listHeight={256}
            getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={!selectedStock}
          >
            添加
          </Button>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
          collisionDetection={closestCenter}
        >
          <SortableContext items={stocks.map((i) => i.key)} strategy={verticalListSortingStrategy}>
            <Table
              components={{
                body: {
                  row: Row
                }
              }}
              dataSource={stocks}
              columns={columns}
              pagination={false}
              size="small"
              rowKey="key"
              scroll={{ y: 340 }}
            />
          </SortableContext>
        </DndContext>
      </div>

      <div style={{ padding: '12px 0 0 0' }}>
        <Divider style={{ margin: 0 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '10px 0 0 0'
          }}
        >
          <Space size={6}>
            <span>全部预警</span>
            <Switch
              checked={!alertsGlobalPaused}
              checkedChildren="开启"
              unCheckedChildren="暂停"
              onChange={(checked): void => {
                saveAlertsGlobalPaused(!checked)
              }}
            />
          </Space>
          <Divider type="vertical" style={{ margin: '0 4px' }} />
          <Button
            type={dndBtnType}
            danger={dndBtnDanger}
            icon={dndIcon}
            size="small"
            onClick={() => setIsDndModalVisible(true)}
            style={{ marginInlineEnd: 0, padding: '0 8px', ...dndBtnStyle }}
          >
            {dndEntryText}
          </Button>
        </div>
      </div>

      <Modal
        title="预警设置"
        width={400}
        open={isAlertModalVisible}
        onOk={handleAlertModalOk}
        onCancel={handleAlertModalCancel}
        destroyOnClose
        footer={[
          <Space key="left" size="small" style={{ float: 'left' }}>
            <Button
              danger
              onClick={() => {
                if (currentAlertSymbol) {
                  handleDeleteAlert(currentAlertSymbol)
                  setIsAlertModalVisible(false)
                }
              }}
              disabled={!currentAlertSymbol || !alerts[currentAlertSymbol]}
            >
              清除预警
            </Button>
            <Switch
              checked={
                typeof alertModalEnabled === 'boolean'
                  ? alertModalEnabled
                  : currentAlertSymbol && alerts[currentAlertSymbol]
                    ? alerts[currentAlertSymbol].enabled !== false
                    : true
              }
              checkedChildren="开启"
              unCheckedChildren="暂停"
              disabled={!currentAlertSymbol}
              onChange={(checked): void => {
                form.setFieldValue('enabled', checked)
              }}
            />
          </Space>,
          <Button key="cancel" onClick={handleAlertModalCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleAlertModalOk}>
            保存
          </Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="enabled" hidden valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="触发条件" style={{ marginBottom: 12 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="type" noStyle rules={[{ required: true }]}>
                <Select style={{ width: 90 }}>
                  <Select.Option value="price">价格</Select.Option>
                  <Select.Option value="percent">涨跌幅</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="condition" noStyle rules={[{ required: true }]}>
                <Select style={{ width: 80 }}>
                  <Select.Option value="above">高于</Select.Option>
                  <Select.Option value="below">低于</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
              >
                {({ getFieldValue }): React.ReactNode => {
                  const type = getFieldValue('type')
                  return (
                    <Form.Item name="threshold" noStyle rules={[{ required: true, message: '请输入阈值' }]}>
                      {type === 'price' ? (
                        <InputNumber style={{ width: 'calc(100% - 170px)' }} precision={2} placeholder="目标价格" />
                      ) : (
                        <InputNumber style={{ width: 'calc(100% - 170px)' }} min={-20} max={20} step={0.1} placeholder="目标涨跌幅(%)" />
                      )}
                    </Form.Item>
                  )
                }}
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="触发控制" style={{ marginBottom: 12 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="cooldownSeconds" noStyle rules={[{ required: true, message: '请输入冷却时间' }]}>
                <InputNumber style={{ width: '50%' }} min={0} max={3600} step={1} placeholder="冷却(秒)" />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
              >
                {({ getFieldValue }): React.ReactNode => {
                  const type = getFieldValue('type')
                  return (
                    <Form.Item name="hysteresis" noStyle rules={[{ required: true, message: '请输入回撤阈值' }]}>
                      {type === 'price' ? (
                        <InputNumber style={{ width: '50%' }} min={0} max={10000} step={0.01} precision={2} placeholder="回撤(元)" />
                      ) : (
                        <InputNumber style={{ width: '50%' }} min={0} max={20} step={0.1} placeholder="回撤(%点)" />
                      )}
                    </Form.Item>
                  )
                }}
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item
            label="提醒文案"
            name="message"
            style={{ marginBottom: 12 }}
            rules={[{ required: true, max: 50, message: '文案不能为空，且最多 50 字' }]}
          >
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} maxLength={50} showCount placeholder="请输入提醒文案" />
          </Form.Item>
          <Form.Item label="提醒方式" name="method" style={{ marginBottom: 12 }} rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="popup">弹窗</Radio>
              <Radio value="sound">提示音</Radio>
              <Radio value="blink">托盘闪烁</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
