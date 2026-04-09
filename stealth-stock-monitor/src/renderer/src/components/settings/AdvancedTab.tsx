import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Radio,
  Typography,
  Space,
  message,
  Spin
} from 'antd'

const { Text } = Typography

export function AdvancedTab(): React.JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        const settings: any = await window.api.store.get('settings')
        if (settings) {
          let refreshInterval = settings.refreshInterval || '120'
          if (parseInt(refreshInterval, 10) < 120) {
            refreshInterval = '120'
          }

          form.setFieldsValue({
            ...settings,
            refreshInterval,
            bossKey: settings.bossKey || 'X',
            bossKeyModifier: settings.bossKeyModifier || 'CommandOrControl',
            bossKeyAction: settings.bossKeyAction || 'hide'
          })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [form])

  const handleValuesChange = async (
    _changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>
  ): Promise<void> => {
    try {
      if (_changedValues.refreshInterval !== undefined) {
        const interval = parseInt(_changedValues.refreshInterval as string, 10)
        if (interval < 120) {
          message.warning('免费版刷新间隔最低为 120 秒。')
          form.setFieldsValue({ refreshInterval: '120' })
          allValues.refreshInterval = '120'
        }
      }

      const currentSettings: any = (await window.api.store.get('settings')) || {}

      let bossKeyCombo = currentSettings.bossKeyCombo
      if (allValues.bossKeyModifier && allValues.bossKey) {
        const modifier = allValues.bossKeyModifier as string
        const key = (allValues.bossKey as string).toUpperCase()
        bossKeyCombo = `${modifier}+${key}`
      }

      const newSettings = { ...currentSettings, ...allValues, bossKeyCombo }
      await window.api.store.set('settings', newSettings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const handleReset = async (): Promise<void> => {
    try {
      const defaultSettings = {
        fontSize: '14',
        lineHeight: '1.5',
        backgroundColor: '#000000',
        opacity: '0.8',
        refreshInterval: '120',
        bossKeyEnabled: false,
        bossKeyModifier: 'CommandOrControl',
        bossKey: 'X',
        bossKeyAction: 'hide',
        bossKeyCombo: 'CommandOrControl+X',
        alwaysOnTop: true,
        showTrayIcon: true
      }
      form.setFieldsValue(defaultSettings)
      const currentSettings = (await window.api.store.get('settings')) || {}
      await window.api.store.set('settings', { ...currentSettings, ...defaultSettings })
      message.success('已重置为默认设置')
    } catch (error) {
      console.error('Failed to reset settings:', error)
      message.error('重置失败')
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
    <div style={{ padding: '0 16px', overflowY: 'auto', maxHeight: '100%' }}>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onValuesChange={handleValuesChange}
        initialValues={{
          fontSize: '14',
          lineHeight: '1.5',
          backgroundColor: '#000000',
          opacity: '0.8',
          refreshInterval: '120',
          bossKeyEnabled: false,
          bossKeyModifier: 'CommandOrControl',
          bossKey: 'X',
          bossKeyAction: 'hide',
          alwaysOnTop: true,
          showTrayIcon: true
        }}
      >
        <Form.Item label="文字大小" name="fontSize">
          <Select style={{ width: 120 }}>
            <Select.Option value="12">12</Select.Option>
            <Select.Option value="14">14</Select.Option>
            <Select.Option value="16">16</Select.Option>
            <Select.Option value="18">18</Select.Option>
            <Select.Option value="20">20</Select.Option>
            <Select.Option value="24">24</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="行距" name="lineHeight">
          <Select style={{ width: 120 }}>
            <Select.Option value="1">1.0</Select.Option>
            <Select.Option value="1.2">1.2</Select.Option>
            <Select.Option value="1.5">1.5</Select.Option>
            <Select.Option value="1.8">1.8</Select.Option>
            <Select.Option value="2">2.0</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="背景颜色" name="backgroundColor">
          <Input type="color" style={{ width: 60, padding: 0, cursor: 'pointer', height: 32 }} />
        </Form.Item>

        <Form.Item label="透明度" name="opacity">
          <Select style={{ width: 120 }}>
            <Select.Option value="0.2">20%</Select.Option>
            <Select.Option value="0.4">40%</Select.Option>
            <Select.Option value="0.6">60%</Select.Option>
            <Select.Option value="0.8">80%</Select.Option>
            <Select.Option value="1">100%</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="刷新间隔" name="refreshInterval">
          <Select style={{ width: 120 }}>
            <Select.Option value="1">1秒</Select.Option>
            <Select.Option value="3">3秒</Select.Option>
            <Select.Option value="5">5秒</Select.Option>
            <Select.Option value="10">10秒</Select.Option>
            <Select.Option value="30">30秒</Select.Option>
            <Select.Option value="60">60秒</Select.Option>
            <Select.Option value="120">120秒</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="老板键">
          <Space>
            <Form.Item name="bossKeyEnabled" valuePropName="checked" noStyle>
              <Checkbox />
            </Form.Item>
            <Form.Item name="bossKeyModifier" noStyle>
              <Select style={{ width: 100 }}>
                <Select.Option value="CommandOrControl">Ctrl/Cmd</Select.Option>
                <Select.Option value="Alt">Alt</Select.Option>
                <Select.Option value="Shift">Shift</Select.Option>
              </Select>
            </Form.Item>
            <Text>+</Text>
            <Form.Item name="bossKey" noStyle>
              <Input
                style={{ width: 60, textTransform: 'uppercase' }}
                maxLength={1}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase()
                  form.setFieldsValue({ bossKey: e.target.value })
                }}
              />
            </Form.Item>
            <Form.Item name="bossKeyAction" noStyle>
              <Radio.Group>
                <Radio value="hide">隐藏</Radio>
                <Radio value="exit">退出</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item label="总在最前" name="alwaysOnTop" valuePropName="checked">
          <Checkbox />
        </Form.Item>

        <Form.Item label="显示通知区图标" name="showTrayIcon" valuePropName="checked">
          <Checkbox />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button onClick={handleReset}>一键重置(R)</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
