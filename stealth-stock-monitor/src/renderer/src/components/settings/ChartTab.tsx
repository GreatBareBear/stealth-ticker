import React from 'react'
import { Form, Select } from 'antd'

export function ChartTab(): React.JSX.Element {
  return (
    <div style={{ padding: '24px' }}>
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="股价图显示内容">
          <Select
            defaultValue="分时图"
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
        <Form.Item label="背景">
          <Select
            defaultValue="同主界面"
            options={[
              { value: '同主界面', label: '同主界面' },
              { value: '白色', label: '白色' },
              { value: '黑色', label: '黑色' },
              { value: '透明', label: '透明' }
            ]}
          />
        </Form.Item>
        <Form.Item label="透明度">
          <Select
            defaultValue="同主界面"
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
