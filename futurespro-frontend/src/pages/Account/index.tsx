import React from 'react';

const Account: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">账户中心</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-dark-300 border border-color-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">用户信息</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">用户名</label>
                  <input type="text" className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" defaultValue="user123" />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">邮箱</label>
                  <input type="email" className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" defaultValue="user@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">手机号</label>
                  <input type="text" className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" defaultValue="13800138000" />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">昵称</label>
                  <input type="text" className="w-full bg-dark-400 border border-color-border rounded-lg px-4 py-2 text-text-primary" defaultValue="交易者" />
                </div>
              </div>
              <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors">
                保存修改
              </button>
            </div>
          </div>
          <div className="bg-dark-300 border border-color-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">API 密钥</h3>
            <div className="space-y-4">
              <div className="p-4 bg-dark-400 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">API Key</p>
                    <p className="text-text-secondary text-sm mt-1">用于程序化交易</p>
                  </div>
                  <button className="bg-primary hover:bg-primary/80 text-white px-4 py-1 rounded-lg text-sm transition-colors">
                    生成
                  </button>
                </div>
                <div className="mt-4">
                  <input type="text" className="w-full bg-dark-500 border border-color-border rounded-lg px-4 py-2 text-text-primary" placeholder="API Key 将显示在这里" />
                </div>
              </div>
              <div className="p-4 bg-dark-400 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">API Secret</p>
                    <p className="text-text-secondary text-sm mt-1">用于签名验证</p>
                  </div>
                  <button className="bg-primary hover:bg-primary/80 text-white px-4 py-1 rounded-lg text-sm transition-colors">
                    生成
                  </button>
                </div>
                <div className="mt-4">
                  <input type="text" className="w-full bg-dark-500 border border-color-border rounded-lg px-4 py-2 text-text-primary" placeholder="API Secret 将显示在这里" />
                </div>
              </div>
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-500 text-sm">
                  <strong>注意:</strong> API Secret 只会显示一次，请妥善保管。如果丢失，需要重新生成。
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-dark-300 border border-color-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">安全设置</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">修改密码</p>
                  <p className="text-text-secondary text-sm mt-1">定期修改密码以保护账户安全</p>
                </div>
                <button className="bg-dark-400 hover:bg-dark-500 text-text-primary px-4 py-2 rounded-lg transition-colors">
                  修改
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">两步验证</p>
                  <p className="text-text-secondary text-sm mt-1">开启后登录需要验证码</p>
                </div>
                <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors">
                  开启
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">登录设备管理</p>
                  <p className="text-text-secondary text-sm mt-1">查看和管理已登录设备</p>
                </div>
                <button className="bg-dark-400 hover:bg-dark-500 text-text-primary px-4 py-2 rounded-lg transition-colors">
                  管理
                </button>
              </div>
            </div>
          </div>
          <div className="bg-dark-300 border border-color-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">订阅信息</h3>
            <div className="p-4 bg-dark-400 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">专业版</p>
                  <p className="text-text-secondary text-sm mt-1">有效期至 2024-12-31</p>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                  已激活
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">AI 信号</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">策略回测</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">实时行情</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">API 访问</span>
                  <span className="text-green-500">✓</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-lg transition-colors font-semibold">
              续费/升级
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;