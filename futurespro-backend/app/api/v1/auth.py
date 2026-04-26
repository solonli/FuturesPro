from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta

from app.__init__ import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User
from app.schemas.auth import UserCreate, UserInDB, Token

router = APIRouter()


@router.post("/register", response_model=UserInDB, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """用户注册"""
    # 检查用户名是否已存在
    result = await db.execute(select(User).where(User.username == user_in.username))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # 检查邮箱是否已存在
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hashed_password,
        phone=user_in.phone
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """用户登录"""
    # 查找用户
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 创建访问令牌
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
