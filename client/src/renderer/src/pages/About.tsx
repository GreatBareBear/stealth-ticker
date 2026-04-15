import React from 'react'
import { Button, Divider, Typography, Space, ConfigProvider } from 'antd'
import icon from '../../../../resources/icon.png'

const { Title, Text } = Typography

function ContactRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Text style={{ width: 60, flexShrink: 0 }}>{label}</Text>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          background: '#fafafa'
        }}
      >
        <Text ellipsis={{ tooltip: value }} style={{ flex: 1, minWidth: 0 }}>
          {value}
        </Text>
        <Text copyable={{ text: value }} />
      </div>
    </div>
  )
}

function About(): React.JSX.Element {
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
        className="aboutPage"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          padding: '16px 24px',
          background: '#fff',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <img
            src={icon}
            alt="App Logo"
            style={{ width: 64, height: 64, marginRight: 16 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={4} style={{ margin: 0, lineHeight: 1.2 }}>
              stealth-ticker
            </Title>
            <Text type="secondary" style={{ marginTop: 4 }}>
              Version 1.0.0
            </Text>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Space direction="vertical" size="small">
            <Text>版权所有 © Xue Maogang 2025 - 2026. All rights reserved.</Text>
            <Text type="secondary">
              This application is built with Electron, React, and Ant Design.
            </Text>
            <Text type="secondary">Licensed under the MIT License.</Text>
          </Space>
        </div>

        <div style={{ flexShrink: 0 }}>
          <Divider style={{ margin: '12px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', marginBottom: 12 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <ContactRow label="Home:" value="www.ipv8.com" />
                <ContactRow label="E-mail:" value="43757098@qq.com" />
                <ContactRow label="QQ 群:" value="43757098" />
              </Space>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" size="middle">
                检查更新
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default About
