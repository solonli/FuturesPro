from fastapi import APIRouter

# 创建 v1 版本路由
router = APIRouter()

# 添加基本的健康检查路由
@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "FuturesPro API is running"}

# 策略相关路由
@router.get("/strategies")
async def get_strategies():
    # 返回模拟数据
    return [
        {
            "id": 1,
            "name": "趋势跟随策略",
            "type": "趋势跟随",
            "status": "ACTIVE",
            "total_pnl": 12.5,
            "win_rate": 65.2
        },
        {
            "id": 2,
            "name": "均值回归策略",
            "type": "均值回归",
            "status": "PAUSED",
            "total_pnl": -3.2,
            "win_rate": 45.8
        },
        {
            "id": 3,
            "name": "突破策略",
            "type": "突破",
            "status": "DRAFT",
            "total_pnl": 0,
            "win_rate": 0
        }
    ]

@router.get("/strategies/{id}")
async def get_strategy(id: int):
    return {
        "id": id,
        "name": "趋势跟随策略",
        "type": "趋势跟随",
        "status": "ACTIVE",
        "total_pnl": 12.5,
        "win_rate": 65.2,
        "parameters": {
            "period": 20,
            "threshold": 0.02
        }
    }

@router.post("/strategies")
async def create_strategy(strategy: dict):
    return {
        "id": 4,
        **strategy,
        "status": "DRAFT",
        "total_pnl": 0,
        "win_rate": 0
    }

@router.put("/strategies/{id}")
async def update_strategy(id: int, strategy: dict):
    return {
        "id": id,
        **strategy,
        "total_pnl": 12.5,
        "win_rate": 65.2
    }

@router.delete("/strategies/{id}")
async def delete_strategy(id: int):
    return {"message": "策略删除成功"}

@router.post("/strategies/{id}/start")
async def start_strategy(id: int):
    return {
        "id": id,
        "name": "趋势跟随策略",
        "type": "趋势跟随",
        "status": "ACTIVE",
        "total_pnl": 12.5,
        "win_rate": 65.2
    }

@router.post("/strategies/{id}/stop")
async def stop_strategy(id: int):
    return {
        "id": id,
        "name": "趋势跟随策略",
        "type": "趋势跟随",
        "status": "PAUSED",
        "total_pnl": 12.5,
        "win_rate": 65.2
    }

@router.get("/strategies/{id}/ai-suggestions")
async def get_ai_suggestions(id: int):
    return {
        "strategy_id": id,
        "suggestions": [
            "建议调整参数period为25，提高趋势识别能力",
            "建议增加止损参数，控制最大回撤",
            "建议在高波动市场中降低仓位"
        ]
    }

# 交易相关路由
@router.post("/trading/orders")
async def create_order(order: dict):
    return {
        "id": 1,
        **order,
        "status": "FILLED",
        "filled_price": 3850.00
    }

@router.get("/trading/orders")
async def get_orders():
    return [
        {
            "id": 1,
            "symbol": "螺纹钢2510",
            "direction": "BUY",
            "volume": 2,
            "price": 3850.00,
            "status": "FILLED",
            "filled_price": 3850.00,
            "created_at": "2024-01-01T10:00:00"
        }
    ]

@router.get("/trading/positions")
async def get_positions():
    return [
        {
            "id": 1,
            "symbol": "螺纹钢2510",
            "exchange": "SHFE",
            "direction": "多头",
            "volume": 2,
            "avg_price": 3850.00,
            "current_price": 3920.00,
            "pnl": 1400.00
        }
    ]

# 行情相关路由
@router.get("/market/kline")
async def get_kline_data(symbol: str, interval: str):
    return [
        [1672531200000, 3800, 3850, 3780, 3820, 10000],
        [1672617600000, 3820, 3880, 3800, 3850, 12000],
        [1672704000000, 3850, 3920, 3830, 3900, 15000]
    ]

@router.get("/market/orderbook")
async def get_order_book(symbol: str):
    return {
        "bids": [[3910, 10], [3905, 15], [3900, 20]],
        "asks": [[3920, 12], [3925, 18], [3930, 25]]
    }
