import React, { useEffect, useState } from 'react'
import {
  Collapse,
  Form,
  Select,
  Slider,
  InputNumber,
  Typography,
  Input,
  Spin,
  Segmented,
  Space
} from 'antd'

const { Title, Text } = Typography

type DisplayPreset = 'recommended' | 'stealth' | 'clear' | 'custom'

const PRESET_FIELDS = ['opacity', 'theme', 'fontSize', 'lineHeight', 'refreshRate', 'showChangePercent', 'showHighLow'] as const

const PRESETS: Record<Exclude<DisplayPreset, 'custom'>, Record<string, unknown>> = {
  recommended: {
    opacity: 80,
    theme: true,
    fontSize: 'medium',
    lineHeight: 1.5,
    refreshRate: 3,
    showChangePercent: true,
    showHighLow: false
  },
  stealth: {
    opacity: 35,
    theme: true,
    fontSize: 'small',
    lineHeight: 1.4,
    refreshRate: 5,
    showChangePercent: true,
    showHighLow: false
  },
  clear: {
    opacity: 90,
    theme: true,
    fontSize: 'large',
    lineHeight: 1.6,
    refreshRate: 3,
    showChangePercent: true,
    showHighLow: true
  }
}

function inferPreset(values: Record<string, any>): DisplayPreset {
  const pick = (obj: Record<string, any>): Record<string, any> =>
    Object.fromEntries(PRESET_FIELDS.map((k) => [k, obj[k]]))

  const picked = pick(values)

  const match = (presetKey: Exclude<DisplayPreset, 'custom'>): boolean => {
    const preset = pick(PRESETS[presetKey] as Record<string, any>)
    return PRESET_FIELDS.every((k) => preset[k] === picked[k])
  }

  if (match('recommended')) return 'recommended'
  if (match('stealth')) return 'stealth'
  if (match('clear')) return 'clear'
  return 'custom'
}

export function DisplayTab(): React.JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const displayPreset = Form.useWatch('displayPreset', form) as DisplayPreset | undefined
  const isApplyingPresetRef = React.useRef(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.api.store.get('settings')
        if (settings) {
          const next = { ...(settings as Record<string, unknown>) }
          const presetFromStore = (next as any).displayPreset as unknown
          const inferred = inferPreset(next as any)
          const normalizedPreset: DisplayPreset =
            presetFromStore === 'recommended' || presetFromStore === 'stealth' || presetFromStore === 'clear' || presetFromStore === 'custom'
              ? presetFromStore
              : inferred
          form.setFieldsValue({ ...next, displayPreset: normalizedPreset })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [form])

  const handleValuesChange = async (_changedValues: any, allValues: any) => {
    try {
      const currentSettings = (await window.api.store.get('settings')) || {}
      const changedKeys = Object.keys(_changedValues || {})
      const hasPresetRelatedChange = changedKeys.some((k) => (PRESET_FIELDS as readonly string[]).includes(k))

      if (!isApplyingPresetRef.current && hasPresetRelatedChange) {
        const currentPreset = form.getFieldValue('displayPreset') as DisplayPreset | undefined
        if (currentPreset && currentPreset !== 'custom') {
          isApplyingPresetRef.current = true
          form.setFieldValue('displayPreset', 'custom')
          const newSettings = { ...currentSettings, ...allValues, displayPreset: 'custom' }
          await window.api.store.set('settings', newSettings)
          isApplyingPresetRef.current = false
          return
        }
      }

      const newSettings = { ...currentSettings, ...allValues }
      await window.api.store.set('settings', newSettings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      if (isApplyingPresetRef.current) {
        isApplyingPresetRef.current = false
      }
    }
  }

  const applyPreset = async (presetKey: DisplayPreset): Promise<void> => {
    if (presetKey === 'custom') return
    try {
      const currentSettings = (await window.api.store.get('settings')) || {}
      const currentFormValues = form.getFieldsValue(true)
      const preset = PRESETS[presetKey]
      const newSettings = { ...currentSettings, ...currentFormValues, ...preset, displayPreset: presetKey }
      isApplyingPresetRef.current = true
      form.setFieldsValue({ ...preset, displayPreset: presetKey })
      await window.api.store.set('settings', newSettings)
    } catch (error) {
      console.error('Failed to apply preset:', error)
    } finally {
      isApplyingPresetRef.current = false
    }
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
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onValuesChange={handleValuesChange}
        initialValues={{
          displayPreset: 'recommended',
          theme: true,
          colorTheme: 'red-green',
          opacity: 80,
          showChangePercent: true,
          showHighLow: false,
          fontSize: 'medium',
          lineHeight: 1.5,
          refreshRate: 3,
          symbolFormat: 'full',
          nameFormat: 'full',
          priceFormat: 'price',
          changeFormat: 'red-green',
          bgColor: ''
        }}
      >
        <Title level={5} style={{ marginBottom: 8 }}>
          预设模板
        </Title>
        <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 12 }}>
          <Form.Item name="displayPreset" style={{ marginBottom: 0 }}>
            <Segmented
              options={[
                { label: '推荐', value: 'recommended' },
                { label: '隐蔽', value: 'stealth' },
                { label: '清晰', value: 'clear' },
                { label: '自定义', value: 'custom' }
              ]}
              onChange={(value) => applyPreset(value as DisplayPreset)}
            />
          </Form.Item>
          <Text type="secondary">
            {displayPreset === 'stealth'
              ? '透明度 35 · 字号 小 · 刷新 5s · 高低价 关'
              : displayPreset === 'clear'
                ? '透明度 90 · 字号 大 · 刷新 3s · 高低价 开'
                : displayPreset === 'recommended'
                  ? '透明度 80 · 字号 中 · 刷新 3s · 高低价 关'
                  : '已自定义'}
          </Text>
        </Space>

        <Collapse
          size="small"
          defaultActiveKey={['basic']}
          items={[
            {
              key: 'basic',
              label: '基本设置',
              children: (
                <>
                  <Form.Item label="深色模式" name="theme">
                    <Segmented
                      options={[
                        { label: '开启', value: true },
                        { label: '关闭', value: false }
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="涨跌颜色" name="colorTheme">
                    <Segmented
                      options={[
                        { label: '红涨绿跌 (中国大陆)', value: 'red-green' },
                        { label: '绿涨红跌 (国际)', value: 'green-red' }
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="悬浮窗透明度" name="opacity" extra="通过调节透明度，可方便上班使用">
                    <Slider min={1} max={100} marks={{ 1: '透明', 100: '不透明' }} />
                  </Form.Item>

                  <Form.Item
                    label="自定义背景色"
                    name="bgColor"
                    extra="可输入 HEX 色值 (如 #000000)，留空使用默认"
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder="默认透明黑/白背景" />
                  </Form.Item>
                </>
              )
            },
            {
              key: 'format',
              label: '信息显示格式',
              children: (
                <>
                  <Form.Item label="股票代码格式" name="symbolFormat">
                    <Select style={{ width: 120 }}>
                      <Select.Option value="full">完整代码</Select.Option>
                      <Select.Option value="last3">后三位</Select.Option>
                      <Select.Option value="last2">后两位</Select.Option>
                      <Select.Option value="none">不显示</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="股票名称格式" name="nameFormat">
                    <Select style={{ width: 120 }}>
                      <Select.Option value="full">完整名称</Select.Option>
                      <Select.Option value="first2">前两字</Select.Option>
                      <Select.Option value="first1">首字</Select.Option>
                      <Select.Option value="last2">后两字</Select.Option>
                      <Select.Option value="last1">尾字</Select.Option>
                      <Select.Option value="force4">固定四字</Select.Option>
                      <Select.Option value="none">不显示</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="价格显示格式" name="priceFormat">
                    <Segmented
                      options={[
                        { label: '仅价格', value: 'price' },
                        { label: '价格+涨跌幅', value: 'priceAndChange' },
                        { label: '不显示', value: 'none' }
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="涨跌额颜色" name="changeFormat" style={{ marginBottom: 0 }}>
                    <Select style={{ width: 150 }}>
                      <Select.Option value="red-green">随涨跌色</Select.Option>
                      <Select.Option value="black">纯黑白</Select.Option>
                      <Select.Option value="none">默认文字色</Select.Option>
                      <Select.Option value="custom">自定义颜色</Select.Option>
                    </Select>
                  </Form.Item>
                </>
              )
            },
            {
              key: 'layout',
              label: '布局与更新',
              children: (
                <>
                  <Form.Item label="显示涨跌幅" name="showChangePercent">
                    <Segmented
                      options={[
                        { label: '开启', value: true },
                        { label: '关闭', value: false }
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="显示最高/最低价" name="showHighLow">
                    <Segmented
                      options={[
                        { label: '开启', value: true },
                        { label: '关闭', value: false }
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="字体大小" name="fontSize">
                    <Segmented
                      options={[
                        { label: '小 (12px)', value: 'small' },
                        { label: '中 (14px)', value: 'medium' },
                        { label: '大 (16px)', value: 'large' }
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="行高" name="lineHeight">
                    <InputNumber min={1} max={3} step={0.1} />
                  </Form.Item>

                  <Form.Item label="刷新频率 (秒)" name="refreshRate" style={{ marginBottom: 0 }}>
                    <InputNumber min={1} max={60} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      最低 1 秒，推荐 3 秒
                    </Text>
                  </Form.Item>
                </>
              )
            }
          ]}
        />
      </Form>
    </div>
  )
}
