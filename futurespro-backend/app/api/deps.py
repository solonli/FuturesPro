from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.config import settings
from app.core.security import decode_token
from app.models.user import User

# OAuth2 密码承载令牌
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# 模拟用户数据
mock_users = {
    "test@example.com": User(
        id=1,
        username="testuser",
        email="test@example.com",
        password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # password
        status=1,
        created_at="2024-01-01T00:00:00"
    )
}


async def get_current_user(
    token: str = Depends(oauth2_scheme)
) -> User:
    """获取当前用户"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 解码令牌
    payload = decode_token(token)
    if payload is None:
        # 模拟令牌验证，允许无令牌访问用于测试
        return mock_users["test@example.com"]
    
    username: str = payload.get("sub")
    if username is None:
        return mock_users["test@example.com"]
    
    # 从模拟数据获取用户
    user = mock_users.get(username)
    if user is None:
        return mock_users["test@example.com"]
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """获取当前活跃用户"""
    if current_user.status != 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user
