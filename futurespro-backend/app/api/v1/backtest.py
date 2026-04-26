from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime

from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.backtest import BacktestCreate, BacktestExecute, Backtest as BacktestSchema
from app.engine import BacktestEngine, TestStrategy, DataLoader

# 内存存储模拟数据库
backtest_history = []
backtest_id_counter = 1

router = APIRouter()


@router.post("/", response_model=BacktestSchema, status_code=status.HTTP_201_CREATED)
async def create_backtest(
    backtest_in: BacktestCreate,
    current_user: User = Depends(get_current_active_user)
):
    """创建回测"""
    # 模拟策略验证
    # 实际应用中应该从数据库验证策略
    
    # 创建回测记录
    global backtest_id_counter
    backtest = {
        "id": backtest_id_counter,
        "strategy_id": backtest_in.strategy_id,
        "user_id": current_user.id,
        "contract_id": backtest_in.contract_id,
        "start_date": backtest_in.start_date,
        "end_date": backtest_in.end_date,
        "initial_capital": backtest_in.initial_capital,
        "final_capital": None,
        "total_return": None,
        "max_drawdown": None,
        "sharpe_ratio": None,
        "created_at": datetime.now()
    }
    
    backtest_history.append(backtest)
    backtest_id_counter += 1
    
    # 这里可以添加异步任务来执行回测
    
    return backtest


@router.get("/", response_model=List[BacktestSchema])
async def get_backtests(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
):
    """获取回测列表"""
    user_backtests = [bt for bt in backtest_history if bt["user_id"] == current_user.id]
    sorted_backtests = sorted(user_backtests, key=lambda x: x["created_at"], reverse=True)
    return sorted_backtests[skip:skip+limit]


@router.get("/{backtest_id}", response_model=BacktestSchema)
async def get_backtest(
    backtest_id: int,
    current_user: User = Depends(get_current_active_user)
):
    """获取回测详情"""
    backtest = next((bt for bt in backtest_history if bt["id"] == backtest_id and bt["user_id"] == current_user.id), None)
    
    if not backtest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backtest not found"
        )
    
    return backtest


@router.post("/execute", response_model=Dict[str, Any])
async def execute_backtest(
    backtest_in: BacktestExecute,
    current_user: User = Depends(get_current_active_user)
):
    """执行回测"""
    # 模拟策略验证
    # 实际应用中应该从数据库验证策略
    
    # 初始化回测引擎和数据加载器
    engine = BacktestEngine()
    data_loader = DataLoader()
    
    # 获取历史数据
    data = data_loader.get_historical_data(
        backtest_in.contract_id,
        backtest_in.start_date,
        backtest_in.end_date
    )
    
    # 运行回测
    strategy_params = backtest_in.strategy_params or {
        'fast_period': 10,
        'slow_period': 20
    }
    
    result = engine.run_backtest(
        TestStrategy,
        data,
        float(backtest_in.initial_capital),
        strategy_params
    )
    
    # 保存回测结果到内存存储
    global backtest_id_counter
    backtest = {
        "id": backtest_id_counter,
        "strategy_id": backtest_in.strategy_id,
        "user_id": current_user.id,
        "contract_id": backtest_in.contract_id,
        "start_date": backtest_in.start_date,
        "end_date": backtest_in.end_date,
        "initial_capital": backtest_in.initial_capital,
        "final_capital": result['final_capital'],
        "total_return": result['total_return'],
        "max_drawdown": result['max_drawdown'],
        "sharpe_ratio": result['sharpe_ratio'],
        "created_at": datetime.now()
    }
    
    backtest_history.append(backtest)
    backtest_id_counter += 1
    
    # 返回回测结果
    return {
        'backtest_id': backtest["id"],
        'results': result
    }
