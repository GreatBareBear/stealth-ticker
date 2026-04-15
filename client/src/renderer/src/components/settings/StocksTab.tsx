import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Popconfirm, Switch, message, Select, Spin, Modal, Form, Radio, InputNumber, Input, Space, Tooltip } from 'antd'
import { PlusOutlined, DeleteOutlined, DragOutlined, BellOutlined, BellFilled } from '@ant-design/icons'
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

export function StocksTab(): React.JSX.Element {
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

  const fetchRef = useRef<number>(0)

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const savedAlerts = await window.api.store.get('alerts')
        if (savedAlerts && typeof savedAlerts === 'object') {
          let hasLegacyAlert = false
          const normalizedAlerts = Object.fromEntries(
            Object.entries(savedAlerts as Record<string, Partial<AlertConfig>>).map(([symbol, config]) => {
              const safeConfig = config && typeof config === 'object' ? config : {}
              if (config && typeof config === 'object' && typeof config.enabled !== 'boolean') {
                hasLegacyAlert = true
              }
              return [symbol, { ...(safeConfig as AlertConfig), enabled: safeConfig.enabled !== false }]
            })
          ) as Record<string, AlertConfig>
          setAlerts(normalizedAlerts)
          if (hasLegacyAlert) {
            await window.api.store.set('alerts', normalizedAlerts)
          }
        }

        const savedAlertsGlobalPaused = await window.api.store.get('alertsGlobalPaused')
        if (typeof savedAlertsGlobalPaused === 'boolean') {
          setAlertsGlobalPaused(savedAlertsGlobalPaused)
        }

        const savedStocks = await window.api.store.get('stocks')
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
      await window.api.store.set('alerts', newAlerts)
    } catch (error) {
      console.error('Failed to save alerts:', error)
    }
  }

  const saveAlertsGlobalPaused = async (paused: boolean): Promise<void> => {
    setAlertsGlobalPaused(paused)
    try {
      await window.api.store.set('alertsGlobalPaused', paused)
    } catch (error) {
      console.error('Failed to save alertsGlobalPaused:', error)
    }
  }

  const openAlertModal = (record: Stock): void => {
    setCurrentAlertSymbol(record.symbol)
    const existingAlert = alerts[record.symbol]
    if (existingAlert) {
      form.setFieldsValue({ ...existingAlert, enabled: existingAlert.enabled !== false })
    } else {
      form.setFieldsValue({
        type: 'price',
        condition: 'above',
        threshold: undefined,
        message: `\${股票名称}当前价格\${价格}已突破\${阈值}`,
        method: 'popup',
        enabled: true
      })
    }
    setIsAlertModalVisible(true)
  }

  const handleAlertModalOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields()
      if (currentAlertSymbol) {
        const newAlerts = {
          ...alerts,
          [currentAlertSymbol]: { ...(values as AlertConfig), enabled: values.enabled !== false }
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
      await window.api.store.set('stocks', newStocks)
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

  return (
    <div style={{ padding: '0 16px' }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 8,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
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
        <Space size="small">
          <span>全部预警</span>
          <Switch
            checked={!alertsGlobalPaused}
            checkedChildren="启用"
            unCheckedChildren="暂停"
            onChange={(checked): void => {
              saveAlertsGlobalPaused(!checked)
            }}
          />
        </Space>
      </div>
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

      <Modal
        title="预警设置"
        width={400}
        open={isAlertModalVisible}
        onOk={handleAlertModalOk}
        onCancel={handleAlertModalCancel}
        destroyOnClose
        footer={[
          <Button
            key="delete"
            danger
            onClick={() => {
              if (currentAlertSymbol) {
                handleDeleteAlert(currentAlertSymbol)
                setIsAlertModalVisible(false)
              }
            }}
            style={{ float: 'left' }}
            disabled={!currentAlertSymbol || !alerts[currentAlertSymbol]}
          >
            清除预警
          </Button>,
          <Button key="cancel" onClick={handleAlertModalCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleAlertModalOk}>
            保存
          </Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="启用预警"
            name="enabled"
            valuePropName="checked"
            style={{ marginBottom: 12 }}
          >
            <Switch checkedChildren="启用" unCheckedChildren="暂停" />
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

          <Form.Item label="提醒文案" name="message" style={{ marginBottom: 12 }} rules={[{ required: true, max: 50, message: '文案不能为空，且最多 50 字' }]}>
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
