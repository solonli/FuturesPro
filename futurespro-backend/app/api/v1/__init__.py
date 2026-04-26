from fastapi import APIRouter

# 创建 v1 版本路由
router = APIRouter()

# 添加基本的健康检查路由
@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "FuturesPro API is running"}
