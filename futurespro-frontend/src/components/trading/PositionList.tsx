import React from 'react';

interface Position {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  volume: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
}

interface PositionListProps {
  positions: Position[];
  onClose: (positionId: string) => void;
}

const PositionList: React.FC<PositionListProps> = ({ positions, onClose }) => {
  return (
    <div className="w-full bg-dark-300 rounded-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-200">持仓列表</h3>
      </div>
      {positions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          暂无持仓
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((position) => (
            <div key={position.id} className="bg-dark-400 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="text-gray-200 font-medium">{position.symbol}</span>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${position.direction === 'long' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                    {position.direction === 'long' ? '多头' : '空头'}
                  </span>
                </div>
                <button 
                  className="text-sm text-gray-400 hover:text-red-500"
                  onClick={() => onClose(position.id)}
                >
                  平仓
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">
                  数量: <span className="text-gray-200 font-mono">{position.volume}</span>
                </div>
                <div className="text-gray-400">
                  均价: <span className="text-gray-200 font-mono">{position.avgPrice}</span>
                </div>
                <div className="text-gray-400">
                  当前价: <span className="text-gray-200 font-mono">{position.currentPrice}</span>
                </div>
                <div className={`text-gray-400 ${position.unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  浮动盈亏: <span className="font-mono">{position.unrealizedPnl}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PositionList;