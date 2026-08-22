"""
Matching endpoints: deck, swipes, matches, unmatch.
All routes require a Bearer JWT (see app/api/deps.py).
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import bearer_scheme, get_current_user
from app.db.session import get_db
from app.models.models import Match, Swipe
from app.schemas.schemas import (
    DeckResponse,
    MatchResponse,
    SwipeAction,
    SwipeRequest,
    SwipeResponse,
)
from app.services.deck import build_deck

router = APIRouter()

DAILY_LIKE_LIMIT = 50
SUPERLIKE_LIMIT = 3


@router.get("/deck", response_model=DeckResponse)
async def get_deck(
    limit: int = Query(20, ge=1, le=50),
    cursor: str | None = None,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Discovery deck: scored candidates, exclusions applied, cursor-paginated."""
    token = credentials.credentials if credentials else ""
    return await build_deck(
        db=db,
        user_id=user_id,
        token=token,
        limit=limit,
        cursor=cursor,
    )


@router.post("/swipe", response_model=SwipeResponse)
async def swipe(
    swipe_data: SwipeRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Record a swipe; on mutual like/superlike create a match."""
    if swipe_data.target_id == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot swipe on yourself")

    existing = (
        await db.execute(select(Swipe).where(Swipe.actor_id == user_id, Swipe.target_id == swipe_data.target_id))
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already swiped on this profile")

    if swipe_data.action in (SwipeAction.like, SwipeAction.superlike):
        likes_today = (
            await db.execute(
                select(Swipe).where(
                    Swipe.actor_id == user_id,
                    Swipe.action.in_(["like", "superlike"]),
                )
            )
        ).scalars().all()
        superlikes_today = sum(1 for s in likes_today if s.action == "superlike")
        if swipe_data.action == SwipeAction.superlike and superlikes_today >= SUPERLIKE_LIMIT:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Superlike limit reached")
        if len(likes_today) >= DAILY_LIKE_LIMIT:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Daily like limit reached")
    else:
        likes_today = []

    swipe_row = Swipe(actor_id=user_id, target_id=swipe_data.target_id, action=swipe_data.action.value)
    db.add(swipe_row)

    matched = False
    match_row: Match | None = None

    if swipe_data.action in (SwipeAction.like, SwipeAction.superlike):
        reciprocal = (
            await db.execute(
                select(Swipe).where(
                    Swipe.actor_id == swipe_data.target_id,
                    Swipe.target_id == user_id,
                    Swipe.action.in_(["like", "superlike"]),
                )
            )
        ).scalar_one_or_none()
        if reciprocal:
            match_row = Match(user_a_id=user_id, user_b_id=swipe_data.target_id, status="active")
            db.add(match_row)
            matched = True

    remaining_likes = (
        max(0, DAILY_LIKE_LIMIT - (len(likes_today) + 1))
        if swipe_data.action != SwipeAction.pass_
        else None
    )
    await db.commit()

    return SwipeResponse(
        matched=matched,
        match=(
            {
                "id": match_row.id,
                "user_a_id": match_row.user_a_id,
                "user_b_id": match_row.user_b_id,
                "status": match_row.status,
                "created_at": match_row.created_at.isoformat(),
            }
            if match_row
            else None
        ),
        remaining_likes=remaining_likes,
    )


@router.get("/matches", response_model=list[MatchResponse])
async def get_matches(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Active matches for the current user."""
    result = await db.execute(
        select(Match).where(
            or_(Match.user_a_id == user_id, Match.user_b_id == user_id),
            Match.status == "active",
        )
    )
    matches = result.scalars().all()
    return [
        MatchResponse(
            id=m.id,
            user_id=m.user_b_id if m.user_a_id == user_id else m.user_a_id,
            created_at=m.created_at.isoformat(),
            status=m.status,
        )
        for m in matches
    ]


@router.get("/matches/{match_id}", response_model=MatchResponse)
async def get_match(
    match_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """A single match (participants only)."""
    match_row = await db.get(Match, match_id)
    if not match_row or match_row.status != "active":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    if user_id not in (match_row.user_a_id, match_row.user_b_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a participant")
    return MatchResponse(
        id=match_row.id,
        user_id=match_row.user_b_id if match_row.user_a_id == user_id else match_row.user_a_id,
        created_at=match_row.created_at.isoformat(),
        status=match_row.status,
    )


@router.delete("/matches/{match_id}")
async def unmatch(
    match_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Soft-unmatch (status -> unmatched)."""
    match_row = await db.get(Match, match_id)
    if not match_row or match_row.status != "active":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    if user_id not in (match_row.user_a_id, match_row.user_b_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a participant")
    match_row.status = "unmatched"
    await db.commit()
    return {"success": True}
