"""Pydantic v2 schemas for the matching API."""
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class SwipeAction(StrEnum):
    like = "like"
    pass_ = "pass"
    superlike = "superlike"


class LocationGeo(BaseModel):
    lat: float
    lng: float


class CandidateProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    age: int
    gender: str
    seeking: list[str] = []
    interests: list[str] = []
    locationGeo: LocationGeo | None = None
    locationName: str | None = None
    lastActiveAt: str
    isVerified: bool = False
    isPremium: bool = False


class DeckItem(BaseModel):
    user_id: str
    name: str | None = None
    age: int
    gender: str
    location: str | None = None
    distance_km: float | None = None
    compatibility_score: int
    interests: list[str] = []
    is_verified: bool = False
    is_premium: bool = False
    last_active_at: str | None = None


class DeckResponse(BaseModel):
    items: list[DeckItem]
    has_more: bool
    next_cursor: str | None = None


class SwipeRequest(BaseModel):
    target_id: str = Field(min_length=8, max_length=64)
    action: SwipeAction


class MatchInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_a_id: str
    user_b_id: str
    status: str
    created_at: str


class SwipeResponse(BaseModel):
    matched: bool
    match: MatchInfo | None = None
    remaining_likes: int | None = None


class MatchResponse(BaseModel):
    id: str
    user_id: str  # the other user
    created_at: str
    status: str
