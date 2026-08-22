"""Unit tests for deck building (clients mocked, no live DB)."""
from unittest.mock import AsyncMock, patch

import pytest

from app.schemas.schemas import CandidateProfile
from app.services.deck import build_deck


class FakeScalars:
    def __init__(self, rows):
        self.rows = rows

    def all(self):
        return self.rows


class FakeResult:
    def __init__(self, rows=None):
        self._rows = rows or []

    def scalars(self):
        return FakeScalars(self._rows)

    def scalar_one_or_none(self):
        return self._rows[0] if self._rows else None


class FakeDb:
    def __init__(self, swiped_targets=None):
        self.swiped_targets = swiped_targets or []

    async def execute(self, stmt):
        return FakeResult(self.swiped_targets)


def make_candidate(uid, age=29, gender="female", seeking=None, interests=None, verified=False, last_active=None):
    return CandidateProfile.model_validate(
        {
            "id": uid,
            "age": age,
            "gender": gender,
            "seeking": seeking or ["male"],
            "interests": interests or [],
            "lastActiveAt": last_active or "2026-08-18T10:00:00+00:00",
            "isVerified": verified,
            "isPremium": False,
        }
    )


CANDIDATES = [
    make_candidate("u-1", age=27, interests=["cooking"], verified=True),
    make_candidate("u-2", age=33, interests=["tech"]),
    make_candidate("u-3", age=24, interests=["gym"]),
]


@pytest.mark.asyncio
async def test_deck_sorted_by_score_desc():
    with patch("app.services.deck.profile_client") as pc, patch(
        "app.services.deck.trust_safety_client"
    ) as ts:
        pc.get_my_profile = AsyncMock(return_value={"age": 30, "seeking": ["female", "25-29"], "interests": ["cooking"], "locationGeo": None})
        pc.get_candidates = AsyncMock(return_value=CANDIDATES)
        ts.get_exclusions = AsyncMock(return_value={"blocked_by": [], "blocking": []})

        deck = await build_deck(FakeDb(), user_id="me", token="tok", limit=20)

    scores = [item.compatibility_score for item in deck.items]
    assert scores == sorted(scores, reverse=True)
    assert len(deck.items) == 3


@pytest.mark.asyncio
async def test_deck_excludes_swiped_and_blocked():
    with patch("app.services.deck.profile_client") as pc, patch(
        "app.services.deck.trust_safety_client"
    ) as ts:
        pc.get_my_profile = AsyncMock(return_value={"age": 30, "seeking": ["female"], "interests": []})
        pc.get_candidates = AsyncMock(return_value=CANDIDATES)
        ts.get_exclusions = AsyncMock(return_value={"blocked_by": ["u-1"], "blocking": []})

        deck = await build_deck(FakeDb(swiped_targets=["u-2"]), user_id="me", token="tok", limit=20)

    ids = [item.user_id for item in deck.items]
    assert ids == ["u-3"]
    assert "u-1" not in ids
    assert "u-2" not in ids


@pytest.mark.asyncio
async def test_deck_pagination_cursor():
    with patch("app.services.deck.profile_client") as pc, patch(
        "app.services.deck.trust_safety_client"
    ) as ts:
        pc.get_my_profile = AsyncMock(return_value={"age": 30, "seeking": ["female"], "interests": []})
        pc.get_candidates = AsyncMock(return_value=CANDIDATES)
        ts.get_exclusions = AsyncMock(return_value={"blocked_by": [], "blocking": []})

        page1 = await build_deck(FakeDb(), user_id="me", token="tok", limit=2)
        assert len(page1.items) == 2
        assert page1.has_more is True
        assert page1.next_cursor is not None

        page2 = await build_deck(FakeDb(), user_id="me", token="tok", limit=2, cursor=page1.next_cursor)
        assert len(page2.items) == 1
        assert page2.has_more is False