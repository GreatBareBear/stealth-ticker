import React, { useEffect, useState } from 'react'
import { Form, Segmented, Typography, message, Spin, Tag, Divider } from 'antd'

const { Title } = Typography
const { CheckableTag } = Tag

const COLUMN_OPTIONS = [
  { label: '市价', value: 'price' },
  { label: '分时预览', value: 'timeline' },
  { label: '持仓价', value: 'cost_price' },
  { label: '持仓数', value: 'position_count' },
  { label: '持仓金额', value: 'position_value' },
  { label: '涨跌幅', value: 'change_percent' },
  { label: '涨跌金额', value: 'change_amount' },
  { label: '换手率', value: 'turnover_rate' },
  { label: '当天收益', value: 'today_profit' },
  { label: '收益率', value: 'profit_rate' },
  { label: '总收益', value: 'total_profit' }
]

interface DashboardConfig {
  columns: string[]
  showTopIndex: boolean
}

const DEFAULT_CONFIG: DashboardConfig = {
  columns: ['price', 'change_percent'],
  showTopIndex: true
}

export function DashboardTab(): React.JSX.Element {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_CONFIG)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async (): Promise<void> => {
    try {
      const savedConfig = await window.api.store.get<DashboardConfig>('dashboard')
      if (savedConfig) {
        setConfig({ ...DEFAULT_CONFIG, ...savedConfig })
      }
    } catch (error) {
      console.error('Failed to load dashboard config:', error)
      message.error('加载看板设置失败')
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async (newConfig: DashboardConfig): Promise<void> => {
    setConfig(newConfig)
    try {
      await window.api.store.set('dashboard', newConfig)
    } catch (error) {
      console.error('Failed to save dashboard config:', error)
      message.error('保存看板设置失败')
    }
  }

  const handleColumnChange = (tag: string, checked: boolean): void => {
    const nextSelectedTags = checked
      ? [...config.columns, tag]
      : config.columns.filter((t) => t !== tag)
    saveConfig({ ...config, columns: nextSelectedTags })
  }

  const handleShowTopIndexChange = (value: boolean): void => {
    saveConfig({ ...config, showTopIndex: value })
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin />
      </div>
    )
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Title level={5}>大盘设置</Title>
        <Form.Item label="是否显示顶部大盘">
          <Segmented
            options={[
              { label: '显示', value: true },
              { label: '隐藏', value: false }
            ]}
            value={config.showTopIndex}
            onChange={handleShowTopIndexChange}
          />
        </Form.Item>

        <Divider />

        <Title level={5}>自定义列</Title>
        <Form.Item 
          label="展示列" 
          extra="选择股票展示的列，开启列的多少会影响面板的宽度"
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {COLUMN_OPTIONS.map((option) => (
              <CheckableTag
                key={option.value}
                checked={config.columns.includes(option.value)}
                onChange={(checked) => handleColumnChange(option.value, checked)}
                style={{
                  border: '1px solid #d9d9d9',
                  padding: '4px 12px',
                  fontSize: '14px',
                  borderRadius: '4px'
                }}
              >
                {option.label}
              </CheckableTag>
            ))}
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
