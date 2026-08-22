"""
Deck building: fetch candidates, exclude blocked/already-swiped users,
score + sort + paginate (cursor = last item's score).
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Swipe
from app.schemas.schemas import CandidateProfile, DeckItem, DeckResponse
from app.services.profile_client import profile_client
from app.services.ranking import compatibility_score, distance_km
from app.services.trust_safety_client import trust_safety_client


async def build_deck(
    db: AsyncSession,
    user_id: str,
    token: str,
    limit: int = 20,
    cursor: str | None = None,
) -> DeckResponse:
    me = await profile_client.get_my_profile(user_id, token)
    my_age = int(me.get("age") or 30)
    my_seeking = list(me.get("seeking") or ["female"])
    my_interests = list(me.get("interests") or [])
    geo = me.get("locationGeo")
    user_geo = (geo["lat"], geo["lng"]) if geo else None

    candidates = await profile_client.get_candidates(user_id, token, limit=limit * 3, cursor=cursor)
    exclusions = await trust_safety_client.get_exclusions(user_id, token)

    swiped = set()
    if candidates:
        rows = (
            await db.execute(select(Swipe.target_id).where(Swipe.actor_id == user_id))
        ).scalars().all()
        swiped = set(rows)

    blocked_by = set(exclusions["blocked_by"])
    blocking = set(exclusions["blocking"])
    excluded = blocked_by | blocking

    scored: list[tuple[int, float | None, CandidateProfile]] = []
    for cand in candidates:
        if cand.id in excluded or cand.id in swiped:
            continue
        score = compatibility_score(cand, my_age, my_seeking, my_interests)
        dist = distance_km(user_geo, (cand.locationGeo.lat, cand.locationGeo.lng)) if cand.locationGeo else None
        scored.append((score, dist, cand))

    # Score desc, then id desc for stable pagination across tied scores (composite cursor)
    scored.sort(key=lambda t: (t[0], t[2].id), reverse=True)

    if cursor:
        parts = cursor.split(":", 1)
        cursor_score = int(parts[0])
        cursor_id = parts[1] if len(parts) > 1 else ""
        scored = [t for t in scored if (t[0], t[2].id) < (cursor_score, cursor_id)]

    page = scored[:limit]
    has_more = len(scored) > limit
    last = page[-1] if page else None
    next_cursor = f"{last[0]}:{last[2].id}" if has_more and last else None

    return DeckResponse(
        items=[
            DeckItem(
                user_id=cand.id,
                age=cand.age,
                gender=cand.gender,
                location=cand.locationName,
                distance_km=dist,
                compatibility_score=score,
                interests=cand.interests,
                is_verified=cand.isVerified,
                is_premium=cand.isPremium,
                last_active_at=cand.lastActiveAt,
            )
            for score, dist, cand in page
        ],
        has_more=has_more,
        next_cursor=next_cursor,
    )
