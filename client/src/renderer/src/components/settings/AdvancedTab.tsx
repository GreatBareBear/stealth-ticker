import React, { useEffect, useRef, useState } from 'react'
import {
  Collapse,
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
  Divider,
  Popconfirm
} from 'antd'

const { Text } = Typography

export function AdvancedTab(): React.JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const settingsRef = useRef<Record<string, any>>({})
  const lastSavePromise = useRef<Promise<void>>(Promise.resolve())

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        const settings: any = await window.api.store.get('settings')
        settingsRef.current = (settings || {}) as Record<string, any>
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

  const handleValuesChange = (
    _changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>
  ): void => {
    try {
      settingsRef.current = { ...settingsRef.current, ...allValues }

      let bossKeyCombo = settingsRef.current.bossKeyCombo
      if (settingsRef.current.bossKeyModifier && settingsRef.current.bossKey) {
        const modifier = String(settingsRef.current.bossKeyModifier)
        const key = String(settingsRef.current.bossKey).toUpperCase()
        bossKeyCombo = `${modifier}+${key}`
      }

      settingsRef.current = { ...settingsRef.current, bossKeyCombo }

      lastSavePromise.current = lastSavePromise.current
        .then(() => window.api.store.set('settings', settingsRef.current))
        .catch((error) => {
          console.error('Failed to save settings:', error)
        })
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
        ghostMode: true,
        searchMode: '本地加密'
      }
      form.setFieldsValue(defaultSettings)
      const currentSettings = (await window.api.store.get('settings')) || {}
      settingsRef.current = { ...(currentSettings as Record<string, any>), ...defaultSettings }
      await window.api.store.set('settings', settingsRef.current)
      message.success('已重置为默认设置')
    } catch (error) {
      console.error('Failed to reset settings:', error)
      message.error('重置失败')
    }
  }

  const handleClearData = async (): Promise<void> => {
    try {
      await window.api.store.delete('stocks')
      await window.api.store.delete('alerts')
      await window.api.store.delete('alertsGlobalPaused')
      await window.api.store.delete('alertsTempPausedUntil')
      await window.api.store.delete('alertsDndEnabled')
      await window.api.store.delete('alertsDndStart')
      await window.api.store.delete('alertsDndEnd')
      await window.api.store.delete('alertsDndAllowedMethods')
      message.success('清理完成')
    } catch (error) {
      console.error('Failed to clear data:', error)
      message.error('清理失败')
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
        <Collapse
          size="small"
          defaultActiveKey={['behavior']}
          items={[
            {
              key: 'behavior',
              label: '行为与控制',
              children: (
                <>
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

                  <Form.Item label="开启页面右键" name="enableContextMenu" style={{ marginBottom: 0 }}>
                    <Segmented
                      options={[
                        { label: '开启', value: true },
                        { label: '关闭', value: false }
                      ]}
                    />
                  </Form.Item>
                </>
              )
            },
            {
              key: 'privacy',
              label: '数据与隐私',
              children: (
                <>
                  <Form.Item
                    label="自动搜索模式"
                    name="searchMode"
                    extra="选择本地加密可以提高搜索速度和隐私保护。"
                  >
                    <Segmented options={['本地加密', '远程加密']} />
                  </Form.Item>
                  <Form.Item
                    label="一键清理数据"
                    extra="将清除自选股、提醒、免打扰等设置，且无法恢复。"
                    style={{ marginBottom: 0 }}
                  >
                    <Popconfirm
                      title="确认清理数据？将清除自选股、提醒、免打扰等设置，且无法恢复。"
                      okText="确认清理"
                      cancelText="取消"
                      onConfirm={handleClearData}
                    >
                      <Button danger type="primary">
                        一键清理数据
                      </Button>
                    </Popconfirm>
                  </Form.Item>
                </>
              )
            },
            {
              key: 'hotkey',
              label: '快捷键',
              children: (
                <Form.Item label="老板键" style={{ marginBottom: 0 }}>
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
              )
            }
          ]}
        />

        <Divider style={{ margin: '12px 0 0 0' }} />
        <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ marginBottom: 0, marginTop: 12 }}>
          <Button onClick={handleReset}>一键重置(R)</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
