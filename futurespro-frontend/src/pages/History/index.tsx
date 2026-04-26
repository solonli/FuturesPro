import React from 'react';

const History: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">交易历史</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div>
            <label className="block text-text-secondary text-sm mb-2">开始日期</label>
            <input type="date" className="bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">结束日期</label>
            <input type="date" className="bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">合约</label>
            <select className="bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary">
              <option>全部合约</option>
              <option>螺纹钢2510 (rb2510)</option>
              <option>铜2509 (cu2509)</option>
              <option>大豆2509 (a2509)</option>
            </select>
          </div>
        </div>
        <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors">
          导出
        </button>
      </div>
      <div className="bg-dark-300 border border-color-border rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-400">
                <th className="px-4 py-3 text-left text-text-secondary">日期</th>
                <th className="px-4 py-3 text-left text-text-secondary">合约</th>
                <th className="px-4 py-3 text-left text-text-secondary">类型</th>
                <th className="px-4 py-3 text-left text-text-secondary">价格</th>
                <th className="px-4 py-3 text-left text-text-secondary">数量</th>
                <th className="px-4 py-3 text-left text-text-secondary">费用</th>
                <th className="px-4 py-3 text-left text-text-secondary">盈亏</th>
                <th className="px-4 py-3 text-left text-text-secondary">策略</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-color-border">
                <td className="px-4 py-3">2024-04-25</td>
                <td className="px-4 py-3">螺纹钢2510</td>
                <td className="px-4 py-3 text-green-500">买入</td>
                <td className="px-4 py-3 font-mono">3850.00</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3 font-mono">¥15.40</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">移动平均线策略</td>
              </tr>
              <tr className="border-t border-color-border bg-dark-400/50">
                <td className="px-4 py-3">2024-04-24</td>
                <td className="px-4 py-3">铜2509</td>
                <td className="px-4 py-3 text-red-500">卖出</td>
                <td className="px-4 py-3 font-mono">68150.00</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3 font-mono">¥34.08</td>
                <td className="px-4 py-3 text-green-500">¥500.00</td>
                <td className="px-4 py-3">MACD策略</td>
              </tr>
              <tr className="border-t border-color-border">
                <td className="px-4 py-3">2024-04-23</td>
                <td className="px-4 py-3">大豆2509</td>
                <td className="px-4 py-3 text-green-500">买入</td>
                <td className="px-4 py-3 font-mono">5230.00</td>
                <td className="px-4 py-3">3</td>
                <td className="px-4 py-3 font-mono">¥7.85</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">手动交易</td>
              </tr>
              <tr className="border-t border-color-border bg-dark-400/50">
                <td className="px-4 py-3">2024-04-22</td>
                <td className="px-4 py-3">螺纹钢2510</td>
                <td className="px-4 py-3 text-red-500">卖出</td>
                <td className="px-4 py-3 font-mono">3920.00</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3 font-mono">¥7.84</td>
                <td className="px-4 py-3 text-green-500">¥70.00</td>
                <td className="px-4 py-3">移动平均线策略</td>
              </tr>
              <tr className="border-t border-color-border">
                <td className="px-4 py-3">2024-04-21</td>
                <td className="px-4 py-3">铜2509</td>
                <td className="px-4 py-3 text-red-500">卖出</td>
                <td className="px-4 py-3 font-mono">68200.00</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3 font-mono">¥34.10</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">MACD策略</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <p className="text-text-secondary">显示 1-5 条，共 28 条</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-dark-400 rounded-lg disabled:opacity-50" disabled>
              上一页
            </button>
            <button className="px-3 py-1 bg-primary rounded-lg text-white">1</button>
            <button className="px-3 py-1 bg-dark-400 rounded-lg">2</button>
            <button className="px-3 py-1 bg-dark-400 rounded-lg">3</button>
            <button className="px-3 py-1 bg-dark-400 rounded-lg">4</button>
            <button className="px-3 py-1 bg-dark-400 rounded-lg">5</button>
            <button className="px-3 py-1 bg-dark-400 rounded-lg">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;