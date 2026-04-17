import React from 'react'
import { Tabs } from 'antd'
import { ChartTab } from './ChartTab'
import { DashboardTab } from './DashboardTab'
import { MembershipTab } from './MembershipTab'

export function DataTab(): React.JSX.Element {
  const items = [
    {
      key: 'chart',
      label: '股价图',
      children: <ChartTab />
    },
    {
      key: 'dashboard',
      label: '数据看板',
      children: <DashboardTab />
    },
    {
      key: 'membership',
      label: '会员',
      children: <MembershipTab />
    }
  ]

  return (
    <div style={{ padding: '0 16px' }}>
      <Tabs
        defaultActiveKey="chart"
        items={items}
        tabPosition="top"
        size="small"
        tabBarStyle={{ padding: 0, margin: 0 }}
      />
    </div>
  )
}

