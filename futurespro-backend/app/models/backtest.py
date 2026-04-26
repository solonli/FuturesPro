from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey, Date
from sqlalchemy.sql import func
from app.models.user import Base


class Backtest(Base):
    """回测记录模型"""
    __tablename__ = "backtests"
    
    id = Column(Integer, primary_key=True, index=True)
    strategy_id = Column(Integer, ForeignKey("strategies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    initial_capital = Column(DECIMAL(18, 2), nullable=False)
    final_capital = Column(DECIMAL(18, 2))
    total_return = Column(DECIMAL(10, 4))
    max_drawdown = Column(DECIMAL(10, 4))
    sharpe_ratio = Column(DECIMAL(10, 4))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
