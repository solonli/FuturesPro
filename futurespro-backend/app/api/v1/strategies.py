from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.strategy import Strategy
from app.schemas.strategy import StrategyCreate, Strategy as StrategySchema

router = APIRouter()


@router.post("/", response_model=StrategySchema, status_code=status.HTTP_201_CREATED)
async def create_strategy(
    strategy_in: StrategyCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """创建策略"""
    # 创建策略
    db_strategy = Strategy(
        user_id=current_user.id,
        name=strategy_in.name,
        description=strategy_in.description,
        type=strategy_in.type,
        config=strategy_in.config
    )
    
    db.add(db_strategy)
    await db.commit()
    await db.refresh(db_strategy)
    
    return db_strategy


@router.get("/", response_model=List[StrategySchema])
async def get_strategies(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取策略列表"""
    result = await db.execute(
        select(Strategy)
        .where(Strategy.user_id == current_user.id)
        .order_by(Strategy.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    strategies = result.scalars().all()
    
    return strategies


@router.get("/{strategy_id}", response_model=StrategySchema)
async def get_strategy(
    strategy_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取策略详情"""
    result = await db.execute(
        select(Strategy)
        .where(Strategy.id == strategy_id)
        .where(Strategy.user_id == current_user.id)
    )
    strategy = result.scalars().first()
    
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    
    return strategy


@router.put("/{strategy_id}", response_model=StrategySchema)
async def update_strategy(
    strategy_id: int,
    strategy_in: StrategyCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """更新策略"""
    # 查找策略
    result = await db.execute(
        select(Strategy)
        .where(Strategy.id == strategy_id)
        .where(Strategy.user_id == current_user.id)
    )
    strategy = result.scalars().first()
    
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    
    # 更新策略
    strategy.name = strategy_in.name
    strategy.description = strategy_in.description
    strategy.type = strategy_in.type
    strategy.config = strategy_in.config
    
    await db.commit()
    await db.refresh(strategy)
    
    return strategy


@router.delete("/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_strategy(
    strategy_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """删除策略"""
    # 查找策略
    result = await db.execute(
        select(Strategy)
        .where(Strategy.id == strategy_id)
        .where(Strategy.user_id == current_user.id)
    )
    strategy = result.scalars().first()
    
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    
    # 删除策略
    await db.delete(strategy)
    await db.commit()
    
    return None


@router.post("/{strategy_id}/start", response_model=StrategySchema)
async def start_strategy(
    strategy_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """启动策略"""
    # 查找策略
    result = await db.execute(
        select(Strategy)
        .where(Strategy.id == strategy_id)
        .where(Strategy.user_id == current_user.id)
    )
    strategy = result.scalars().first()
    
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    
    # 更新策略状态为ACTIVE
    strategy.status = "ACTIVE"
    await db.commit()
    await db.refresh(strategy)
    
    return strategy


@router.post("/{strategy_id}/stop", response_model=StrategySchema)
async def stop_strategy(
    strategy_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """停止策略"""
    # 查找策略
    result = await db.execute(
        select(Strategy)
        .where(Strategy.id == strategy_id)
        .where(Strategy.user_id == current_user.id)
    )
    strategy = result.scalars().first()
    
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    
    # 更新策略状态为PAUSED
    strategy.status = "PAUSED"
    await db.commit()
    await db.refresh(strategy)
    
    return strategy


@router.get("/{strategy_id}/ai-suggestions", response_model=Dict[str, Any])
async def get_ai_suggestions(
    strategy_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取AI优化建议"""
    # 查找策略
    result = await db.execute(
        select(Strategy)
        .where(Strategy.id == strategy_id)
        .where(Strategy.user_id == current_user.id)
    )
    strategy = result.scalars().first()
    
    if not strategy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Strategy not found"
        )
    
    # 模拟AI优化建议
    suggestions = [
        {
            "title": "参数优化",
            "description": "建议调整移动平均线的周期参数，从当前的20/50调整为15/45，以提高信号的灵敏度。",
            "impact": "预期收益率提升3-5%"
        },
        {
            "title": "止损策略",
            "description": "建议添加动态止损机制，根据市场波动率自动调整止损幅度。",
            "impact": "预期最大回撤减少2-3%"
        },
        {
            "title": "资金管理",
            "description": "建议采用固定比例资金管理策略，每次交易风险控制在总资金的1-2%。",
            "impact": "提高策略的稳定性和可持续性"
        }
    ]
    
    return {"suggestions": suggestions}

