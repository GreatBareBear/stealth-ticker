import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, message, Popconfirm, Segmented, Typography, Spin } from 'antd'

const { Title } = Typography

export function OtherTab(): React.JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.api.store.get('otherSettings')
        if (settings) {
          form.setFieldsValue(settings)
        }
      } catch (error) {
        console.error('Failed to load other settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [form])

  const handleValuesChange = async (_changedValues: any, allValues: any) => {
    try {
      const currentSettings = (await window.api.store.get('otherSettings')) || {}
      const newSettings = { ...currentSettings, ...allValues }
      await window.api.store.set('otherSettings', newSettings)
    } catch (error) {
      console.error('Failed to save other settings:', error)
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
          searchMode: '本地加密'
        }}
      >
        <Title level={5}>搜索设置</Title>
        <Form.Item
          label="自动搜索模式"
          name="searchMode"
          extra="选择本地加密可以提高搜索速度和隐私保护。"
          style={{ marginBottom: 0 }}
        >
          <Segmented options={['本地加密', '远程加密']} />
        </Form.Item>

        <Divider />
        <Title level={5}>数据与隐私</Title>
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
      </Form>
    </div>
  )
}
