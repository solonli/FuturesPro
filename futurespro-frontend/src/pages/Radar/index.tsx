import React from 'react';

const Radar: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">交易雷达</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-300 border border-color-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">AI 智能扫描</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-text-secondary text-sm mb-2">扫描范围</label>
                <select className="w-48 bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary">
                  <option>全部合约</option>
                  <option>金属</option>
                  <option>农产品</option>
                  <option>能源</option>
                </select>
              </div>
              <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors">
                开始扫描
              </button>
            </div>
            <div className="h-80 bg-dark-400 rounded-lg flex items-center justify-center">
              <p className="text-text-secondary">雷达扫描结果</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-300 border border-color-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">信号检测</h3>
          <div className="space-y-4">
            <div className="p-4 bg-dark-400 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">螺纹钢2510</p>
                  <p className="text-text-secondary text-sm">SHFE</p>
                </div>
                <div className="text-green-500 font-bold">买入信号</div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>信号强度</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-dark-500 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <p className="text-sm mt-2">技术形态: 突破阻力位</p>
            </div>
            <div className="p-4 bg-dark-400 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">铜2509</p>
                  <p className="text-text-secondary text-sm">SHFE</p>
                </div>
                <div className="text-red-500 font-bold">卖出信号</div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>信号强度</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-dark-500 rounded-full h-2 mt-1">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <p className="text-sm mt-2">技术形态: 顶背离</p>
            </div>
            <div className="p-4 bg-dark-400 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">大豆2509</p>
                  <p className="text-text-secondary text-sm">DCE</p>
                </div>
                <div className="text-yellow-500 font-bold">持有信号</div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>信号强度</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-dark-500 rounded-full h-2 mt-1">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <p className="text-sm mt-2">技术形态: 横盘整理</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-dark-300 border border-color-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">市场情绪分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-dark-400 p-4 rounded-lg">
                <p className="text-text-secondary text-sm">整体市场情绪</p>
                <p className="text-2xl font-bold">中性</p>
              </div>
              <div className="bg-dark-400 p-4 rounded-lg">
                <p className="text-text-secondary text-sm">恐慌指数</p>
                <p className="text-2xl font-mono font-bold">45</p>
              </div>
              <div className="bg-dark-400 p-4 rounded-lg">
                <p className="text-text-secondary text-sm">贪婪指数</p>
                <p className="text-2xl font-mono font-bold">55</p>
              </div>
            </div>
            <div className="h-64 bg-dark-400 rounded-lg flex items-center justify-center">
              <p className="text-text-secondary">市场情绪走势图</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Radar;