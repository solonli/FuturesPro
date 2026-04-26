from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserInDB

router = APIRouter()


@router.get("/me", response_model=UserInDB)
async def get_current_user(
    current_user: User = Depends(get_current_active_user)
):
    """获取当前用户信息"""
    return current_user


@router.put("/me", response_model=UserInDB)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """更新当前用户信息"""
    # 更新用户信息
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


@router.get("/{user_id}", response_model=UserInDB)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取指定用户信息"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("/", response_model=List[UserInDB])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取用户列表"""
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    
    return users
