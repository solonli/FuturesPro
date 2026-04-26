import React, { useState, useEffect } from 'react';
import { 
  Table, 
  DatePicker, 
  Select, 
  Input, 
  Button, 
  Space, 
  Card, 
  message, 
  Popconfirm,
  Modal
} from 'antd';
import { 
  DownloadOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  FilterOutlined
} from '@ant-design/icons';
import * as echarts from 'echarts';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

// 交易历史数据类型定义
interface TradeHistory {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: string;
  profit: number;
  status: 'completed' | 'pending' | 'cancelled';
}

// 模拟交易历史数据
const mockTradeHistory: TradeHistory[] = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    side: 'buy',
    price: 60000,
    quantity: 0.1,
    timestamp: '2024-01-15T10:30:00Z',
    profit: 500,
    status: 'completed'
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    side: 'sell',
    price: 4000,
    quantity: 1,
    timestamp: '2024-01-15T11:45:00Z',
    profit: -100,
    status: 'completed'
  },
  {
    id: '3',
    symbol: 'BTC/USDT',
    side: 'sell',
    price: 61000,
    quantity: 0.1,
    timestamp: '2024-01-16T09:20:00Z',
    profit: 100,
    status: 'completed'
  },
  {
    id: '4',
    symbol: 'ETH/USDT',
    side: 'buy',
    price: 3900,
    quantity: 1,
    timestamp: '2024-01-16T14:15:00Z',
    profit: 50,
    status: 'completed'
  },
  {
    id: '5',
    symbol: 'BTC/USDT',
    side: 'buy',
    price: 60500,
    quantity: 0.1,
    timestamp: '2024-01-17T10:00:00Z',
    profit: -50,
    status: 'completed'
  }
];

const History: React.FC = () => {
  // 状态管理
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>(mockTradeHistory);
  const [filteredHistory, setFilteredHistory] = useState<TradeHistory[]>(mockTradeHistory);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [symbol, setSymbol] = useState<string>('');
  const [side, setSide] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [editingRecord, setEditingRecord] = useState<TradeHistory | null>(null);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  // 初始化收益曲线图表
  useEffect(() => {
    const chartDom = document.getElementById('profit-chart');
    if (chartDom) {
      const instance = echarts.init(chartDom);
      setChartInstance(instance);
      updateProfitChart();

      // 响应式调整
      const resizeObserver = new ResizeObserver(() => {
        instance.resize();
      });
      resizeObserver.observe(chartDom);

      return () => {
        instance.dispose();
        resizeObserver.disconnect();
      };
    }
  }, [tradeHistory]);

  // 更新收益曲线图表
  const updateProfitChart = () => {
    if (!chartInstance) return;

    // 按时间排序并计算累计收益
    const sortedHistory = [...tradeHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const dates = sortedHistory.map(item => dayjs(item.timestamp).format('MM-DD HH:mm'));
    const profits = sortedHistory.map(item => item.profit);
    const cumulativeProfit = profits.reduce((acc, current, index) => {
      return [...acc, (acc[index - 1] || 0) + current];
    }, [] as number[]);

    const option = {
      title: {
        text: '收益曲线',
        left: 'center',
        textStyle: {
          color: '#e0e0e0'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#16213e',
        borderColor: '#2a2a4a',
        textStyle: {
          color: '#e0e0e0'
        }
      },
      legend: {
        data: ['单次收益', '累计收益'],
        bottom: 10,
        textStyle: {
          color: '#a0a0b0'
        }
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: 45,
          color: '#a0a0b0'
        },
        axisLine: {
          lineStyle: {
            color: '#2a2a4a'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '收益 (USDT)',
        nameTextStyle: {
          color: '#a0a0b0'
        },
        axisLabel: {
          color: '#a0a0b0'
        },
        axisLine: {
          lineStyle: {
            color: '#2a2a4a'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#1a1a2e'
          }
        }
      },
      series: [
        {
          name: '单次收益',
          type: 'bar',
          data: profits,
          itemStyle: {
            color: (params: any) => params.value >= 0 ? '#52c41a' : '#ff4d4f'
          }
        },
        {
          name: '累计收益',
          type: 'line',
          data: cumulativeProfit,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#00D4FF'
          },
          symbol: 'circle',
          symbolSize: 6
        }
      ],
      backgroundColor: 'transparent'
    };

    chartInstance.setOption(option);
  };

  // 筛选功能
  const handleFilter = () => {
    let filtered = [...tradeHistory];

    // 日期范围筛选
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day').toISOString();
      const endDate = dateRange[1].endOf('day').toISOString();
      filtered = filtered.filter(item => 
        item.timestamp >= startDate && item.timestamp <= endDate
      );
    }

    // 交易对筛选
    if (symbol) {
      filtered = filtered.filter(item => item.symbol === symbol);
    }

    // 交易方向筛选
    if (side) {
      filtered = filtered.filter(item => item.side === side);
    }

    // 状态筛选
    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }

    // 搜索筛选
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.symbol.toLowerCase().includes(lowerSearchText) ||
        item.id.includes(lowerSearchText)
      );
    }

    setFilteredHistory(filtered);
  };

  // 导出功能
  const handleExport = () => {
    // 这里可以实现导出为CSV或Excel的逻辑
    message.success('交易历史已导出');
  };

  // 删除记录
  const handleDelete = (id: string) => {
    setTradeHistory(prev => prev.filter(item => item.id !== id));
    message.success('记录已删除');
  };

  // 编辑记录
  const handleEdit = (record: TradeHistory) => {
    setEditingRecord(record);
    setEditModalVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingRecord) {
      setTradeHistory(prev => 
        prev.map(item => item.id === editingRecord.id ? editingRecord : item)
      );
      setEditModalVisible(false);
      message.success('记录已更新');
    }
  };

  // 表格列配置
  const columns: ColumnsType<TradeHistory> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '交易对',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '方向',
      dataIndex: 'side',
      key: 'side',
      render: (side) => (
        <span className={side === 'buy' ? 'text-green-600' : 'text-red-600'}>
          {side === 'buy' ? '买入' : '卖出'}
        </span>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '收益',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit) => (
        <span className={profit >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {profit >= 0 ? '+' : ''}{profit.toFixed(2)} USDT
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          completed: { text: '已完成', color: 'green' },
          pending: { text: '待处理', color: 'orange' },
          cancelled: { text: '已取消', color: 'red' }
        };
        return (
          <span className={`text-${statusMap[status].color}-600`}>
            {statusMap[status].text}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TradeHistory) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 交易对选项
  const symbolOptions = [
    { value: 'BTC/USDT', label: 'BTC/USDT' },
    { value: 'ETH/USDT', label: 'ETH/USDT' },
  ];

  // 交易方向选项
  const sideOptions = [
    { value: 'buy', label: '买入' },
    { value: 'sell', label: '卖出' },
  ];

  // 状态选项
  const statusOptions = [
    { value: 'completed', label: '已完成' },
    { value: 'pending', label: '待处理' },
    { value: 'cancelled', label: '已取消' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-text-primary">交易历史</h1>

      {/* 收益曲线图表 */}
      <Card className="mb-6 bg-dark-300 border border-color-border">
        <div id="profit-chart" style={{ height: 400 }}></div>
      </Card>

      {/* 筛选条件 */}
      <Card className="mb-6 bg-dark-300 border border-color-border">
        <h2 className="text-lg font-semibold mb-4 text-text-primary">筛选条件</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="mb-2 text-sm text-text-secondary">日期范围</p>
            <DatePicker.RangePicker 
              className="w-full bg-dark-400 border border-color-border text-text-primary" 
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-secondary">交易对</p>
            <Select 
              className="w-full bg-dark-400 border border-color-border text-text-primary" 
              placeholder="选择交易对" 
              value={symbol}
              onChange={setSymbol}
              options={symbolOptions}
              allowClear
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-secondary">交易方向</p>
            <Select 
              className="w-full bg-dark-400 border border-color-border text-text-primary" 
              placeholder="选择交易方向" 
              value={side}
              onChange={setSide}
              options={sideOptions}
              allowClear
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-secondary">状态</p>
            <Select 
              className="w-full bg-dark-400 border border-color-border text-text-primary" 
              placeholder="选择状态" 
              value={status}
              onChange={setStatus}
              options={statusOptions}
              allowClear
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-secondary">搜索</p>
            <Input 
              placeholder="搜索交易对或ID" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-dark-400 border border-color-border text-text-primary"
            />
          </div>
          <div className="flex items-end">
            <Space>
              <Button 
                type="primary" 
                icon={<FilterOutlined />} 
                onClick={handleFilter}
                className="bg-primary hover:bg-primary/80"
              >
                筛选
              </Button>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
                className="bg-dark-400 hover:bg-dark-500 text-text-primary"
              >
                导出
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* 交易历史表格 */}
      <Card className="bg-dark-300 border border-color-border">
        <Table 
          columns={columns} 
          dataSource={filteredHistory} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="text-text-primary"
          tableLayout="auto"
        />
      </Card>

      {/* 编辑模态框 */}
      <Modal
        title="编辑交易记录"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        className="bg-dark-300 border border-color-border text-text-primary"
      >
        {/* 这里可以添加编辑表单 */}
        <p className="text-text-primary">编辑功能开发中...</p>
      </Modal>
    </div>
  );
};

export default History;