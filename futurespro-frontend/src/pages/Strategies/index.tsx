import React from 'react';
import StrategyList from '../../components/strategies/StrategyList';

const Strategies: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">策略管理</h1>
      <StrategyList />
    </div>
  );
};

export default Strategies;