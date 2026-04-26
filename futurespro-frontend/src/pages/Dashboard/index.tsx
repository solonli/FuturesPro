import React from 'react';

const Dashboard: React.FC = () => {
  // 模拟数据
  const assets = [
    {
      title: '账户余额',
      value: '¥ 100,000.00',
      change: '+2.5%',
      changeType: 'positive',
      subtitle: '今日'
    },
    {
      title: '总盈亏',
      value: '¥ 5,280.00',
      change: '+5.28%',
      changeType: 'positive',
      subtitle: '本月'
    },
    {
      title: '持仓市值',
      value: '¥ 65,320.00',
      change: '3 个合约',
      changeType: 'neutral',
      subtitle: ''
    },
    {
      title: '可用资金',
      value: '¥ 34,680.00',
      change: '34.68%',
      changeType: 'neutral',
      subtitle: ''
    }
  ];

  const positions = [
    {
      symbol: '螺纹钢2510',
      exchange: 'SHFE',
      direction: '多头',
      volume: 2,
      avgPrice: 3850.00,
      currentPrice: 3920.00,
      pnl: '+1,400.00',
      pnlType: 'positive'
    },
    {
      symbol: '铜2509',
      exchange: 'SHFE',
      direction: '空头',
      volume: 1,
      avgPrice: 68500.00,
      currentPrice: 67800.00,
      pnl: '+7,000.00',
      pnlType: 'positive'
    },
    {
      symbol: '大豆2509',
      exchange: 'DCE',
      direction: '多头',
      volume: 3,
      avgPrice: 5200.00,
      currentPrice: 5180.00,
      pnl: '-600.00',
      pnlType: 'negative'
    }
  ];

  const aiSignals = [
    {
      symbol: '螺纹钢2510',
      exchange: 'SHFE',
      signal: '买入信号',
      signalType: 'positive',
      strength: 85,
      time: '10:30 AM'
    },
    {
      symbol: '铜2509',
      exchange: 'SHFE',
      signal: '卖出信号',
      signalType: 'negative',
      strength: 78,
      time: '11:15 AM'
    },
    {
      symbol: '大豆2509',
      exchange: 'DCE',
      signal: '持有信号',
      signalType: 'neutral',
      strength: 65,
      time: '09:45 AM'
    }
  ];

  const marketNews = [
    {
      title: '央行：保持流动性合理充裕',
      source: '央行网站',
      time: '10:00 AM'
    },
    {
      title: '螺纹钢库存持续下降',
      source: '钢联数据',
      time: '09:30 AM'
    },
    {
      title: '铜价创近期新高',
      source: '上海有色网',
      time: '08:45 AM'
    },
    {
      title: '大豆进口量环比增加',
      source: '农产品期货网',
      time: '08:30 AM'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">仪表盘</h1>
      
      {/* 资产卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset, index) => (
          <div key={index} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg p-6">
            <h3 className="text-[#a0a0b0] text-sm mb-2">{asset.title}</h3>
            <p className="text-3xl font-mono font-bold">{asset.value}</p>
            <p className={`text-sm mt-2 ${asset.changeType === 'positive' ? 'text-green-500' : asset.changeType === 'negative' ? 'text-red-500' : 'text-[#a0a0b0]'}`}>
              {asset.change} {asset.subtitle}
            </p>
          </div>
        ))}
      </div>
      
      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 持仓列表 */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">持仓列表</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a4a]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#a0a0b0]">合约</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#a0a0b0]">方向</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#a0a0b0]">持仓量</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#a0a0b0]">持仓均价</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#a0a0b0]">当前价</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#a0a0b0]">盈亏</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => (
                  <tr key={index} className="border-b border-[#2a2a4a] hover:bg-[#1e1e3a]">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold">{position.symbol}</p>
                        <p className="text-xs text-[#a0a0b0]">{position.exchange}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${position.direction === '多头' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {position.direction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{position.volume}</td>
                    <td className="py-3 px-4 text-right font-mono">{position.avgPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono">{position.currentPrice.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${position.pnlType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {position.pnl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* AI信号 */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">AI 信号</h3>
          <div className="space-y-4">
            {aiSignals.map((signal, index) => (
              <div key={index} className="p-4 bg-[#1e1e3a] rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{signal.symbol}</p>
                    <p className="text-xs text-[#a0a0b0]">{signal.exchange}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${signal.signalType === 'positive' ? 'bg-green-500/10 text-green-500' : signal.signalType === 'negative' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {signal.signal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-full bg-[#2a2a4a] rounded-full h-2 mr-4">
                    <div 
                      className={`h-2 rounded-full ${signal.signalType === 'positive' ? 'bg-green-500' : signal.signalType === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`}
                      style={{ width: `${signal.strength}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#a0a0b0]">{signal.strength}%</span>
                </div>
                <p className="text-xs text-[#a0a0b0] mt-2">{signal.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 市场动态 */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">市场动态</h3>
        <div className="space-y-4">
          {marketNews.map((news, index) => (
            <div key={index} className="flex justify-between items-start p-3 bg-[#1e1e3a] rounded-lg">
              <div>
                <p className="font-medium">{news.title}</p>
                <p className="text-xs text-[#a0a0b0]">{news.source}</p>
              </div>
              <p className="text-xs text-[#a0a0b0]">{news.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;