from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base
import enum

Base = declarative_base()


class GenderEnum(enum.Enum):
    """性别枚举"""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class User(Base):
    """用户模型"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20))
    avatar_url = Column(String(500))
    real_name = Column(String(50))
    gender = Column(Enum(GenderEnum))
    birthday = Column(Date)
    country = Column(String(50))
    city = Column(String(50))
    bio = Column(String(500))
    is_verified = Column(Boolean, default=False)
    last_login_at = Column(DateTime(timezone=True))
    status = Column(Integer, default=1)  # 1-正常 0-禁用
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
