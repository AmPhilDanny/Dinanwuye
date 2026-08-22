"""
Embeddings endpoints - V0 deterministic placeholder.

Phase 1 matching uses the heuristic scorer (app/services/ranking.py);
vector embeddings arrive with the ML ranker in Phase 2. These endpoints
return a stable, user-id-seeded pseudo-embedding so the API contract holds.
"""
import hashlib
from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.api.deps import get_current_user
from app.core.config import settings

router = APIRouter()


class EmbeddingRequest(BaseModel):
    user_id: str = Field(min_length=8, max_length=64)
    force_refresh: bool = False


class EmbeddingResponse(BaseModel):
    user_id: str
    embedding: list[float]
    model_version: str
    updated_at: str


def _pseudo_embedding(user_id: str, dim: int) -> list[float]:
    """Deterministic unit-norm vector seeded by user_id (V0 placeholder)."""
    seed = int(hashlib.sha256(user_id.encode()).hexdigest(), 16)
    vector = [(seed >> (i * 8)) & 0xFF for i in range(dim)]
    norm = sum(x * x for x in vector) ** 0.5
    return [round(x / norm, 6) for x in vector]


@router.post("/generate", response_model=EmbeddingResponse)
async def generate_embedding(
    request: EmbeddingRequest,
    user_id: str = Depends(get_current_user),
):
    """Generate (V0: derive deterministically) the user embedding."""
    return EmbeddingResponse(
        user_id=request.user_id,
        embedding=_pseudo_embedding(request.user_id, settings.EMBEDDING_DIM),
        model_version="hash-v0",
        updated_at=datetime.now(UTC).isoformat(),
    )


@router.get("/{user_id}", response_model=EmbeddingResponse)
async def get_embedding(
    user_id: str,
    current_user: str = Depends(get_current_user),
):
    """Return the current embedding (V0: deterministic, no persistence)."""
    return EmbeddingResponse(
        user_id=user_id,
        embedding=_pseudo_embedding(user_id, settings.EMBEDDING_DIM),
        model_version="hash-v0",
        updated_at=datetime.now(UTC).isoformat(),
    )


@router.post("/batch-generate")
async def batch_generate_embeddings(
    user_ids: list[str],
    current_user: str = Depends(get_current_user),
):
    """Generate embeddings for many users (Phase 2 batch job)."""
    return [
        EmbeddingResponse(
            user_id=uid,
            embedding=_pseudo_embedding(uid, settings.EMBEDDING_DIM),
            model_version="hash-v0",
            updated_at=datetime.now(UTC).isoformat(),
        )
        for uid in user_ids
    ]
