import React from 'react'
import { Form, Select } from 'antd'

export function OtherTab(): React.JSX.Element {
  return (
    <div style={{ padding: '24px' }}>
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="自动搜索模式">
          <Select
            defaultValue="本地加密"
            options={[
              { value: '本地加密', label: '本地加密' },
              { value: '远程加密', label: '远程加密' }
            ]}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
