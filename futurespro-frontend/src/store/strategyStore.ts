import { create } from 'zustand';
import type { Strategy, StrategyCreate, StrategyUpdate } from '../types/strategy';
import { strategyApi } from '../services/api';

interface StrategyState {
  // 状态
  strategies: Strategy[];
  currentStrategy: Strategy | null;
  loading: boolean;
  error: string | null;
  
  // 操作
  fetchStrategies: () => Promise<void>;
  fetchStrategy: (id: number) => Promise<void>;
  createStrategy: (strategy: StrategyCreate) => Promise<Strategy>;
  updateStrategy: (id: number, strategy: StrategyUpdate) => Promise<Strategy>;
  deleteStrategy: (id: number) => Promise<void>;
  startStrategy: (id: number) => Promise<Strategy>;
  stopStrategy: (id: number) => Promise<Strategy>;
  getAISuggestions: (id: number) => Promise<any>;
  clearError: () => void;
}

export const useStrategyStore = create<StrategyState>((set) => ({
  // 初始状态
  strategies: [],
  currentStrategy: null,
  loading: false,
  error: null,
  
  // 获取策略列表
  fetchStrategies: async () => {
    set({ loading: true, error: null });
    try {
      const strategies = await strategyApi.getStrategies();
      set({ strategies, loading: false });
    } catch (error) {
      set({ error: '获取策略列表失败', loading: false });
    }
  },
  
  // 获取策略详情
  fetchStrategy: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const strategy = await strategyApi.getStrategy(id);
      set({ currentStrategy: strategy, loading: false });
    } catch (error) {
      set({ error: '获取策略详情失败', loading: false });
    }
  },
  
  // 创建策略
  createStrategy: async (strategy: StrategyCreate) => {
    set({ loading: true, error: null });
    try {
      const newStrategy = await strategyApi.createStrategy(strategy);
      set((state) => ({
        strategies: [newStrategy, ...state.strategies],
        loading: false
      }));
      return newStrategy;
    } catch (error) {
      set({ error: '创建策略失败', loading: false });
      throw error;
    }
  },
  
  // 更新策略
  updateStrategy: async (id: number, strategy: StrategyUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedStrategy = await strategyApi.updateStrategy(id, strategy);
      set((state) => ({
        strategies: state.strategies.map(s => s.id === id ? updatedStrategy : s),
        currentStrategy: state.currentStrategy?.id === id ? updatedStrategy : state.currentStrategy,
        loading: false
      }));
      return updatedStrategy;
    } catch (error) {
      set({ error: '更新策略失败', loading: false });
      throw error;
    }
  },
  
  // 删除策略
  deleteStrategy: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await strategyApi.deleteStrategy(id);
      set((state) => ({
        strategies: state.strategies.filter(s => s.id !== id),
        currentStrategy: state.currentStrategy?.id === id ? null : state.currentStrategy,
        loading: false
      }));
    } catch (error) {
      set({ error: '删除策略失败', loading: false });
      throw error;
    }
  },
  
  // 启动策略
  startStrategy: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const updatedStrategy = await strategyApi.startStrategy(id);
      set((state) => ({
        strategies: state.strategies.map(s => s.id === id ? updatedStrategy : s),
        currentStrategy: state.currentStrategy?.id === id ? updatedStrategy : state.currentStrategy,
        loading: false
      }));
      return updatedStrategy;
    } catch (error) {
      set({ error: '启动策略失败', loading: false });
      throw error;
    }
  },
  
  // 停止策略
  stopStrategy: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const updatedStrategy = await strategyApi.stopStrategy(id);
      set((state) => ({
        strategies: state.strategies.map(s => s.id === id ? updatedStrategy : s),
        currentStrategy: state.currentStrategy?.id === id ? updatedStrategy : state.currentStrategy,
        loading: false
      }));
      return updatedStrategy;
    } catch (error) {
      set({ error: '停止策略失败', loading: false });
      throw error;
    }
  },
  
  // 获取AI优化建议
  getAISuggestions: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const suggestions = await strategyApi.getAISuggestions(id);
      set({ loading: false });
      return suggestions;
    } catch (error) {
      set({ error: '获取AI优化建议失败', loading: false });
      throw error;
    }
  },
  
  // 清除错误
  clearError: () => {
    set({ error: null });
  },
}));
