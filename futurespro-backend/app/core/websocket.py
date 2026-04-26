import socketio

# 创建Socket.IO服务器
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# 创建ASGI应用
sio_app = socketio.ASGIApp(sio)


@sio.event
async def connect(sid, environ):
    """处理客户端连接"""
    print(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    """处理客户端断开连接"""
    print(f"Client disconnected: {sid}")


async def emit_market_data(symbol: str, data: dict):
    """推送市场数据"""
    await sio.emit(f"market_data_{symbol}", data)


async def emit_signal(signal: dict):
    """推送交易信号"""
    await sio.emit("signal", signal)
