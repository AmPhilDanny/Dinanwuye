"""
API v1 Router
"""
from fastapi import APIRouter

from app.api.v1.endpoints import embeddings, health, matching

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(matching.router, prefix="/matching", tags=["matching"])
api_router.include_router(embeddings.router, prefix="/embeddings", tags=["embeddings"])
