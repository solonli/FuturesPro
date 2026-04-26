import React from 'react';
import { Layout, Menu, Input, Badge, Button, Dropdown, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  BarChartOutlined, 
  RadarChartOutlined, 
  FileTextOutlined, 
  HistoryOutlined, 
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  TrademarkOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/" className="text-text-primary">仪表盘</Link>,
    },
    {
      key: '/backtest',
      icon: <BarChartOutlined />,
      label: <Link to="/backtest" className="text-text-primary">回测系统</Link>,
    },
    {
      key: '/radar',
      icon: <RadarChartOutlined />,
      label: <Link to="/radar" className="text-text-primary">交易雷达</Link>,
    },
    {
      key: '/strategies',
      icon: <FileTextOutlined />,
      label: <Link to="/strategies" className="text-text-primary">策略管理</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link to="/history" className="text-text-primary">历史记录</Link>,
    },
  ];

  const userMenu = [
    { key: '1', label: '账户中心' },
    { key: '2', label: '个人设置' },
    { key: '3', label: '退出登录' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#0a0a1a', backgroundImage: 'linear-gradient(to bottom, #0a0a1a, #1a1a2e)' }}>
      <Header className="bg-[#16213e]/80 backdrop-blur-sm border-b border-[#2a2a4a]/50 px-6">
        <div className="flex justify-between items-center w-full">
          {/* 左侧 Logo 和导航 */}
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold text-primary flex items-center gap-2">
              <TrademarkOutlined className="text-primary" />
              <span>FuturesPro</span>
            </div>
            <Menu
              mode="horizontal"
              selectedKeys={[currentPath]}
              items={menuItems}
              style={{ 
                backgroundColor: 'transparent',
                color: '#a0a0b0',
                borderBottom: 0
              }}
              theme="dark"
            />
          </div>
          
          {/* 右侧搜索、通知和用户 */}
          <div className="flex items-center gap-4">
            <Search
              placeholder="搜索合约、策略..."
              style={{ width: 200, backgroundColor: '#1a1a2e', borderColor: '#2a2a4a' }}
              className="text-text-primary"
              prefix={<SearchOutlined className="text-text-secondary" />}
            />
            <Badge count={3} size="small" className="bg-primary">
              <BellOutlined className="text-text-primary text-xl" />
            </Badge>
            <Dropdown menu={{ items: userMenu }}>
              <Button className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">
                <Space>
                  <span>TradingX</span>
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">交易中</span>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
      </Header>
      <Content className="bg-[#0a0a1a] p-6">
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;