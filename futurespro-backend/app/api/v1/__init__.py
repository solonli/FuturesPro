from fastapi import APIRouter
from app.api.v1 import auth, dashboard, trading, backtest, radar, strategies, history, account, market, user, security, api_key, risk_control, subscription

# 创建 v1 版本路由
router = APIRouter()

# 注册各个模块的路由
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
router.include_router(trading.router, prefix="/trading", tags=["trading"])
router.include_router(backtest.router, prefix="/backtest", tags=["backtest"])
router.include_router(radar.router, prefix="/radar", tags=["radar"])
router.include_router(strategies.router, prefix="/strategies", tags=["strategies"])
router.include_router(history.router, prefix="/history", tags=["history"])
router.include_router(account.router, prefix="/account", tags=["account"])
router.include_router(market.router, prefix="/market", tags=["market"])
router.include_router(user.router, prefix="/user", tags=["user"])
router.include_router(security.router, prefix="/security", tags=["security"])
router.include_router(api_key.router, prefix="/api-key", tags=["api-key"])
router.include_router(risk_control.router, prefix="/risk-control", tags=["risk-control"])
router.include_router(subscription.router, prefix="/subscription", tags=["subscription"])
