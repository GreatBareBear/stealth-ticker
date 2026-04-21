
import React, { useEffect, useState } from 'react'
import { Form, Select, Typography, Spin } from 'antd'

const { Title } = Typography


export function ChartTab({ store = window?.api?.store || { get: async () => null, set: async () => {}, delete: async () => {} } }: { store?: any }): React.JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await store.get('chartSettings')
        if (settings) {
          form.setFieldsValue(settings)
        }
      } catch (error) {
        console.error('Failed to load chart settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [form])

  const handleValuesChange = async (_changedValues: any, allValues: any) => {
    try {
      const currentSettings = (await store.get('chartSettings')) || {}
      const newSettings = { ...currentSettings, ...allValues }
      await store.set('chartSettings', newSettings)
    } catch (error) {
      console.error('Failed to save chart settings:', error)
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
          chartType: '分时图',
          background: '同主界面',
          opacity: '同主界面'
        }}
      >
        <Title level={5}>图表设置</Title>
        <Form.Item label="股价图显示内容" name="chartType">
          <Select
            options={[
              { value: '分时图', label: '分时图' },
              { value: '日K线', label: '日K线' },
              { value: '5日线', label: '5日线' },
              { value: '周K线', label: '周K线' },
              { value: '月K线', label: '月K线' },
              { value: '1分钟', label: '1分钟' },
              { value: '5分钟', label: '5分钟' },
              { value: '15分钟', label: '15分钟' },
              { value: '30分钟', label: '30分钟' },
              { value: '60分钟', label: '60分钟' }
            ]}
          />
        </Form.Item>
        <Form.Item label="背景" name="background">
          <Select
            options={[
              { value: '同主界面', label: '同主界面' },
              { value: '白色', label: '白色' },
              { value: '黑色', label: '黑色' },
              { value: '透明', label: '透明' }
            ]}
          />
        </Form.Item>
        <Form.Item label="透明度" name="opacity" style={{ marginBottom: 0 }}>
          <Select
            options={[
              { value: '同主界面', label: '同主界面' },
              { value: '30%', label: '30%' },
              { value: '50%', label: '50%' },
              { value: '70%', label: '70%' },
              { value: '100%', label: '100%' }
            ]}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
