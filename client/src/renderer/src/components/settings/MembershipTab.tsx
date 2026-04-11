import React, { useState } from 'react'
import { Card, Typography, Button, Space, Divider, Row, Col } from 'antd'
import { CrownOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { MembershipCenterModal } from './MembershipCenterModal'

const { Title, Text } = Typography

export function MembershipTab(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={{ padding: '0 16px' }}>
      <MembershipCenterModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Card
        style={{
          background: 'linear-gradient(135deg, #1f1c2c 0%, #928DAB 100%)',
          color: 'white',
          borderRadius: 16,
          marginBottom: 24,
          border: 'none'
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center" size="middle">
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '16px',
                  borderRadius: '50%'
                }}
              >
                <CrownOutlined style={{ fontSize: 40, color: '#fadb14' }} />
              </div>
              <div>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  基础版
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>已解锁基础股票监控功能</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{ background: '#fadb14', color: '#333', border: 'none', fontWeight: 'bold' }}
              onClick={() => setModalOpen(true)}
            >
              升级高级会员
            </Button>
          </Col>
        </Row>
      </Card>

      <Title level={4}>会员专属特权</Title>
      <Divider style={{ margin: '16px 0' }} />

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Space align="start">
            <CheckCircleOutlined style={{ fontSize: 24, color: '#1677ff', marginTop: 4 }} />
            <div>
              <Title level={5}>无限制股票关注</Title>
              <Text type="secondary">
                基础版最多关注 10 只股票，高级会员无数量限制，满足您的深度监控需求。
              </Text>
            </div>
          </Space>
        </Col>
        <Col span={12}>
          <Space align="start">
            <CheckCircleOutlined style={{ fontSize: 24, color: '#1677ff', marginTop: 4 }} />
            <div>
              <Title level={5}>毫秒级数据刷新</Title>
              <Text type="secondary">
                专享高速行情接口，刷新频率最低可达毫秒级，把握每一个交易机会。
              </Text>
            </div>
          </Space>
        </Col>
        <Col span={12}>
          <Space align="start">
            <CheckCircleOutlined style={{ fontSize: 24, color: '#1677ff', marginTop: 4 }} />
            <div>
              <Title level={5}>价格异动提醒</Title>
              <Text type="secondary">支持自定义价格阈值，达到触发条件立即通过微信或短信提醒。</Text>
            </div>
          </Space>
        </Col>
        <Col span={12}>
          <Space align="start">
            <CheckCircleOutlined style={{ fontSize: 24, color: '#1677ff', marginTop: 4 }} />
            <div>
              <Title level={5}>高级悬浮窗与主题</Title>
              <Text type="secondary">
                更多个性化悬浮窗皮肤和深色模式，随心所欲定制您的专属看盘体验。
              </Text>
            </div>
          </Space>
        </Col>
      </Row>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Text type="secondary">
          <InfoCircleOutlined style={{ marginRight: 8 }} /> 如有支付问题或会员生效延迟，请联系客服
          support@stealth-stock.com
        </Text>
      </div>
    </div>
  )
}
