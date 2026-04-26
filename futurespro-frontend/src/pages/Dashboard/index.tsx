import React from 'react';
import { Card, Button, Space, Badge, Divider } from 'antd';
import { 
  WalletOutlined, 
  DollarOutlined, 
  TrendingUpOutlined, 
  AlertOutlined, 
  RocketOutlined,
  BarChart2Outlined,
  FileTextOutlined,
  HistoryOutlined,
  ZapOutlined,
  RefreshOutlined
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  // 模拟数据
  const assets = [
    {
      title: '总资产',
      value: '¥1,220,847',
      change: '-12.5%',
      changeType: 'negative',
      icon: <WalletOutlined className="text-primary" />
    },
    {
      title: '今日盈亏',
      value: '¥98,450',
      change: '+8.3%',
      changeType: 'positive',
      icon: <DollarOutlined className="text-green-500" />
    },
    {
      title: '当日最大回撤',
      value: '¥42,180',
      change: '-2.1%',
      changeType: 'negative',
      icon: <TrendingUpOutlined className="text-red-500" />
    },
    {
      title: '今日交易次数',
      value: '156',
      change: '胜率 68%',
      changeType: 'neutral',
      icon: <AlertOutlined className="text-yellow-500" />
    }
  ];

  const quickActions = [
    {
      title: '快速下单',
      icon: <RocketOutlined className="text-primary" />,
      active: false
    },
    {
      title: '持仓详情',
      icon: <BarChart2Outlined className="text-primary" />,
      active: true
    },
    {
      title: '策略管理',
      icon: <FileTextOutlined className="text-primary" />,
      active: false
    },
    {
      title: '交易记录',
      icon: <HistoryOutlined className="text-primary" />,
      active: false
    }
  ];

  const positions = [
    {
      symbol: 'IF2504',
      name: '沪深300期货',
      direction: '做多',
      volume: 3,
      openPrice: 3850.2,
      currentPrice: 3892.5,
      pnl: '+¥12,690',
      pnlType: 'positive'
    },
    {
      symbol: 'IC2504',
      name: '中证500期货',
      direction: '做空',
      volume: 2,
      openPrice: 5420.0,
      currentPrice: 5385.6,
      pnl: '+¥6,888',
      pnlType: 'positive'
    },
    {
      symbol: 'RU2505',
      name: '橡胶期货',
      direction: '做多',
      volume: 5,
      openPrice: 14520,
      currentPrice: 14380,
      pnl: '-¥7,000',
      pnlType: 'negative'
    }
  ];

  const aiSignals = [
    {
      symbol: '螺纹钢RU2505',
      pattern: '突破关键阻力位',
      confidence: 92,
      confidenceType: 'high'
    },
    {
      symbol: '沪铜CU2505',
      pattern: '形成头肩顶形态',
      confidence: 87,
      confidenceType: 'medium'
    },
    {
      symbol: '原油SC2505',
      pattern: 'MACD金叉',
      confidence: 95,
      confidenceType: 'high'
    }
  ];

  const marketNews = [
    {
      symbol: 'IF2504',
      name: '沪深300',
      price: 3892.5,
      change: '+1.10%',
      changeType: 'positive'
    },
    {
      symbol: 'IC2504',
      name: '中证500',
      price: 5385.6,
      change: '+0.63%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">仪表盘</h1>
          <p className="text-text-secondary text-sm">2026年4月26日 20:17</p>
        </div>
      </div>
      
      {/* 资产卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((asset, index) => (
          <Card key={index} className="bg-[#1a1a2e]/80 border border-[#2a2a4a]/50 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-4 right-4">
              {asset.icon}
            </div>
            <div className="mb-2 text-text-secondary text-sm">{asset.title}</div>
            <div className="text-2xl font-mono font-bold text-text-primary mb-1">{asset.value}</div>
            <div className={`text-sm ${asset.changeType === 'positive' ? 'text-green-500' : asset.changeType === 'negative' ? 'text-red-500' : 'text-text-secondary'}`}>
              {asset.change}
            </div>
          </Card>
        ))}
      </div>
      
      {/* 快捷操作 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-300 ${action.active ? 'bg-primary/10 border-primary/30' : 'bg-[#1a1a2e]/50 border-[#2a2a4a]/30 hover:bg-[#1a1a2e]/80`}
          >
            <div className="flex flex-col items-center py-4">
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-text-primary">{action.title}</div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 持仓列表 */}
        <div className="bg-[#1a1a2e]/80 border border-[#2a2a4a]/50 rounded-lg p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text-primary">当前持仓</h3>
            <Space>
              <Button className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">
                平仓全部
              </Button>
              <Button className="bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20">
                添加
              </Button>
            </Space>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a4a]/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">合约</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">方向</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">持仓量</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">开仓价</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">当前价</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">浮动盈亏</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">操作</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => (
                  <tr key={index} className="border-b border-[#2a2a4a]/30 hover:bg-[#1e1e3a]/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-text-primary">{position.symbol}</p>
                        <p className="text-xs text-text-secondary">{position.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${position.direction === '做多' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {position.direction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-text-primary">{position.volume}手</td>
                    <td className="py-3 px-4 text-right font-mono text-text-primary">{position.openPrice}</td>
                    <td className="py-3 px-4 text-right font-mono text-text-primary">{position.currentPrice}</td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${position.pnlType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {position.pnl}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button className="bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 text-xs">
                        平仓
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 右侧栏 */}
        <div className="space-y-6">
          {/* AI智能信号 */}
          <div className="bg-[#1a1a2e]/80 border border-[#2a2a4a]/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <ZapOutlined className="text-yellow-500" />
                AI智能信号
              </h3>
            </div>
            <div className="space-y-4">
              {aiSignals.map((signal, index) => (
                <div key={index} className="p-3 bg-[#1e1e3a]/50 rounded-lg border border-[#2a2a4a]/30">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-text-primary">{signal.symbol}</p>
                    <Badge 
                      status={signal.confidenceType === 'high' ? 'success' : 'warning'} 
                      text={`置信度 ${signal.confidence}%`} 
                      className="text-xs"
                    />
                  </div>
                  <p className="text-sm text-text-secondary">{signal.pattern}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* 市场动态 */}
          <div className="bg-[#1a1a2e]/80 border border-[#2a2a4a]/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">市场动态</h3>
              <Button 
                icon={<RefreshOutlined />} 
                className="bg-transparent border-none text-text-secondary hover:bg-[#2a2a4a]"
              >
                刷新
              </Button>
            </div>
            <div className="space-y-4">
              {marketNews.map((news, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[#1e1e3a]/50 rounded-lg border border-[#2a2a4a]/30">
                  <div>
                    <p className="font-semibold text-text-primary">{news.symbol}</p>
                    <p className="text-xs text-text-secondary">{news.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-text-primary">{news.price}</p>
                    <p className={`text-xs ${news.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {news.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;