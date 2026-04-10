import React from 'react'
import { Modal, Tabs, Button, Card, Row, Col, Typography, Space, Divider, Input } from 'antd'
import { CheckCircleOutlined, KeyOutlined, SwapOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface MembershipCenterModalProps {
  open: boolean
  onClose: () => void
}

export function MembershipCenterModal({
  open,
  onClose
}: MembershipCenterModalProps): React.JSX.Element {
  const items = [
    {
      key: '1',
      label: '会员开通、续费',
      children: (
        <div style={{ padding: '20px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3}>升级为高级会员</Title>
            <Text type="secondary">解锁更多强大的股票监控和数据分析功能</Text>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Card
                hoverable
                style={{ height: '100%', borderColor: '#d9d9d9' }}
                styles={{ body: { padding: '24px' } }}
              >
                <Title level={4}>基础版 (免费)</Title>
                <Title level={2} style={{ margin: '16px 0' }}>
                  ¥ 0{' '}
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    / 永久
                  </Text>
                </Title>
                <Divider />
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} /> 最多关注 10
                    只股票
                  </Text>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />{' '}
                    基础数据刷新 (10秒)
                  </Text>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />{' '}
                    基础桌面悬浮窗
                  </Text>
                  <Text type="secondary" style={{ textDecoration: 'line-through' }}>
                    高级图表分析
                  </Text>
                  <Text type="secondary" style={{ textDecoration: 'line-through' }}>
                    实时价格提醒
                  </Text>
                </Space>
                <Button type="default" block style={{ marginTop: 24 }} disabled>
                  当前版本
                </Button>
              </Card>
            </Col>

            <Col span={12}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  borderColor: '#1677ff',
                  boxShadow: '0 4px 12px rgba(22,119,255,0.1)'
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: '#1677ff',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '0 8px 0 8px',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                >
                  推荐
                </div>
                <Title level={4} style={{ color: '#1677ff' }}>
                  专业版 (Pro)
                </Title>
                <Title level={2} style={{ margin: '16px 0', color: '#1677ff' }}>
                  ¥ 9.9{' '}
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    / 月
                  </Text>
                </Title>
                <Divider />
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />{' '}
                    无限制关注股票数量
                  </Text>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />{' '}
                    毫秒级数据刷新
                  </Text>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />{' '}
                    高级自定义悬浮窗
                  </Text>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />{' '}
                    深度资金流向分析
                  </Text>
                  <Text>
                    <CheckCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />{' '}
                    微信/短信实时提醒
                  </Text>
                </Space>
                <Button type="primary" block style={{ marginTop: 24 }}>
                  立即升级
                </Button>
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              购买即表示您同意我们的《服务条款》和《隐私政策》
            </Text>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: '会员迁移',
      children: (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <SwapOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
          <Title level={4}>设备间会员迁移</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            如果您更换了设备，可以通过此功能将旧设备的会员资格迁移到新设备。
          </Text>
          <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>旧设备机器码</Text>
                <Input placeholder="请输入旧设备机器码" style={{ marginTop: 8 }} />
              </div>
              <div>
                <Text strong>新设备机器码</Text>
                <Input
                  placeholder="当前设备机器码"
                  value="XXXX-XXXX-XXXX-XXXX"
                  disabled
                  style={{ marginTop: 8 }}
                />
              </div>
              <Button type="primary" block size="large">
                提交迁移申请
              </Button>
            </Space>
          </div>
        </div>
      )
    },
    {
      key: '3',
      label: '激活码查验',
      children: (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <KeyOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
          <Title level={4}>使用激活码</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            如果您通过其他渠道获取了会员激活码，请在下方输入以兑换会员时长。
          </Text>
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Input.Search
                placeholder="请输入您的激活码 (如: ABCD-1234-EFGH-5678)"
                enterButton="立即激活"
                size="large"
                onSearch={() => {}}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                * 激活码一经使用即与当前设备绑定，无法退换。
              </Text>
            </Space>
          </div>
        </div>
      )
    }
  ]

  return (
    <Modal
      title="会员中心"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  )
}
