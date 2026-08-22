"""Unit tests for swipe/match endpoints (fake DB, no live Postgres)."""
import uuid
from datetime import datetime, timezone

import pytest
from fastapi import HTTPException

from app.api.v1.endpoints.matching import swipe, unmatch
from app.models.models import Match, Swipe
from app.schemas.schemas import SwipeRequest


class FakeScalars:
    def __init__(self, rows):
        self.rows = rows

    def all(self):
        return self.rows

    def scalar_one_or_none(self):
        return self.rows[0] if self.rows else None


class FakeResult:
    def __init__(self, rows=None):
        self._rows = rows or []

    def scalars(self):
        return FakeScalars(self._rows)

    def scalar_one_or_none(self):
        return self._rows[0] if self._rows else None


class FakeDb:
    """Scripted AsyncSession: each execute() pops the next queued result."""

    def __init__(self, results=None):
        self.results = list(results or [])
        self.added = []
        self.committed = False

    async def execute(self, stmt):
        if self.results:
            return self.results.pop(0)
        return FakeResult()

    def add(self, obj):
        if isinstance(obj, Match) and obj.created_at is None:
            obj.created_at = datetime.now(timezone.utc)
        if isinstance(obj, (Match, Swipe)) and obj.id is None:
            obj.id = str(uuid.uuid4())
        self.added.append(obj)

    async def commit(self):
        self.committed = True

    async def get(self, model, pk):
        for obj in self.added:
            if isinstance(obj, model) and obj.id == pk:
                return obj
        return None


def make_swipe(actor, target, action):
    row = Swipe(actor_id=actor, target_id=target, action=action)
    row.created_at = datetime.now(timezone.utc)
    return row


def like_script(*, existing=None, likes=None, reciprocal=None):
    return [
        FakeResult([existing] if existing else []),
        FakeResult(likes or []),
        FakeResult([reciprocal] if reciprocal else []),
    ]


@pytest.mark.asyncio
async def test_like_without_reciprocal_no_match():
    db = FakeDb(like_script(existing=None, likes=[], reciprocal=None))
    resp = await swipe(SwipeRequest(target_id="target-002", action="like"), user_id="user-001", db=db)
    assert resp.matched is False
    assert resp.match is None
    assert resp.remaining_likes == 49
    assert db.committed is True


@pytest.mark.asyncio
async def test_mutual_like_creates_match():
    db = FakeDb(
        like_script(
            existing=None,
            likes=[],
            reciprocal=make_swipe("user-002", "user-001", "like"),
        )
    )
    resp = await swipe(SwipeRequest(target_id="target-002", action="like"), user_id="user-001", db=db)
    assert resp.matched is True
    assert resp.match is not None
    assert resp.match.user_a_id == "user-001"
    assert resp.match.user_b_id == "target-002"
    assert any(isinstance(o, Match) for o in db.added)
    assert db.committed is True


@pytest.mark.asyncio
async def test_pass_never_matches():
    db = FakeDb([FakeResult([])])
    resp = await swipe(SwipeRequest(target_id="target-002", action="pass"), user_id="user-001", db=db)
    assert resp.matched is False
    assert resp.remaining_likes is None


@pytest.mark.asyncio
async def test_self_swipe_rejected():
    db = FakeDb([])
    with pytest.raises(HTTPException) as exc:
        await swipe(SwipeRequest(target_id="user-001", action="like"), user_id="user-001", db=db)
    assert exc.value.status_code == 400


@pytest.mark.asyncio
async def test_duplicate_swipe_conflict():
    existing = make_swipe("user-001", "target-002", "pass")
    db = FakeDb([FakeResult([existing])])
    with pytest.raises(HTTPException) as exc:
        await swipe(SwipeRequest(target_id="target-002", action="like"), user_id="user-001", db=db)
    assert exc.value.status_code == 409


@pytest.mark.asyncio
async def test_daily_like_limit():
    likes = [make_swipe("user-001", f"target-{i:03d}", "like") for i in range(50)]
    db = FakeDb([FakeResult([]), FakeResult(likes)])
    with pytest.raises(HTTPException) as exc:
        await swipe(SwipeRequest(target_id="target-002", action="like"), user_id="user-001", db=db)
    assert exc.value.status_code == 429


@pytest.mark.asyncio
async def test_superlike_limit():
    superlikes = [make_swipe("user-001", f"target-{i:03d}", "superlike") for i in range(3)]
    db = FakeDb([FakeResult([]), FakeResult(superlikes)])
    with pytest.raises(HTTPException) as exc:
        await swipe(SwipeRequest(target_id="target-002", action="superlike"), user_id="user-001", db=db)
    assert exc.value.status_code == 429


@pytest.mark.asyncio
async def test_unmatch_soft_closes():
    match_row = Match(id="match-1", user_a_id="user-001", user_b_id="user-002", status="active")
    match_row.created_at = datetime.now(timezone.utc)
    db = FakeDb([])
    db.add(match_row)
    result = await unmatch("match-1", user_id="user-001", db=db)
    assert result == {"success": True}
    assert match_row.status == "unmatched"