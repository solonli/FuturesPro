from pydantic import BaseSettings
from typing import List


class Settings(BaseSettings):
    """应用配置管理"""
    # 应用基本配置
    app_name: str = "FuturesPro API"
    debug: bool = True
    
    # 数据库配置
    database_url: str
    
    # Redis配置
    redis_url: str
    
    # Celery配置
    celery_broker_url: str
    celery_result_backend: str
    
    # JWT配置
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS配置
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# 创建全局配置实例
settings = Settings()
