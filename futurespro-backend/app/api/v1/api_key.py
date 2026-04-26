from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import secrets
import hashlib

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.api_key import ApiKey

router = APIRouter()


class ApiKeyCreate(BaseModel):
    """API密钥创建模型"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    scope: Optional[str] = Field(None, max_length=500)
    expires_in: Optional[int] = Field(None, description="过期时间（天）")


class ApiKeyResponse(BaseModel):
    """API密钥响应模型"""
    id: int
    name: str
    description: str
    scope: str
    is_active: bool
    expires_at: datetime
    created_at: datetime
    
    class Config:
        orm_mode = True


class ApiKeyWithSecret(BaseModel):
    """包含密钥的API密钥响应模型"""
    api_key: ApiKeyResponse
    secret: str


@router.post("/", response_model=ApiKeyWithSecret, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    api_key_create: ApiKeyCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """生成新的API密钥"""
    # 生成随机密钥
    secret = secrets.token_urlsafe(32)
    # 计算密钥的哈希值
    key_hash = hashlib.sha256(secret.encode()).hexdigest()
    
    # 计算过期时间
    expires_at = None
    if api_key_create.expires_in:
        expires_at = datetime.utcnow() + timedelta(days=api_key_create.expires_in)
    
    # 创建API密钥
    db_api_key = ApiKey(
        user_id=current_user.id,
        key_hash=key_hash,
        name=api_key_create.name,
        description=api_key_create.description,
        scope=api_key_create.scope,
        expires_at=expires_at
    )
    
    db.add(db_api_key)
    await db.commit()
    await db.refresh(db_api_key)
    
    # 构建响应
    api_key_response = ApiKeyResponse.from_orm(db_api_key)
    
    return {"api_key": api_key_response, "secret": secret}


@router.get("/", response_model=List[ApiKeyResponse])
async def list_api_keys(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """列出用户的所有API密钥"""
    result = await db.execute(select(ApiKey).where(ApiKey.user_id == current_user.id))
    api_keys = result.scalars().all()
    
    return [ApiKeyResponse.from_orm(api_key) for api_key in api_keys]


@router.delete("/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """撤销API密钥"""
    # 查找API密钥
    result = await db.execute(
        select(ApiKey)
        .where(ApiKey.id == api_key_id)
        .where(ApiKey.user_id == current_user.id)
    )
    api_key = result.scalars().first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    # 撤销API密钥
    api_key.is_active = False
    
    await db.commit()
    
    return None
