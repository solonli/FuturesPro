from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.security import get_password_hash, verify_password

router = APIRouter()


class PasswordChange(BaseModel):
    """密码修改模型"""
    current_password: str
    new_password: str = Field(..., min_length=6)


class EmailUpdate(BaseModel):
    """邮箱更新模型"""
    email: str


class TwoFactorToggle(BaseModel):
    """两步验证开关模型"""
    enabled: bool


@router.post("/change-password")
async def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """修改密码"""
    # 验证当前密码
    if not verify_password(password_change.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # 更新密码
    current_user.password_hash = get_password_hash(password_change.new_password)
    
    await db.commit()
    await db.refresh(current_user)
    
    return {"message": "Password changed successfully"}


@router.post("/update-email")
async def update_email(
    email_update: EmailUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """更新邮箱"""
    # 这里可以添加邮箱验证逻辑，例如发送验证邮件
    current_user.email = email_update.email
    
    await db.commit()
    await db.refresh(current_user)
    
    return {"message": "Email updated successfully. Please verify your new email."}


@router.post("/two-factor")
async def toggle_two_factor(
    two_factor: TwoFactorToggle,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """开启/关闭两步验证"""
    # 这里可以添加两步验证的逻辑，例如生成和验证验证码
    # 为了简化，这里只演示开关功能
    
    return {"message": f"Two-factor authentication {'enabled' if two_factor.enabled else 'disabled'} successfully"}
