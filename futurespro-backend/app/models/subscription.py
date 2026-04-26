from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, DECIMAL
from sqlalchemy.sql import func
from app.models.user import Base


class Subscription(Base):
    """订阅模型"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_name = Column(String(100), nullable=False)
    plan_type = Column(String(50), nullable=False)  # 订阅类型：free, basic, premium等
    price = Column(DECIMAL(18, 2), nullable=False)
    billing_cycle = Column(String(50), nullable=False)  #  billing周期：monthly, yearly等
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), nullable=False)  # 状态：active, expired, cancelled等
    auto_renew = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
