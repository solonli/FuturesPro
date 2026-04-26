from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.models.user import Base


class Position(Base):
    """持仓模型"""
    __tablename__ = "positions"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    direction = Column(String(4), nullable=False)  # LONG/SHORT
    volume = Column(Integer, nullable=False)
    avg_price = Column(DECIMAL(18, 4))
    current_price = Column(DECIMAL(18, 4))
    unrealized_pnl = Column(DECIMAL(18, 2))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
