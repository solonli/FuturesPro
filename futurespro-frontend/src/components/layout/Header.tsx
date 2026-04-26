import React from 'react';
import { Bell, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-dark-300 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-200">仪表盘</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-dark-400 rounded-full transition-colors text-gray-400 hover:text-primary">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-dark-400 rounded-full transition-colors text-gray-400 hover:text-primary">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-semibold text-dark-500">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;