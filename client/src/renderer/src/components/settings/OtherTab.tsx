import React, { useEffect, useState } from 'react'
import { Form, Segmented, Typography, Spin } from 'antd'

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
        <Form.Item label="自动搜索模式" name="searchMode" extra="选择本地加密可以提高搜索速度和隐私保护。" style={{ marginBottom: 0 }}>
          <Segmented
            options={['本地加密', '远程加密']}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
