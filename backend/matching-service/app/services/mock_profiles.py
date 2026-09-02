"""
Deterministic mock candidate pool for development when the profile service
is unreachable. Seeded by actor id so decks are stable per user.
"""
import hashlib
from datetime import UTC, datetime, timedelta

from app.schemas.schemas import CandidateProfile

_NOW = datetime.now(UTC)


def _iso(ago: timedelta) -> str:
    return (_NOW - ago).isoformat()


MOCK_CANDIDATES = [
    {
        "id": "mock-0001",
        "userId": "mock-0001",
        "name": "Adaeze",
        "photo": None,
        "age": 29,
        "gender": "female",
        "seeking": ["male", "25-29"],
        "interests": ["cooking", "hiking", "movies"],
        "locationGeo": {"lat": 6.5244, "lng": 3.3792},
        "locationName": "Lagos",
        "lastActiveAt": _iso(timedelta(hours=2)),
        "isVerified": True,
        "isPremium": False,
    },
    {
        "id": "mock-0002",
        "userId": "mock-0002",
        "name": "Amara",
        "photo": None,
        "age": 33,
        "gender": "female",
        "seeking": ["male", "30-34"],
        "interests": ["tech", "travel", "music"],
        "locationGeo": {"lat": 6.4541, "lng": 3.3947},
        "locationName": "Lagos",
        "lastActiveAt": _iso(timedelta(days=1)),
        "isVerified": False,
        "isPremium": True,
    },
    {
        "id": "mock-0003",
        "userId": "mock-0003",
        "name": "Chidi",
        "photo": None,
        "age": 26,
        "gender": "female",
        "seeking": ["male", "25-29"],
        "interests": ["fashion", "dancing", "cooking"],
        "locationGeo": {"lat": 6.6018, "lng": 3.3515},
        "locationName": "Lagos",
        "lastActiveAt": _iso(timedelta(hours=5)),
        "isVerified": True,
        "isPremium": False,
    },
    {
        "id": "mock-0004",
        "userId": "mock-0004",
        "name": "Ebele",
        "photo": None,
        "age": 38,
        "gender": "female",
        "seeking": ["male", "35-39"],
        "interests": ["books", "coffee", "art"],
        "locationGeo": {"lat": 6.4264, "lng": 3.4264},
        "locationName": "Lekki",
        "lastActiveAt": _iso(timedelta(days=3)),
        "isVerified": False,
        "isPremium": False,
    },
    {
        "id": "mock-0005",
        "userId": "mock-0005",
        "name": "Folake",
        "photo": None,
        "age": 24,
        "gender": "female",
        "seeking": ["male", "18-24"],
        "interests": ["gym", "music", "movies"],
        "locationGeo": {"lat": 6.6408, "lng": 3.3653},
        "locationName": "Ikeja",
        "lastActiveAt": _iso(timedelta(minutes=45)),
        "isVerified": False,
        "isPremium": False,
    },
]


def mock_candidates_for(actor_id: str) -> list[CandidateProfile]:
    """Rotate the pool deterministically per actor so each user sees a stable deck."""
    seed = int(hashlib.sha256(actor_id.encode()).hexdigest(), 16)
    ordered = MOCK_CANDIDATES[seed % len(MOCK_CANDIDATES) :] + MOCK_CANDIDATES[: seed % len(MOCK_CANDIDATES)]
    return [CandidateProfile.model_validate(c) for c in ordered]
