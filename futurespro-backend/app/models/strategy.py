from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.models.user import Base


class Strategy(Base):
    """策略模型"""
    __tablename__ = "strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    type = Column(String(30), nullable=False)  # TREND/MEAN_REVERSION/BREAKOUT/GRID/ML
    config = Column(JSON)  # 策略参数配置
    status = Column(String(20), default="DRAFT")  # DRAFT/ACTIVE/PAUSED/ARCHIVED
    total_pnl = Column(DECIMAL(18, 2), default=0)
    win_rate = Column(DECIMAL(5, 4))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
