from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.account import Account
from app.models.order import Order
from app.models.position import Position
from app.schemas.trading import OrderCreate, Order as OrderSchema, Position as PositionSchema

router = APIRouter()


@router.post("/orders", response_model=OrderSchema, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """创建订单"""
    # 获取用户账户（这里简化处理，使用第一个账户）
    result = await db.execute(select(Account).where(Account.user_id == current_user.id))
    account = result.scalars().first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # 创建订单
    db_order = Order(
        account_id=account.id,
        contract_id=order_in.contract_id,
        direction=order_in.direction,
        offset=order_in.offset,
        order_type=order_in.order_type,
        price=order_in.price,
        volume=order_in.volume,
        strategy_id=order_in.strategy_id
    )
    
    db.add(db_order)
    await db.commit()
    await db.refresh(db_order)
    
    return db_order


@router.get("/orders", response_model=List[OrderSchema])
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取订单列表"""
    # 获取用户账户
    result = await db.execute(select(Account).where(Account.user_id == current_user.id))
    accounts = result.scalars().all()
    account_ids = [account.id for account in accounts]
    
    # 查询订单
    order_result = await db.execute(
        select(Order)
        .where(Order.account_id.in_(account_ids))
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    orders = order_result.scalars().all()
    
    return orders


@router.get("/positions", response_model=List[PositionSchema])
async def get_positions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取持仓列表"""
    # 获取用户账户
    result = await db.execute(select(Account).where(Account.user_id == current_user.id))
    accounts = result.scalars().all()
    account_ids = [account.id for account in accounts]
    
    # 查询持仓
    position_result = await db.execute(
        select(Position)
        .where(Position.account_id.in_(account_ids))
        .order_by(Position.updated_at.desc())
    )
    positions = position_result.scalars().all()
    
    return positions
