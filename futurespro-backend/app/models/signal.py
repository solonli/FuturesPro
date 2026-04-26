from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.models.user import Base


class Signal(Base):
    """AI信号模型"""
    __tablename__ = "ai_signals"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    signal_type = Column(String(20), nullable=False)  # BUY/SELL/HOLD
    strength = Column(DECIMAL(5, 2))  # 信号强度 (0-100)
    source = Column(String(30), nullable=False)  # ML/TECHNICAL/SENTIMENT
    reason = Column(Text)  # 信号原因说明
    price_at_signal = Column(DECIMAL(18, 4))  # 信号触发时价格
    is_valid = Column(Boolean, default=True)  # 是否有效
    created_at = Column(DateTime(timezone=True), server_default=func.now())
