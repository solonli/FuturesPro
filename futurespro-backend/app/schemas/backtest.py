from pydantic import BaseModel
from typing import Optional, Dict, Any
from decimal import Decimal
from datetime import datetime, date


class BacktestBase(BaseModel):
    """回测基础模式"""
    strategy_id: int
    contract_id: int
    start_date: date
    end_date: date
    initial_capital: Decimal


class BacktestCreate(BacktestBase):
    """回测创建模式"""
    pass


class BacktestExecute(BacktestBase):
    """回测执行模式"""
    strategy_params: Optional[Dict[str, Any]] = None


class Backtest(BacktestBase):
    """回测模式"""
    id: int
    user_id: int
    final_capital: Optional[Decimal] = None
    total_return: Optional[Decimal] = None
    max_drawdown: Optional[Decimal] = None
    sharpe_ratio: Optional[Decimal] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
