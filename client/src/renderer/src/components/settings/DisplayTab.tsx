import React, { useEffect, useState } from 'react'
import {
  Form,
  Select,
  Slider,
  InputNumber,
  Divider,
  Typography,
  Input,
  Spin,
  Segmented
} from 'antd'

const { Title, Text } = Typography

export function DisplayTab(): React.JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.api.store.get('settings')
        if (settings) {
          form.setFieldsValue(settings)
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
      const newSettings = { ...currentSettings, ...allValues }
      await window.api.store.set('settings', newSettings)
    } catch (error) {
      console.error('Failed to save settings:', error)
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
        <Title level={5}>基本设置</Title>
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
          <Slider min={10} max={100} marks={{ 10: '透明', 100: '不透明' }} />
        </Form.Item>

        <Form.Item
          label="自定义背景色"
          name="bgColor"
          extra="可输入 HEX 色值 (如 #000000)，留空使用默认"
        >
          <Input placeholder="默认透明黑/白背景" />
        </Form.Item>

        <Divider />
        <Title level={5}>信息显示格式</Title>

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

        <Form.Item label="涨跌额颜色" name="changeFormat">
          <Select style={{ width: 150 }}>
            <Select.Option value="red-green">随涨跌色</Select.Option>
            <Select.Option value="black">纯黑白</Select.Option>
            <Select.Option value="none">默认文字色</Select.Option>
            <Select.Option value="custom">自定义颜色</Select.Option>
          </Select>
        </Form.Item>

        <Divider />
        <Title level={5}>布局与更新</Title>

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
      </Form>
    </div>
  )
}
