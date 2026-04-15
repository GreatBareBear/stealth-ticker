import React from 'react'
import { Tabs, ConfigProvider } from 'antd'
import { StocksTab } from '../components/settings/StocksTab'
import { DisplayTab } from '../components/settings/DisplayTab'
import { AdvancedTab } from '../components/settings/AdvancedTab'
import { ChartTab } from '../components/settings/ChartTab'
import { DashboardTab } from '../components/settings/DashboardTab'
import { MembershipTab } from '../components/settings/MembershipTab'
import { OtherTab } from '../components/settings/OtherTab'

function Settings(): React.JSX.Element {
  const items = [
    {
      key: '1',
      label: '自选股票',
      children: <StocksTab />
    },
    {
      key: '2',
      label: '显示',
      children: <DisplayTab />
    },
    {
      key: '3',
      label: '高级',
      children: <AdvancedTab />
    },
    {
      key: '4',
      label: '股价图',
      children: <ChartTab />
    },
    {
      key: '5',
      label: '数据看板',
      children: <DashboardTab />
    },
    {
      key: '6',
      label: '会员',
      children: <MembershipTab />
    },
    {
      key: '7',
      label: '其它',
      children: <OtherTab />
    }
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8
        },
        components: {
          Tabs: {
            horizontalMargin: '0 0 0 0'
          },
          Segmented: {
            itemSelectedBg: '#e6f4ff',
            itemSelectedColor: '#1677ff',
            trackBg: 'rgba(0,0,0,0.06)'
          }
        }
      }}
    >
      <div
        className="settingsPage"
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#f5f5f5',
          overflow: 'hidden'
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff', paddingTop: 8 }}>
          <Tabs
            defaultActiveKey="1"
            items={items}
            tabPosition="top"
            animated={{ inkBar: true, tabPane: true }}
            size="small"
            tabBarStyle={{ padding: '0 24px', margin: 0 }}
          />
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Settings
