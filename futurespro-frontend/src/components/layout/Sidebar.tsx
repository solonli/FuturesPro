import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Target, GitBranch, TrendingUp, History, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: '仪表盘',
      path: '/',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: '实时交易',
      path: '/trading',
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: '回测系统',
      path: '/backtest',
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: '交易雷达',
      path: '/radar',
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      label: '策略管理',
      path: '/strategies',
    },
    {
      icon: <History className="w-5 h-5" />,
      label: '交易历史',
      path: '/history',
    },
    {
      icon: <User className="w-5 h-5" />,
      label: '账户中心',
      path: '/account',
    },
  ];

  return (
    <div className="w-64 bg-dark-300 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-primary">FuturesPro</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'hover:bg-dark-400 text-gray-400'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;