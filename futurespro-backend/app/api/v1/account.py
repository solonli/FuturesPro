from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel, Field

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.account import Account
from app.schemas.trading import Account as AccountSchema

router = APIRouter()


class FundOperation(BaseModel):
    """资金操作模型"""
    amount: float = Field(..., gt=0)
    description: str = Field(None, max_length=500)


class AccountStatusUpdate(BaseModel):
    """账户状态更新模型"""
    status: int  # 1-正常 0-禁用


@router.get("/", response_model=List[AccountSchema])
async def get_accounts(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取用户账户列表"""
    result = await db.execute(select(Account).where(Account.user_id == current_user.id))
    accounts = result.scalars().all()
    
    return accounts


@router.get("/{account_id}", response_model=AccountSchema)
async def get_account(
    account_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取账户详情"""
    result = await db.execute(
        select(Account)
        .where(Account.id == account_id)
        .where(Account.user_id == current_user.id)
    )
    account = result.scalars().first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    return account


@router.post("/", response_model=AccountSchema, status_code=status.HTTP_201_CREATED)
async def create_account(
    broker_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """创建新账户"""
    # 创建账户
    db_account = Account(
        user_id=current_user.id,
        broker_id=broker_id
    )
    
    db.add(db_account)
    await db.commit()
    await db.refresh(db_account)
    
    return db_account


@router.put("/{account_id}", response_model=AccountSchema)
async def update_account(
    account_id: int,
    broker_id: str = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """更新账户信息"""
    # 查找账户
    result = await db.execute(
        select(Account)
        .where(Account.id == account_id)
        .where(Account.user_id == current_user.id)
    )
    account = result.scalars().first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # 更新账户
    if broker_id:
        account.broker_id = broker_id
    
    await db.commit()
    await db.refresh(account)
    
    return account


@router.post("/{account_id}/deposit", response_model=AccountSchema)
async def deposit(
    account_id: int,
    fund_operation: FundOperation,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """账户充值"""
    # 查找账户
    result = await db.execute(
        select(Account)
        .where(Account.id == account_id)
        .where(Account.user_id == current_user.id)
    )
    account = result.scalars().first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # 充值操作
    account.balance += fund_operation.amount
    
    await db.commit()
    await db.refresh(account)
    
    return account


@router.post("/{account_id}/withdraw", response_model=AccountSchema)
async def withdraw(
    account_id: int,
    fund_operation: FundOperation,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """账户提现"""
    # 查找账户
    result = await db.execute(
        select(Account)
        .where(Account.id == account_id)
        .where(Account.user_id == current_user.id)
    )
    account = result.scalars().first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # 检查余额是否足够
    if account.balance < fund_operation.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    # 提现操作
    account.balance -= fund_operation.amount
    
    await db.commit()
    await db.refresh(account)
    
    return account


@router.put("/{account_id}/status", response_model=AccountSchema)
async def update_account_status(
    account_id: int,
    status_update: AccountStatusUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """更新账户状态"""
    # 查找账户
    result = await db.execute(
        select(Account)
        .where(Account.id == account_id)
        .where(Account.user_id == current_user.id)
    )
    account = result.scalars().first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # 更新账户状态
    account.status = status_update.status
    
    await db.commit()
    await db.refresh(account)
    
    return account
