from fastapi import APIRouter, Query
from typing import List, Dict, Any

router = APIRouter()

# 模拟K线数据
def get_mock_kline_data(symbol: str, interval: str) -> List[List]:
    """获取模拟K线数据"""
    # 基础价格
    base_price = 3850
    if symbol == 'cu2509':
        base_price = 68200
    elif symbol == 'a2509':
        base_price = 5200
    
    # 生成10条K线数据
    kline_data = []
    for i in range(10):
        timestamp = f'2024-01-01 09:{i:02d}'
        open_price = base_price + i * 5
        high_price = open_price + 10
        low_price = open_price - 5
        close_price = open_price + 5
        kline_data.append([timestamp, open_price, high_price, low_price, close_price])
    
    return kline_data

# 模拟订单簿数据
def get_mock_orderbook(symbol: str) -> Dict[str, List[Dict]]:
    """获取模拟订单簿数据"""
    # 基础价格
    base_price = 3895
    if symbol == 'cu2509':
        base_price = 68150
    elif symbol == 'a2509':
        base_price = 5250
    
    # 买单
    buy_orders = []
    for i in range(5):
        buy_orders.append({
            'price': base_price - i,
            'volume': 10 - i
        })
    
    # 卖单
    sell_orders = []
    for i in range(1, 6):
        sell_orders.append({
            'price': base_price + i,
            'volume': 10 - i
        })
    
    return {
        'buy_orders': buy_orders,
        'sell_orders': sell_orders
    }


@router.get("/kline", response_model=List[List])
async def get_kline_data(
    symbol: str = Query(..., description="合约代码"),
    interval: str = Query(..., description="时间周期")
):
    """获取K线数据"""
    return get_mock_kline_data(symbol, interval)


@router.get("/orderbook", response_model=Dict[str, List[Dict]])
async def get_order_book(
    symbol: str = Query(..., description="合约代码")
):
    """获取订单簿数据"""
    return get_mock_orderbook(symbol)
