from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.account import Account
from app.models.position import Position
from app.models.signal import Signal

router = APIRouter()


@router.get("/overview")
async def get_dashboard_overview(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取仪表盘概览"""
    # 获取用户账户
    result = await db.execute(select(Account).where(Account.user_id == current_user.id))
    accounts = result.scalars().all()
    
    # 获取用户持仓
    position_result = await db.execute(
        select(Position).join(Account).where(Account.user_id == current_user.id)
    )
    positions = position_result.scalars().all()
    
    # 获取最新信号
    signal_result = await db.execute(
        select(Signal).where(Signal.is_valid == True).order_by(Signal.created_at.desc()).limit(5)
    )
    signals = signal_result.scalars().all()
    
    # 计算总资产
    total_balance = sum(account.balance for account in accounts)
    total_frozen = sum(account.frozen_balance for account in accounts)
    total_pnl = sum(account.total_pnl for account in accounts)
    
    # 计算持仓统计
    total_positions = len(positions)
    unrealized_pnl = sum(position.unrealized_pnl for position in positions)
    
    return {
        "accounts": [
            {
                "id": account.id,
                "balance": float(account.balance),
                "frozen_balance": float(account.frozen_balance),
                "total_pnl": float(account.total_pnl),
                "currency": account.currency
            }
            for account in accounts
        ],
        "positions": [
            {
                "id": position.id,
                "contract_id": position.contract_id,
                "direction": position.direction,
                "volume": position.volume,
                "avg_price": float(position.avg_price),
                "current_price": float(position.current_price),
                "unrealized_pnl": float(position.unrealized_pnl)
            }
            for position in positions
        ],
        "signals": [
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
        ],
        "stats": {
            "total_balance": float(total_balance),
            "total_frozen": float(total_frozen),
            "total_pnl": float(total_pnl),
            "total_positions": total_positions,
            "unrealized_pnl": float(unrealized_pnl)
        }
    }
