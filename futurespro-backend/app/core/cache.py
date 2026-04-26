import redis
from app.config import settings

# 创建Redis连接池
redis_pool = redis.ConnectionPool.from_url(
    settings.redis_url,
    max_connections=50,
    decode_responses=True
)

# 创建Redis客户端
redis_client = redis.Redis(connection_pool=redis_pool)


def get_redis():
    """获取Redis客户端"""
    return redis_client
