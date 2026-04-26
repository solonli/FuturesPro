import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  BarChartOutlined, 
  RadarChartOutlined, 
  FileTextOutlined, 
  HistoryOutlined, 
  UserOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

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
      label: <Link to="/backtest" className="text-text-primary">回测</Link>,
    },
    {
      key: '/radar',
      icon: <RadarChartOutlined />,
      label: <Link to="/radar" className="text-text-primary">雷达</Link>,
    },
    {
      key: '/strategies',
      icon: <FileTextOutlined />,
      label: <Link to="/strategies" className="text-text-primary">策略</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link to="/history" className="text-text-primary">历史</Link>,
    },
    {
      key: '/account',
      icon: <UserOutlined />,
      label: <Link to="/account" className="text-text-primary">账户</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#0f0f1a' }}>
      <Header className="bg-[#16213e] border-b border-[#2a2a4a]">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary">FuturesPro</div>
          <div>
            <Button type="primary" className="mr-2 bg-primary border-primary hover:bg-primary/80">登录</Button>
            <Button className="bg-dark-400 border-color-border text-text-primary hover:bg-dark-500">注册</Button>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="bg-[#16213e] border-r border-[#2a2a4a]">
          <Menu
            mode="inline"
            selectedKeys={[currentPath]}
            items={menuItems}
            style={{ 
              height: '100%', 
              borderRight: 0,
              backgroundColor: '#16213e',
              color: '#a0a0b0'
            }}
            theme="dark"
          />
        </Sider>
        <Content className="bg-[#0f0f1a] p-6">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;