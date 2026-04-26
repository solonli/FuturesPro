from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date
from app.models.user import GenderEnum


class UserBase(BaseModel):
    """用户基础模型"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    phone: Optional[str] = None
    real_name: Optional[str] = None
    gender: Optional[GenderEnum] = None
    birthday: Optional[date] = None
    country: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None


class UserCreate(UserBase):
    """用户创建模型"""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """用户更新模型"""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    real_name: Optional[str] = None
    gender: Optional[GenderEnum] = None
    birthday: Optional[date] = None
    country: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserInDB(UserBase):
    """数据库中的用户模型"""
    id: int
    avatar_url: Optional[str] = None
    is_verified: bool
    status: int
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
