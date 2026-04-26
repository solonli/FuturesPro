import React from 'react';

interface OrderBookProps {
  buyOrders: any[];
  sellOrders: any[];
}

const OrderBook: React.FC<OrderBookProps> = ({ buyOrders, sellOrders }) => {
  return (
    <div className="w-full bg-dark-300 rounded-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-200">订单簿</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">买单</div>
          <div className="space-y-1">
            {buyOrders.map((order, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{order.price}</span>
                <span className="text-primary font-mono">{order.volume}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">卖单</div>
          <div className="space-y-1">
            {sellOrders.map((order, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{order.price}</span>
                <span className="text-secondary font-mono">{order.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;