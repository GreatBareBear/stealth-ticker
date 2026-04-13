import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Popconfirm, Switch, message, Select, Spin } from 'antd'
import { PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons'

export interface Stock {
  key: string
  symbol: string
  name: string
  isIndex: boolean
  visible: boolean
}

export interface OptionData {
  symbol: string
  name: string
  type: string
}

export interface OptionType {
  value: string
  label: string
  data: OptionData
}

export function StocksTab(): React.JSX.Element {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [options, setOptions] = useState<OptionType[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [selectedStock, setSelectedStock] = useState<OptionData | null>(null)

  const fetchRef = useRef<number>(0)

  useEffect(() => {
    const loadStocks = async (): Promise<void> => {
      try {
        const savedStocks = await window.api.store.get('stocks')
        if (savedStocks && Array.isArray(savedStocks)) {
          setStocks(savedStocks)
        } else {
          setStocks([
            { key: '1', symbol: 'sh000001', name: '上证指数', isIndex: true, visible: true },
            { key: '2', symbol: 'sz399001', name: '深证成指', isIndex: true, visible: true },
            { key: '3', symbol: 'sz000001', name: '平安银行', isIndex: false, visible: true },
            { key: '4', symbol: 'sh600519', name: '贵州茅台', isIndex: false, visible: false }
          ])
        }
      } catch (error) {
        console.error('Failed to load stocks:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStocks()
  }, [])

  const updateStocks = async (newStocks: Stock[]): Promise<void> => {
    setStocks(newStocks)
    try {
      await window.api.store.set('stocks', newStocks)
    } catch (error) {
      console.error('Failed to save stocks:', error)
    }
  }

  const handleSearch = async (value: string): Promise<void> => {
    if (!value.trim()) {
      setOptions([])
      return
    }

    fetchRef.current += 1
    const fetchId = fetchRef.current

    setSearchLoading(true)

    try {
      const response = await window.fetch(
        `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(value)}&t=all`
      )
      let text = await response.text()

      // 解析 Unicode 转义字符
      text = text.replace(/\\u[\dA-F]{4}/gi, (match) =>
        String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      )

      if (fetchId !== fetchRef.current) return

      const match = text.match(/v_hint="([^"]*)"/)
      if (match && match[1]) {
        const items = match[1].split('^')
        const newOptions = items.map((item) => {
          const parts = item.split('~')
          const exchange = parts[0]
          const code = parts[1]
          const name = parts[2]
          const type = parts[4]

          const symbol = `${exchange}${code}`
          return {
            value: symbol,
            label: `${name} (${symbol})`,
            data: { symbol, name, type }
          }
        })
        setOptions(newOptions)
      } else {
        setOptions([])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      if (fetchId === fetchRef.current) {
        setSearchLoading(false)
      }
    }
  }

  const handleSelect = (_value: string, option?: OptionType | OptionType[]): void => {
    if (option && !Array.isArray(option)) {
      setSelectedStock(option.data)
    }
  }

  const handleAdd = (): void => {
    if (!selectedStock) return

    if (stocks.length >= 9) {
      message.warning('免费版最多只能添加 9 只股票')
      return
    }

    if (stocks.some((s) => s.symbol === selectedStock.symbol)) {
      message.warning('该股票已存在')
      return
    }

    const newKey = Date.now().toString()
    const newStocks = [
      ...stocks,
      {
        key: newKey,
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        isIndex: selectedStock.type === 'ZS',
        visible: true
      }
    ]

    updateStocks(newStocks)
    setSelectedStock(null)
    setOptions([])
  }

  const handleDelete = (key: string): void => {
    updateStocks(stocks.filter((s) => s.key !== key))
  }

  const handleVisibleChange = (key: string, checked: boolean): void => {
    updateStocks(stocks.map((s) => (s.key === key ? { ...s, visible: checked } : s)))
  }

  const columns = [
    {
      title: '',
      key: 'drag',
      width: 40,
      render: (): React.JSX.Element => <DragOutlined style={{ cursor: 'grab', color: '#999' }} />
    },
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '显示',
      key: 'visible',
      render: (_, record: Stock): React.JSX.Element => (
        <Switch
          checked={record.visible}
          onChange={(checked): void => handleVisibleChange(record.key, checked)}
          size="small"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Stock): React.JSX.Element => (
        <Popconfirm
          title="确定删除该股票吗？"
          onConfirm={(): void => handleDelete(record.key)}
          okText="是"
          cancelText="否"
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      )
    }
  ]

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin />
      </div>
    )
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Select
          showSearch
          value={selectedStock ? selectedStock.symbol : null}
          placeholder="输入股票代码/拼音/名称"
          style={{ width: 300 }}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleSelect}
          notFoundContent={searchLoading ? <Spin size="small" /> : null}
          options={options}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          disabled={!selectedStock}
        >
          添加
        </Button>
      </div>
      <Table
        dataSource={stocks}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        scroll={{ y: 340 }}
      />
    </div>
  )
}
