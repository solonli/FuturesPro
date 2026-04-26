import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  TrademarkOutlined, 
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
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: '/trading',
      icon: <TrademarkOutlined />,
      label: <Link to="/trading">交易</Link>,
    },
    {
      key: '/backtest',
      icon: <BarChartOutlined />,
      label: <Link to="/backtest">回测</Link>,
    },
    {
      key: '/radar',
      icon: <RadarChartOutlined />,
      label: <Link to="/radar">雷达</Link>,
    },
    {
      key: '/strategies',
      icon: <FileTextOutlined />,
      label: <Link to="/strategies">策略</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link to="/history">历史</Link>,
    },
    {
      key: '/account',
      icon: <UserOutlined />,
      label: <Link to="/account">账户</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">FuturesPro</div>
          <div>
            <Button type="primary" className="mr-2">登录</Button>
            <Button>注册</Button>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[currentPath]}
            items={menuItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content className="bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;