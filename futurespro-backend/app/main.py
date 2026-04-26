from app import app
from app.api import api_router
from app.core.websocket import sio_app

# 注册API路由
app.include_router(api_router, prefix="/api")

# 挂载WebSocket应用
app.mount("/ws", sio_app)


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "Welcome to FuturesPro API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}
