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

        {/* Middle Area: Copyright and Info */}
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
            {/* Contact Info Readonly Inputs */}
            <div style={{ width: '100%', marginBottom: 12 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Text style={{ width: 60, flexShrink: 0 }}>Home:</Text>
                  <Input readOnly value="www.ipv8.com" style={{ flex: 1, minWidth: 0 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Text style={{ width: 60, flexShrink: 0 }}>E-mail:</Text>
                  <Input readOnly value="43757098@qq.com" style={{ flex: 1, minWidth: 0 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Text style={{ width: 60, flexShrink: 0 }}>QQ 群:</Text>
                  <Input readOnly value="43757098" style={{ flex: 1, minWidth: 0 }} />
                </div>
              </Space>
            </div>

            {/* Check Update Button */}
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
