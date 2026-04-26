from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from datetime import date

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.account import Account
from app.models.order import Order
from app.models.signal import Signal

router = APIRouter()


@router.get("/orders", response_model=List[dict])
async def get_order_history(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    contract_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取订单历史"""
    # 获取用户账户
    result = await db.execute(select(Account).where(Account.user_id == current_user.id))
    accounts = result.scalars().all()
    account_ids = [account.id for account in accounts]
    
    # 构建查询
    query = select(Order).where(Order.account_id.in_(account_ids))
    
    # 过滤条件
    if start_date:
        query = query.where(Order.created_at >= start_date)
    if end_date:
        query = query.where(Order.created_at <= end_date)
    if contract_id:
        query = query.where(Order.contract_id == contract_id)
    if status:
        query = query.where(Order.status == status)
    
    # 排序和分页
    query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)
    
    order_result = await db.execute(query)
    orders = order_result.scalars().all()
    
    return [
        {
            "id": order.id,
            "contract_id": order.contract_id,
            "direction": order.direction,
            "offset": order.offset,
            "order_type": order.order_type,
            "price": float(order.price) if order.price else None,
            "volume": order.volume,
            "status": order.status,
            "strategy_id": order.strategy_id,
            "created_at": order.created_at
        }
        for order in orders
    ]


@router.get("/signals", response_model=List[dict])
async def get_signal_history(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    contract_id: Optional[int] = None,
    signal_type: Optional[str] = None,
    source: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取信号历史"""
    # 构建查询
    query = select(Signal)
    
    # 过滤条件
    if start_date:
        query = query.where(Signal.created_at >= start_date)
    if end_date:
        query = query.where(Signal.created_at <= end_date)
    if contract_id:
        query = query.where(Signal.contract_id == contract_id)
    if signal_type:
        query = query.where(Signal.signal_type == signal_type)
    if source:
        query = query.where(Signal.source == source)
    
    # 排序和分页
    query = query.order_by(Signal.created_at.desc()).offset(skip).limit(limit)
    
    signal_result = await db.execute(query)
    signals = signal_result.scalars().all()
    
    return [
        {
            "id": signal.id,
            "contract_id": signal.contract_id,
            "signal_type": signal.signal_type,
            "strength": float(signal.strength),
            "source": signal.source,
            "reason": signal.reason,
            "price_at_signal": float(signal.price_at_signal),
            "is_valid": signal.is_valid,
            "created_at": signal.created_at
        }
        for signal in signals
    ]
