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
  Spin,
  Segmented,
  Divider
} from 'antd'

const { Title, Text } = Typography

export function AdvancedTab(): React.JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        const settings: any = await window.api.store.get('settings')
        if (settings) {
          form.setFieldsValue({
            ...settings,
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
        bossKeyEnabled: false,
        bossKeyModifier: 'CommandOrControl',
        bossKey: 'X',
        bossKeyAction: 'hide',
        bossKeyCombo: 'CommandOrControl+X',
        alwaysOnTop: true,
        showTrayIcon: true,
        enableContextMenu: true,
        ghostMode: true
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
    <div style={{ padding: '0 16px' }}>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onValuesChange={handleValuesChange}
        initialValues={{
          bossKeyEnabled: false,
          bossKeyModifier: 'CommandOrControl',
          bossKey: 'X',
          bossKeyAction: 'hide',
          alwaysOnTop: true,
          showTrayIcon: true,
          enableContextMenu: true,
          ghostMode: true
        }}
      >
        <Title level={5}>行为与控制</Title>
        <Form.Item label="幽灵模式" name="ghostMode">
          <Segmented
            options={[
              { label: '开启', value: true },
              { label: '关闭', value: false }
            ]}
          />
        </Form.Item>

        <Form.Item label="总在最前" name="alwaysOnTop">
          <Segmented
            options={[
              { label: '开启', value: true },
              { label: '关闭', value: false }
            ]}
          />
        </Form.Item>

        <Form.Item label="显示通知区图标" name="showTrayIcon">
          <Segmented
            options={[
              { label: '开启', value: true },
              { label: '关闭', value: false }
            ]}
          />
        </Form.Item>

        <Form.Item label="开启页面右键" name="enableContextMenu">
          <Segmented
            options={[
              { label: '开启', value: true },
              { label: '关闭', value: false }
            ]}
          />
        </Form.Item>

        <Divider />
        <Title level={5}>快捷键</Title>
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


        <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ marginBottom: 0 }}>
          <Button onClick={handleReset}>一键重置(R)</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
