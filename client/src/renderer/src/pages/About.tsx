import React from 'react'
import { Button, Divider, Input, Typography, Space, ConfigProvider } from 'antd'
import icon from '../../../../resources/icon.png'

const { Title, Text } = Typography


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
          padding: '24px',
          background: '#fff',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Top Area: Icon, App Name, Version */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
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

        {/* Middle Area: Copyright and Info */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Space direction="vertical" size="small">
            <Text>版权所有 © Xue Maogang 2025 - 2026. All rights reserved.</Text>
            <Text type="secondary">
              This application is built with Electron, React, and Ant Design.
            </Text>
            <Text type="secondary">Licensed under the MIT License.</Text>
          </Space>
        </div>

        {/* Bottom Area: Divider, Readonly Inputs, Check Update Button */}
        <div style={{ flexShrink: 0 }}>
          <Divider style={{ margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Contact Info Readonly Inputs */}
            <div style={{ flex: 1, marginRight: 32 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ width: 80, flexShrink: 0 }}>Home:</Text>
                  <Input readOnly value="www.ipv8.com" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ width: 80, flexShrink: 0 }}>E-mail:</Text>
                  <Input readOnly value="43757098@qq.com" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ width: 80, flexShrink: 0 }}>QQ群:</Text>
                  <Input readOnly value="43757098" />
                </div>
              </Space>
            </div>

            {/* Check Update Button */}
            <Button type="primary" size="middle" style={{ marginBottom: '2px' }}>
              检查更新
            </Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default About
