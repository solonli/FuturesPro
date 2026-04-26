import React, { useState } from 'react';

interface TradePanelProps {
  onSubmit: (order: any) => void;
}

const TradePanel: React.FC<TradePanelProps> = ({ onSubmit }) => {
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [volume, setVolume] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      direction,
      price: parseFloat(price),
      volume: parseInt(volume)
    });
  };

  return (
    <div className="w-full bg-dark-300 rounded-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-200">交易面板</h3>
      </div>
      <div className="flex mb-4">
        <button 
          className={`flex-1 py-2 rounded-l-lg ${direction === 'buy' ? 'bg-primary text-dark-500' : 'bg-dark-400 text-gray-400'}`}
          onClick={() => setDirection('buy')}
        >
          买入
        </button>
        <button 
          className={`flex-1 py-2 rounded-r-lg ${direction === 'sell' ? 'bg-secondary text-dark-500' : 'bg-dark-400 text-gray-400'}`}
          onClick={() => setDirection('sell')}
        >
          卖出
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">价格</label>
          <input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-dark-400 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="输入价格"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">数量</label>
          <input 
            type="number" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full bg-dark-400 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="输入数量"
          />
        </div>
        <button 
          type="submit" 
          className={`w-full py-3 rounded-lg font-semibold ${direction === 'buy' ? 'bg-primary text-dark-500' : 'bg-secondary text-dark-500'}`}
        >
          {direction === 'buy' ? '买入' : '卖出'}
        </button>
      </form>
    </div>
  );
};

export default TradePanel;