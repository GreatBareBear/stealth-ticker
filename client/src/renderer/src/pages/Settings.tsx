import React, { useEffect, useRef, useState, createContext, useContext } from 'react'
import { Tabs, ConfigProvider, Button, Space } from 'antd'
import { StocksTab } from '../components/settings/StocksTab'
import { DisplayTab } from '../components/settings/DisplayTab'
import { AdvancedTab } from '../components/settings/AdvancedTab'
import { ChartTab } from '../components/settings/ChartTab'
import { DashboardTab } from '../components/settings/DashboardTab'
import { MembershipTab } from '../components/settings/MembershipTab'

export const StoreContext = createContext<any>(null)
export const useStore = () => useContext(StoreContext) || window.api.store

function Settings(): React.JSX.Element {
  const [resetKey, setResetKey] = useState(0)
  const originalStore = window.api.store
  const draftState = useRef({
    drafts: {} as Record<string, any>,
    deleted: new Set<string>()
  })

  const proxyStore = {
    get: async (key: string) => {
      if (draftState.current.deleted.has(key)) return undefined
      if (key in draftState.current.drafts) return draftState.current.drafts[key]
      return await originalStore.get(key)
    },
    set: async (key: string, value: any) => {
      draftState.current.drafts[key] = value
      draftState.current.deleted.delete(key)
    },
    delete: async (key: string) => {
      delete draftState.current.drafts[key]
      draftState.current.deleted.add(key)
    }
  }

  useEffect(() => {
    const ipcRenderer = (window as any).electron.ipcRenderer

    const handleShown = () => {
      draftState.current.drafts = {}
      draftState.current.deleted.clear()
      setResetKey(Date.now())
    }

    const handleClosed = () => {
      draftState.current.drafts = {}
      draftState.current.deleted.clear()
    }

    ipcRenderer.on('settings-shown', handleShown)
    ipcRenderer.on('settings-closed', handleClosed)

    return () => {
      ipcRenderer.removeListener('settings-shown', handleShown)
      ipcRenderer.removeListener('settings-closed', handleClosed)
    }
  }, [])

  const handleConfirm = async () => {
    try {
      for (const key of Array.from(draftState.current.deleted)) {
        await originalStore.delete(key)
      }
      for (const [key, value] of Object.entries(draftState.current.drafts)) {
        await originalStore.set(key, value)
      }
      draftState.current.drafts = {}
      draftState.current.deleted.clear()
      ;(window as any).electron.ipcRenderer.send('close-settings-window')
    } catch (error) {
      console.error('Failed to save settings', error)
    }
  }

  const handleCancel = () => {
    draftState.current.drafts = {}
    draftState.current.deleted.clear()
    ;(window as any).electron.ipcRenderer.send('close-settings-window')
  }

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
        <StoreContext.Provider value={proxyStore}>
          <div key={resetKey} style={{ flex: 1, overflowY: 'auto', background: '#fff', paddingTop: 8 }}>
            <Tabs
              defaultActiveKey="1"
              items={items}
              tabPosition="top"
              animated={{ inkBar: true, tabPane: true }}
              size="small"
              tabBarStyle={{ padding: '0 24px', margin: 0 }}
            />
          </div>
        </StoreContext.Provider>
        <div
          style={{
            padding: '12px 24px',
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={handleConfirm}>
              确定
            </Button>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Settings
