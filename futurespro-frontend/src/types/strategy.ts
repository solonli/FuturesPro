export interface Strategy {
  id: number;
  user_id: number;
  name: string;
  description: string;
  type: string;
  config: Record<string, any>;
  status: string;
  total_pnl: number;
  win_rate: number | null;
  created_at: string;
  performance?: {
    total_return: number;
    win_rate: number;
    max_drawdown: number;
  };
}

export interface StrategyCreate {
  name: string;
  description: string;
  type: string;
  config: Record<string, any>;
}

export interface StrategyUpdate {
  name: string;
  description: string;
  type: string;
  config: Record<string, any>;
}
