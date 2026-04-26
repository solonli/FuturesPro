from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel, Field

from app.__init__ import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.risk_control import RiskControlRule

router = APIRouter()


class RiskControlRuleCreate(BaseModel):
    """风控规则创建模型"""
    rule_name: str = Field(..., min_length=1, max_length=100)
    rule_type: str = Field(..., min_length=1, max_length=50)
    threshold: float
    time_window: int = Field(None, description="时间窗口（秒）")
    action: str = Field(..., min_length=1, max_length=50)


class RiskControlRuleUpdate(BaseModel):
    """风控规则更新模型"""
    rule_name: str = Field(None, min_length=1, max_length=100)
    rule_type: str = Field(None, min_length=1, max_length=50)
    threshold: float = None
    time_window: int = Field(None, description="时间窗口（秒）")
    action: str = Field(None, min_length=1, max_length=50)
    is_active: bool = None


class RiskControlRuleResponse(BaseModel):
    """风控规则响应模型"""
    id: int
    rule_name: str
    rule_type: str
    threshold: float
    time_window: int
    action: str
    is_active: bool
    created_at: str
    updated_at: str
    
    class Config:
        orm_mode = True


@router.post("/", response_model=RiskControlRuleResponse, status_code=status.HTTP_201_CREATED)
async def create_risk_control_rule(
    rule_create: RiskControlRuleCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """创建风控规则"""
    # 创建风控规则
    db_rule = RiskControlRule(
        user_id=current_user.id,
        rule_name=rule_create.rule_name,
        rule_type=rule_create.rule_type,
        threshold=rule_create.threshold,
        time_window=rule_create.time_window,
        action=rule_create.action
    )
    
    db.add(db_rule)
    await db.commit()
    await db.refresh(db_rule)
    
    return db_rule


@router.get("/", response_model=List[RiskControlRuleResponse])
async def list_risk_control_rules(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """列出用户的所有风控规则"""
    result = await db.execute(select(RiskControlRule).where(RiskControlRule.user_id == current_user.id))
    rules = result.scalars().all()
    
    return rules


@router.get("/{rule_id}", response_model=RiskControlRuleResponse)
async def get_risk_control_rule(
    rule_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """获取指定风控规则"""
    result = await db.execute(
        select(RiskControlRule)
        .where(RiskControlRule.id == rule_id)
        .where(RiskControlRule.user_id == current_user.id)
    )
    rule = result.scalars().first()
    
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk control rule not found"
        )
    
    return rule


@router.put("/{rule_id}", response_model=RiskControlRuleResponse)
async def update_risk_control_rule(
    rule_id: int,
    rule_update: RiskControlRuleUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """更新风控规则"""
    # 查找风控规则
    result = await db.execute(
        select(RiskControlRule)
        .where(RiskControlRule.id == rule_id)
        .where(RiskControlRule.user_id == current_user.id)
    )
    rule = result.scalars().first()
    
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk control rule not found"
        )
    
    # 更新风控规则
    for key, value in rule_update.model_dump(exclude_unset=True).items():
        setattr(rule, key, value)
    
    await db.commit()
    await db.refresh(rule)
    
    return rule


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_risk_control_rule(
    rule_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """删除风控规则"""
    # 查找风控规则
    result = await db.execute(
        select(RiskControlRule)
        .where(RiskControlRule.id == rule_id)
        .where(RiskControlRule.user_id == current_user.id)
    )
    rule = result.scalars().first()
    
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk control rule not found"
        )
    
    # 删除风控规则
    await db.delete(rule)
    await db.commit()
    
    return None
