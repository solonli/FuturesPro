from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel, Field
from datetime import datetime, timedelta

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.subscription import Subscription

router = APIRouter()


class SubscriptionCreate(BaseModel):
    """订阅创建模型"""
    plan_name: str = Field(..., min_length=1, max_length=100)
    plan_type: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0)
    billing_cycle: str = Field(..., min_length=1, max_length=50)
    auto_renew: bool = True


class SubscriptionUpdate(BaseModel):
    """订阅更新模型"""
    plan_name: str = Field(None, min_length=1, max_length=100)
    plan_type: str = Field(None, min_length=1, max_length=50)
    price: float = Field(None, gt=0)
    billing_cycle: str = Field(None, min_length=1, max_length=50)
    status: str = Field(None, min_length=1, max_length=50)
    auto_renew: bool = None


class SubscriptionResponse(BaseModel):
    """订阅响应模型"""
    id: int
    plan_name: str
    plan_type: str
    price: float
    billing_cycle: str
    start_date: datetime
    end_date: datetime
    status: str
    auto_renew: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


@router.post("/", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    subscription_create: SubscriptionCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """创建订阅"""
    # 计算结束时间
    if subscription_create.billing_cycle == "monthly":
        end_date = datetime.utcnow() + timedelta(days=30)
    elif subscription_create.billing_cycle == "yearly":
        end_date = datetime.utcnow() + timedelta(days=365)
    else:
        end_date = datetime.utcnow() + timedelta(days=30)  # 默认30天
    
    # 创建订阅
    db_subscription = Subscription(
        user_id=current_user.id,
        plan_name=subscription_create.plan_name,
        plan_type=subscription_create.plan_type,
        price=subscription_create.price,
        billing_cycle=subscription_create.billing_cycle,
        end_date=end_date,
        status="active",
        auto_renew=subscription_create.auto_renew
    )
    
    db.add(db_subscription)
    await db.commit()
    await db.refresh(db_subscription)
    
    return db_subscription


@router.get("/", response_model=List[SubscriptionResponse])
async def list_subscriptions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """列出用户的所有订阅"""
    result = await db.execute(select(Subscription).where(Subscription.user_id == current_user.id))
    subscriptions = result.scalars().all()
    
    return subscriptions


@router.get("/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription(
    subscription_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取指定订阅"""
    result = await db.execute(
        select(Subscription)
        .where(Subscription.id == subscription_id)
        .where(Subscription.user_id == current_user.id)
    )
    subscription = result.scalars().first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    return subscription


@router.put("/{subscription_id}", response_model=SubscriptionResponse)
async def update_subscription(
    subscription_id: int,
    subscription_update: SubscriptionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """更新订阅"""
    # 查找订阅
    result = await db.execute(
        select(Subscription)
        .where(Subscription.id == subscription_id)
        .where(Subscription.user_id == current_user.id)
    )
    subscription = result.scalars().first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    # 更新订阅
    for key, value in subscription_update.model_dump(exclude_unset=True).items():
        setattr(subscription, key, value)
    
    await db.commit()
    await db.refresh(subscription)
    
    return subscription


@router.delete("/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_subscription(
    subscription_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """取消订阅"""
    # 查找订阅
    result = await db.execute(
        select(Subscription)
        .where(Subscription.id == subscription_id)
        .where(Subscription.user_id == current_user.id)
    )
    subscription = result.scalars().first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    # 取消订阅
    subscription.status = "cancelled"
    subscription.auto_renew = False
    
    await db.commit()
    
    return None
