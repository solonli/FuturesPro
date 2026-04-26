import axios from 'axios';
import type { Strategy, StrategyCreate, StrategyUpdate } from '../types/strategy';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加认证token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 策略相关API
export const strategyApi = {
  // 获取策略列表
  getStrategies: async (): Promise<Strategy[]> => {
    const response = await api.get('/strategies');
    return response.data;
  },

  // 获取策略详情
  getStrategy: async (id: number): Promise<Strategy> => {
    const response = await api.get(`/strategies/${id}`);
    return response.data;
  },

  // 创建策略
  createStrategy: async (strategy: StrategyCreate): Promise<Strategy> => {
    const response = await api.post('/strategies', strategy);
    return response.data;
  },

  // 更新策略
  updateStrategy: async (id: number, strategy: StrategyUpdate): Promise<Strategy> => {
    const response = await api.put(`/strategies/${id}`, strategy);
    return response.data;
  },

  // 删除策略
  deleteStrategy: async (id: number): Promise<void> => {
    await api.delete(`/strategies/${id}`);
  },

  // 启动策略
  startStrategy: async (id: number): Promise<Strategy> => {
    const response = await api.post(`/strategies/${id}/start`);
    return response.data;
  },

  // 停止策略
  stopStrategy: async (id: number): Promise<Strategy> => {
    const response = await api.post(`/strategies/${id}/stop`);
    return response.data;
  },

  // 获取AI优化建议
  getAISuggestions: async (id: number): Promise<any> => {
    const response = await api.get(`/strategies/${id}/ai-suggestions`);
    return response.data;
  },
};

// 交易相关API
export const tradingApi = {
  // 创建订单
  createOrder: async (order: any): Promise<any> => {
    const response = await api.post('/trading/orders', order);
    return response.data;
  },

  // 获取订单列表
  getOrders: async (): Promise<any[]> => {
    const response = await api.get('/trading/orders');
    return response.data;
  },

  // 获取持仓列表
  getPositions: async (): Promise<any[]> => {
    const response = await api.get('/trading/positions');
    return response.data;
  },
};

// 行情相关API
export const marketApi = {
  // 获取K线数据
  getKlineData: async (symbol: string, interval: string): Promise<any[]> => {
    const response = await api.get(`/market/kline`, {
      params: { symbol, interval }
    });
    return response.data;
  },

  // 获取订单簿数据
  getOrderBook: async (symbol: string): Promise<any> => {
    const response = await api.get(`/market/orderbook`, {
      params: { symbol }
    });
    return response.data;
  },
};

export default api;
