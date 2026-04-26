from pydantic import BaseModel
from typing import Optional, Dict, Any
from decimal import Decimal
from datetime import datetime


class StrategyBase(BaseModel):
    """策略基础模式"""
    name: str
    description: Optional[str] = None
    type: str
    config: Optional[Dict[str, Any]] = None


class StrategyCreate(StrategyBase):
    """策略创建模式"""
    pass


class Strategy(StrategyBase):
    """策略模式"""
    id: int
    user_id: int
    status: str
    total_pnl: Decimal
    win_rate: Optional[Decimal] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
