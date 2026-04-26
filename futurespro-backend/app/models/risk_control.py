from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, DECIMAL
from sqlalchemy.sql import func
from app.models.user import Base


class RiskControlRule(Base):
    """风控规则模型"""
    __tablename__ = "risk_control_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rule_name = Column(String(100), nullable=False)
    rule_type = Column(String(50), nullable=False)  # 规则类型：order_frequency, trade_volume, loss_limit等
    threshold = Column(DECIMAL(18, 2))  # 阈值
    time_window = Column(Integer)  # 时间窗口（秒）
    action = Column(String(50), nullable=False)  # 触发动作：warning, limit_trade, freeze_account等
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
