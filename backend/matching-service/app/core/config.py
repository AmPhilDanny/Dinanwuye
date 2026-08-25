"""
Configuration settings for Matching Service
"""
import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Dinanwuye Matching Service"

    # CORS
    CORS_ORIGINS: str = "https://dinanwuye.com,https://www.dinanwuye.com"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/dinanwuye")

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-only-secret-change-me")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 15

    # ML
    EMBEDDING_DIM: int = 384
    MODEL_PATH: str = "./models"
    RETRAIN_INTERVAL_HOURS: int = 24

    # External Services
    PROFILE_SERVICE_URL: str = os.getenv("PROFILE_SERVICE_URL", "http://localhost:3002")
    TRUST_SAFETY_SERVICE_URL: str = os.getenv("TRUST_SAFETY_SERVICE_URL", "http://localhost:3005")
    MESSAGING_SERVICE_URL: str = os.getenv("MESSAGING_SERVICE_URL", "http://localhost:3003")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

if settings.ENVIRONMENT == "production" and settings.JWT_SECRET_KEY == "dev-only-secret-change-me":
    raise RuntimeError("JWT_SECRET_KEY must be configured in production")
