import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface BacktestResult {
  initial_capital: number;
  final_capital: number;
  total_return: number;
  max_drawdown: number;
  sharpe_ratio: number;
  trades: Array<{
    date: string;
    type: string;
    price: number;
    size: number;
    pnl: number;
  }>;
  equity_curve: Array<[string, number]>;
}

const Backtest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  const [formData, setFormData] = useState({
    strategyId: 1,
    contractId: 1,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    initialCapital: '100000',
    param1: 10,
    param2: 20
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'param1' || name === 'param2' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/backtest/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          strategy_id: formData.strategyId,
          contract_id: formData.contractId,
          start_date: formData.startDate,
          end_date: formData.endDate,
          initial_capital: formData.initialCapital,
          strategy_params: {
            fast_period: formData.param1,
            slow_period: formData.param2
          }
        })
      });

      if (!response.ok) {
        throw new Error('回测执行失败');
      }

      const data = await response.json();
      setResult(data.results);
    } catch (err) {
      setError('回测执行失败，请稍后重试');
      console.error('Error executing backtest:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 初始化图表
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // 更新图表数据
    if (chartInstance.current && result) {
      const option = {
        title: {
          text: '资金曲线',
          left: 'center',
          textStyle: {
            color: '#9CA3AF'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            const data = params[0];
            return `${new Date(data.name).toLocaleDateString()}<br/>资金: ¥${data.value.toFixed(2)}`;
          }
        },
        xAxis: {
          type: 'category',
          data: result.equity_curve.map(item => item[0]),
          axisLabel: {
            color: '#9CA3AF',
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: '#374151'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#9CA3AF',
            formatter: '¥{value}'
          },
          axisLine: {
            lineStyle: {
              color: '#374151'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#1F2937'
            }
          }
        },
        series: [{
          data: result.equity_curve.map(item => item[1]),
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#3B82F6',
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.1)'
              }
            ])
          },
          symbol: 'none'
        }],
        backgroundColor: 'transparent'
      };

      chartInstance.current.setOption(option);
    }
  }, [result]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/v1/backtest');
      if (!response.ok) {
        throw new Error('获取历史记录失败');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('获取历史记录失败');
    }
  };

  const handleViewHistory = () => {
    if (!showHistory) {
      fetchHistory();
    }
    setShowHistory(!showHistory);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">回测系统</h1>
        <button 
          onClick={handleViewHistory}
          className="bg-dark-400 hover:bg-dark-500 text-white py-2 px-4 rounded-lg transition-colors font-semibold"
        >
          {showHistory ? '隐藏历史记录' : '查看历史记录'}
        </button>
      </div>
      
      {showHistory && (
        <div className="bg-dark-300 border border-color-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">回测历史记录</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-400">
                  <th className="px-4 py-3 text-left text-text-secondary">日期</th>
                  <th className="px-4 py-3 text-left text-text-secondary">策略</th>
                  <th className="px-4 py-3 text-left text-text-secondary">合约</th>
                  <th className="px-4 py-3 text-left text-text-secondary">总收益率</th>
                  <th className="px-4 py-3 text-left text-text-secondary">最大回撤</th>
                  <th className="px-4 py-3 text-left text-text-secondary">夏普比率</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-t border-color-border">
                    <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">策略 {item.strategy_id}</td>
                    <td className="px-4 py-3">合约 {item.contract_id}</td>
                    <td className={`px-4 py-3 ${item.total_return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.total_return >= 0 ? '+' : ''}{item.total_return}%
                    </td>
                    <td className="px-4 py-3 text-red-500">-{item.max_drawdown}%</td>
                    <td className="px-4 py-3">{item.sharpe_ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-dark-300 border border-color-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">回测配置</h3>
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">策略</label>
                <select 
                  name="strategyId"
                  value={formData.strategyId}
                  onChange={handleInputChange}
                  className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary"
                >
                  <option value={1}>移动平均线策略</option>
                  <option value={2}>MACD策略</option>
                  <option value={3}>布林带策略</option>
                </select>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">合约</label>
                <select 
                  name="contractId"
                  value={formData.contractId}
                  onChange={handleInputChange}
                  className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary"
                >
                  <option value={1}>螺纹钢2510 (rb2510)</option>
                  <option value={2}>铜2509 (cu2509)</option>
                  <option value={3}>大豆2509 (a2509)</option>
                </select>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">时间范围</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="date" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" 
                  />
                  <input 
                    type="date" 
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">初始资金</label>
                <input 
                  type="text" 
                  name="initialCapital"
                  value={formData.initialCapital}
                  onChange={handleInputChange}
                  className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" 
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">参数设置</label>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>快速均线</span>
                    <input 
                      type="range" 
                      name="param1"
                      min="1" 
                      max="50" 
                      value={formData.param1}
                      onChange={handleInputChange}
                      className="w-2/3" 
                    />
                    <span className="w-10 text-right">{formData.param1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>慢速均线</span>
                    <input 
                      type="range" 
                      name="param2"
                      min="5" 
                      max="100" 
                      value={formData.param2}
                      onChange={handleInputChange}
                      className="w-2/3" 
                    />
                    <span className="w-10 text-right">{formData.param2}</span>
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-lg transition-colors font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? '回测中...' : '开始回测'}
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-dark-300 border border-color-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">回测结果</h3>
            {result ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-dark-400 p-4 rounded-lg">
                    <p className="text-text-secondary text-sm">总收益率</p>
                    <p className={`text-2xl font-mono font-bold ${result.total_return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {result.total_return >= 0 ? '+' : ''}{result.total_return.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-dark-400 p-4 rounded-lg">
                    <p className="text-text-secondary text-sm">最大回撤</p>
                    <p className="text-2xl font-mono font-bold text-red-500">
                      -{result.max_drawdown.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-dark-400 p-4 rounded-lg">
                    <p className="text-text-secondary text-sm">夏普比率</p>
                    <p className="text-2xl font-mono font-bold">
                      {result.sharpe_ratio.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="h-80 bg-dark-400 rounded-lg">
                  <div ref={chartRef} className="h-full w-full"></div>
                </div>
              </>
            ) : (
              <div className="h-80 bg-dark-400 rounded-lg flex items-center justify-center">
                <p className="text-text-secondary">请配置回测参数并点击开始回测</p>
              </div>
            )}
          </div>
          <div className="bg-dark-300 border border-color-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">交易记录</h3>
            {result ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-dark-400">
                      <th className="px-4 py-3 text-left text-text-secondary">日期</th>
                      <th className="px-4 py-3 text-left text-text-secondary">类型</th>
                      <th className="px-4 py-3 text-left text-text-secondary">价格</th>
                      <th className="px-4 py-3 text-left text-text-secondary">数量</th>
                      <th className="px-4 py-3 text-left text-text-secondary">盈亏</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.map((trade, index) => (
                      <tr key={index} className={`border-t border-color-border ${index % 2 === 1 ? 'bg-dark-400/50' : ''}`}>
                        <td className="px-4 py-3">{new Date(trade.date).toLocaleDateString()}</td>
                        <td className={`px-4 py-3 ${trade.type === '买入' ? 'text-green-500' : 'text-red-500'}`}>{trade.type}</td>
                        <td className="px-4 py-3 font-mono">{trade.price.toFixed(2)}</td>
                        <td className="px-4 py-3">{trade.size}</td>
                        <td className={`px-4 py-3 ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ¥{trade.pnl.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-40 bg-dark-400 rounded-lg flex items-center justify-center">
                <p className="text-text-secondary">暂无交易记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backtest;