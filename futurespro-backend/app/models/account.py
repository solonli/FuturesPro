from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.models.user import Base


class Account(Base):
    """账户模型"""
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    broker_id = Column(String(50))
    balance = Column(DECIMAL(18, 2), default=0)
    frozen_balance = Column(DECIMAL(18, 2), default=0)
    total_pnl = Column(DECIMAL(18, 2), default=0)
    currency = Column(String(10), default="CNY")
    status = Column(Integer, default=1)  # 1-正常 0-禁用
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
