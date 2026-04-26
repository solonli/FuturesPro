from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime


class OrderBase(BaseModel):
    """订单基础模式"""
    contract_id: int
    direction: str
    offset: str
    order_type: str = "LIMIT"
    price: Optional[Decimal] = None
    volume: int
    strategy_id: Optional[int] = None


class OrderCreate(OrderBase):
    """订单创建模式"""
    pass


class Order(OrderBase):
    """订单模式"""
    id: int
    account_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class PositionBase(BaseModel):
    """持仓基础模式"""
    contract_id: int
    direction: str
    volume: int
    avg_price: Decimal
    current_price: Decimal
    unrealized_pnl: Decimal


class Position(PositionBase):
    """持仓模式"""
    id: int
    account_id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AccountBase(BaseModel):
    """账户基础模式"""
    broker_id: Optional[str] = None
    balance: Decimal = Decimal(0)
    frozen_balance: Decimal = Decimal(0)
    total_pnl: Decimal = Decimal(0)
    currency: str = "CNY"


class Account(AccountBase):
    """账户模式"""
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
