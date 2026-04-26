from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.signal import Signal

router = APIRouter()


@router.get("/signals", response_model=List[dict])
async def get_signals(
    contract_id: int = None,
    signal_type: str = None,
    source: str = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取交易信号"""
    query = select(Signal).where(Signal.is_valid == True)
    
    # 过滤条件
    if contract_id:
        query = query.where(Signal.contract_id == contract_id)
    if signal_type:
        query = query.where(Signal.signal_type == signal_type)
    if source:
        query = query.where(Signal.source == source)
    
    # 排序和分页
    query = query.order_by(Signal.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    signals = result.scalars().all()
    
    return [
        {
            "id": signal.id,
            "contract_id": signal.contract_id,
            "signal_type": signal.signal_type,
            "strength": float(signal.strength),
            "source": signal.source,
            "reason": signal.reason,
            "price_at_signal": float(signal.price_at_signal),
            "created_at": signal.created_at
        }
        for signal in signals
    ]


@router.get("/market-sentiment")
async def get_market_sentiment(
    current_user: User = Depends(get_current_active_user)
):
    """获取市场情绪分析"""
    # 这里可以添加市场情绪分析逻辑
    return {
        "overall_sentiment": "neutral",
        "sentiment_score": 0.5,
        "dominant_factors": ["economic_data", "geopolitical_events"],
        "sector_sentiment": {
            "energy": "bullish",
            "metals": "bearish",
            "agriculture": "neutral"
        }
    }
