import { useState, useEffect, useRef } from 'react';
import { Card, Button, Select, Input, Tag, Badge, Alert } from 'antd';
import { PlayCircle, PauseCircle, RefreshCw, AlertTriangle, Zap } from 'lucide-react';
import * as echarts from 'echarts';

const { Option } = Select;
const { Search: AntSearch } = Input;

// 模拟信号数据
interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  strength: number;
  confidence: number;
  timestamp: number;
  pattern: string;
  volume: number;
  price: number;
  status: 'active' | 'expired' | 'triggered';
}

const Radar: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    strength: 'all',
    confidence: 'all',
    symbol: '',
  });
  const [scanInterval, setScanInterval] = useState(5000);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 初始化图表
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      updateChart();
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  // 更新图表
  useEffect(() => {
    updateChart();
  }, [filteredSignals]);

  // 扫描逻辑
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isScanning) {
      interval = setInterval(() => {
        generateSignals();
      }, scanInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, scanInterval]);

  // 过滤信号
  useEffect(() => {
    filterSignals();
  }, [signals, filters]);

  // 生成模拟信号
  const generateSignals = () => {
    const newSignals: Signal[] = [];
    const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT'];
    const patterns = ['Head and Shoulders', 'Double Bottom', 'Triple Top', 'Moving Average Crossover', 'RSI Divergence'];

    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const signal: Signal = {
        id: `signal-${Date.now()}-${i}`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        strength: Math.floor(Math.random() * 100) + 1,
        confidence: Math.floor(Math.random() * 100) + 1,
        timestamp: Date.now(),
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
        volume: Math.random() * 1000000,
        price: Math.random() * 100000,
        status: 'active',
      };
      newSignals.push(signal);
    }

    setSignals(prev => [
      ...newSignals,
      ...prev.filter(s => (Date.now() - s.timestamp) < 300000), // 只保留5分钟内的信号
    ]);
  };

  // 过滤信号
  const filterSignals = () => {
    let result = [...signals];

    if (filters.type !== 'all') {
      result = result.filter(signal => signal.type === filters.type);
    }

    if (filters.strength !== 'all') {
      const minStrength = parseInt(filters.strength);
      result = result.filter(signal => signal.strength >= minStrength);
    }

    if (filters.confidence !== 'all') {
      const minConfidence = parseInt(filters.confidence);
      result = result.filter(signal => signal.confidence >= minConfidence);
    }

    if (filters.symbol) {
      result = result.filter(signal => signal.symbol.toLowerCase().includes(filters.symbol.toLowerCase()));
    }

    setFilteredSignals(result);
  };

  // 更新图表
  const updateChart = () => {
    if (!chartInstance.current) return;

    const symbolData = filteredSignals.reduce((acc, signal) => {
      if (!acc[signal.symbol]) {
        acc[signal.symbol] = {
          buy: 0,
          sell: 0,
        };
      }
      acc[signal.symbol][signal.type]++;
      return acc;
    }, {} as Record<string, { buy: number; sell: number }>);

    const symbols = Object.keys(symbolData);
    const buyData = symbols.map(symbol => symbolData[symbol].buy);
    const sellData = symbols.map(symbol => symbolData[symbol].sell);

    const option = {
      title: {
        text: '信号分布',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['买入信号', '卖出信号'],
        top: 30,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: symbols,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '买入信号',
          type: 'bar',
          data: buyData,
          itemStyle: {
            color: '#52c41a',
          },
        },
        {
          name: '卖出信号',
          type: 'bar',
          data: sellData,
          itemStyle: {
            color: '#ff4d4f',
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
  };

  // 开始/停止扫描
  const toggleScanning = () => {
    if (!isScanning) {
      setLoading(true);
      setTimeout(() => {
        setIsScanning(true);
        setLoading(false);
      }, 1000);
    } else {
      setIsScanning(false);
    }
  };

  // 手动刷新信号
  const refreshSignals = () => {
    setLoading(true);
    setTimeout(() => {
      generateSignals();
      setLoading(false);
    }, 500);
  };

  // 处理过滤条件变化
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {/* 头部控制栏 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">AI 智能扫描</h1>
          <div className="flex items-center gap-4">
            <Select
              value={scanInterval}
              onChange={setScanInterval}
              style={{ width: 120 }}
            >
              <Option value={1000}>1秒</Option>
              <Option value={3000}>3秒</Option>
              <Option value={5000}>5秒</Option>
              <Option value={10000}>10秒</Option>
            </Select>
            <Button
              type="primary"
              danger={isScanning}
              onClick={toggleScanning}
              loading={loading}
              icon={isScanning ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
            >
              {isScanning ? '停止扫描' : '开始扫描'}
            </Button>
            <Button
              onClick={refreshSignals}
              loading={loading}
              icon={<RefreshCw size={18} />}
            >
              刷新
            </Button>
          </div>
        </div>

        {/* 状态提示 */}
        {isScanning && (
          <Alert
            message="扫描中"
            description={`AI 正在实时监控市场信号，扫描间隔: ${scanInterval / 1000}秒`}
            type="info"
            showIcon
          />
        )}

        {/* 过滤栏 */}
        <Card title="信号筛选" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              placeholder="信号类型"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">全部</Option>
              <Option value="buy">买入</Option>
              <Option value="sell">卖出</Option>
            </Select>
            <Select
              placeholder="强度阈值"
              value={filters.strength}
              onChange={(value) => handleFilterChange('strength', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">全部</Option>
              <Option value="80">80+</Option>
              <Option value="60">60+</Option>
              <Option value="40">40+</Option>
            </Select>
            <Select
              placeholder="置信度阈值"
              value={filters.confidence}
              onChange={(value) => handleFilterChange('confidence', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">全部</Option>
              <Option value="80">80+</Option>
              <Option value="60">60+</Option>
              <Option value="40">40+</Option>
            </Select>
            <AntSearch
              placeholder="搜索交易对"
              value={filters.symbol}
              onChange={(e) => handleFilterChange('symbol', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </Card>

        {/* 信号图表 */}
        <Card title="信号分布" className="mb-4">
          <div ref={chartRef} style={{ width: '100%', height: 400 }} />
        </Card>

        {/* 信号列表 */}
        <Card title={`信号列表 (${filteredSignals.length})`}>
          {filteredSignals.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">暂无信号</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSignals.map((signal) => (
                <div key={signal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          status={signal.type === 'buy' ? 'success' : 'error'}
                          text={signal.type === 'buy' ? '买入信号' : '卖出信号'}
                        />
                        <Tag color={signal.strength > 80 ? 'green' : signal.strength > 60 ? 'blue' : 'orange'}>
                          强度: {signal.strength}%
                        </Tag>
                        <Tag color={signal.confidence > 80 ? 'green' : signal.confidence > 60 ? 'blue' : 'orange'}>
                          置信度: {signal.confidence}%
                        </Tag>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">{signal.symbol}</span>
                        <span className="ml-4">价格: ${signal.price.toFixed(2)}</span>
                        <span className="ml-4">成交量: {signal.volume.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        模式: {signal.pattern}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(signal.timestamp).toLocaleTimeString()}
                      </div>
                      <Button
                        type="link"
                        icon={<Zap size={16} />}
                        className="mt-2"
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Radar;