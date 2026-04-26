from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.models.user import Base


class Order(Base):
    """订单模型"""
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    direction = Column(String(4), nullable=False)  # BUY/SELL
    offset = Column(String(6), nullable=False)  # OPEN/CLOSE/CLOSETODAY
    order_type = Column(String(10), default="LIMIT")  # LIMIT/MARKET/STOP
    price = Column(DECIMAL(18, 4))
    volume = Column(Integer, nullable=False)
    status = Column(String(20), default="PENDING")  # PENDING/PARTIAL/FILLED/CANCELLED/REJECTED
    strategy_id = Column(Integer, ForeignKey("strategies.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
