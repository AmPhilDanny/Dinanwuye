"""
Health check endpoints
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "matching-service"}


@router.get("/ready")
async def readiness_check():
    # Add DB/Redis connectivity checks here
    return {"status": "ready", "service": "matching-service"}
