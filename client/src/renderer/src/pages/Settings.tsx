import React from 'react'
import { Tabs, ConfigProvider, Button } from 'antd'
import { StocksTab } from '../components/settings/StocksTab'
import { DisplayTab } from '../components/settings/DisplayTab'
import { AdvancedTab } from '../components/settings/AdvancedTab'
import { MembershipTab } from '../components/settings/MembershipTab'
import { ChartTab } from '../components/settings/ChartTab'
import { OtherTab } from '../components/settings/OtherTab'
import { DashboardTab } from '../components/settings/DashboardTab'

function Settings(): React.JSX.Element {
  const items = [
    {
      key: '1',
      label: '自选股票',
      children: <StocksTab />
    },
    {
      key: '2',
      label: '会员',
      children: <MembershipTab />
    },
    {
      key: '3',
      label: '显示',
      children: <DisplayTab />
    },
    {
      key: '4',
      label: '高级',
      children: <AdvancedTab />
    },
    {
      key: '5',
      label: '股价图',
      children: <ChartTab />
    },
    {
      key: '6',
      label: '其他',
      children: <OtherTab />
    },
    {
      key: '7',
      label: '数据看板',
      children: <DashboardTab />
    }
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8
        }
      }}
    >
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#f5f5f5',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '12px 24px 4px 24px',
            background: '#fff',
            flexShrink: 0
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>设置</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
          <Tabs
            defaultActiveKey="1"
            items={items}
            tabPosition="top"
            animated={{ inkBar: true, tabPane: true }}
            tabBarStyle={{ padding: '0 24px', margin: 0 }}
          />
        </div>
        <div
          style={{
            padding: '12px 24px',
            background: '#fff',
            borderTop: '1px solid #e8e8e8',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            flexShrink: 0
          }}
        >
          <Button
            onClick={() => window.close()}
            style={{
              padding: '4px 16px',
              borderRadius: '6px'
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => window.close()}
            style={{
              padding: '4px 16px',
              borderRadius: '6px'
            }}
          >
            确定
          </Button>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Settings
