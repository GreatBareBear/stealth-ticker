import React, { useEffect, useState } from 'react'
import { Table, Button, Popconfirm, Switch, Spin, Modal, Form, Radio, InputNumber, Input, Space, Tooltip } from 'antd'
import { BellOutlined, BellFilled } from '@ant-design/icons'
import type { AlertConfig, Stock } from './StocksTab'

export function AlertsTab(): React.JSX.Element {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [alerts, setAlerts] = useState<Record<string, AlertConfig>>({})
  const [alertsGlobalPaused, setAlertsGlobalPaused] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [isAlertModalVisible, setIsAlertModalVisible] = useState<boolean>(false)
  const [currentAlertSymbol, setCurrentAlertSymbol] = useState<string | null>(null)
  const [form] = Form.useForm()
  const alertModalEnabled = Form.useWatch('enabled', form)

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
        }
      } catch {
        setStocks([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const saveAlerts = async (newAlerts: Record<string, AlertConfig>): Promise<void> => {
    setAlerts(newAlerts)
    await window.api.store.set('alerts', newAlerts)
  }

  const saveAlertsGlobalPaused = async (paused: boolean): Promise<void> => {
    setAlertsGlobalPaused(paused)
    await window.api.store.set('alertsGlobalPaused', paused)
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

  const columns = [
    {
      title: '股票',
      key: 'stock',
      render: (_: unknown, record: Stock): React.JSX.Element => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 500 }}>{record.name}</span>
          <span style={{ color: '#8c8c8c', fontSize: 12 }}>{record.symbol}</span>
        </div>
      )
    },
    {
      title: '状态',
      key: 'status',
      width: 72,
      render: (_: unknown, record: Stock): React.JSX.Element => {
        const alert = alerts[record.symbol]
        if (!alert) return <BellOutlined style={{ color: '#bfbfbf' }} />
        if (alertsGlobalPaused || alert.enabled === false) return <BellFilled style={{ color: '#bfbfbf' }} />
        return <BellFilled style={{ color: '#faad14' }} />
      }
    },
    {
      title: '启用',
      key: 'enabled',
      width: 84,
      render: (_: unknown, record: Stock): React.JSX.Element => {
        const alert = alerts[record.symbol]
        return (
          <Tooltip title={alert ? (alert.enabled !== false ? '暂停预警' : '恢复预警') : '未设置预警'}>
            <Switch
              size="small"
              checked={!!alert && alert.enabled !== false}
              disabled={!alert || alertsGlobalPaused}
              onChange={(checked): void => {
                handleAlertEnabledChange(record.symbol, checked)
              }}
            />
          </Tooltip>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: Stock): React.JSX.Element => (
        <Space size="small">
          <Button size="small" onClick={() => openAlertModal(record)}>
            设置
          </Button>
          <Popconfirm
            title="确定清除该股票预警吗？"
            onConfirm={(): void => {
              handleDeleteAlert(record.symbol)
            }}
            okText="是"
            cancelText="否"
            disabled={!alerts[record.symbol]}
          >
            <Button size="small" danger disabled={!alerts[record.symbol]}>
              清除
            </Button>
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
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#595959' }}>在自选股票列表也可快速设置单支预警</span>
        <Space size="small">
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
      </div>

      <Table
        dataSource={stocks}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        scroll={{ y: 360 }}
      />

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
                <Radio.Group optionType="button" buttonStyle="solid">
                  <Radio value="price">价格</Radio>
                  <Radio value="percent">涨跌幅</Radio>
                </Radio.Group>
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }): React.ReactNode => {
              const type = getFieldValue('type')
              return (
                <Form.Item label="条件" style={{ marginBottom: 12 }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name="condition" noStyle rules={[{ required: true }]}>
                      <Radio.Group optionType="button" buttonStyle="solid">
                        <Radio value="above">高于</Radio>
                        <Radio value="below">低于</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item name="threshold" noStyle rules={[{ required: true, message: '请输入阈值' }]}>
                      {type === 'price' ? (
                        <InputNumber style={{ width: '100%' }} precision={2} placeholder="目标价格" />
                      ) : (
                        <InputNumber style={{ width: '100%' }} min={-20} max={20} step={0.1} placeholder="目标涨跌幅(%)" />
                      )}
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item
            label="提醒文案"
            name="message"
            style={{ marginBottom: 12 }}
            rules={[{ required: true, max: 50, message: '文案不能为空，且最多 50 字' }]}
          >
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} maxLength={50} showCount placeholder="请输入提醒文案" />
          </Form.Item>

          <Form.Item label="提醒方式" name="method" style={{ marginBottom: 0 }} rules={[{ required: true }]}>
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

