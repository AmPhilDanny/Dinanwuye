"""Unit tests for the V0 heuristic ranking."""
from app.schemas.schemas import CandidateProfile
from app.services.ranking import compatibility_score, distance_km, haversine_km

BASE_CANDIDATE = {
    "id": "mock-0001",
    "age": 29,
    "gender": "female",
    "seeking": ["male"],
    "interests": [],
    "lastActiveAt": "2026-08-18T10:00:00+00:00",
    "isVerified": False,
    "isPremium": False,
}


def make_candidate(**overrides) -> CandidateProfile:
    data = {**BASE_CANDIDATE, **overrides}
    return CandidateProfile.model_validate(data)


def test_gender_mismatch_penalizes():
    cand = make_candidate(gender="female")
    score = compatibility_score(cand, my_age=30, my_seeking=["male"], my_interests=[])
    assert score < 40


def test_age_band_match_bonus():
    cand = make_candidate(age=27)
    in_band = compatibility_score(cand, my_age=30, my_seeking=["male", "25-29"], my_interests=[])
    out_of_band = compatibility_score(cand, my_age=30, my_seeking=["male", "35-39"], my_interests=[])
    assert in_band > out_of_band


def test_shared_interests_add_score():
    cand = make_candidate(interests=["cooking", "hiking", "movies"])
    no_interests = compatibility_score(cand, my_age=30, my_seeking=["female"], my_interests=[])
    with_interests = compatibility_score(
        cand, my_age=30, my_seeking=["female"], my_interests=["cooking", "hiking"]
    )
    assert with_interests > no_interests


def test_verified_bonus():
    cand = make_candidate(isVerified=True)
    score = compatibility_score(cand, my_age=30, my_seeking=["female"], my_interests=[])
    assert score >= 40


def test_score_clamped_to_100():
    cand = make_candidate(age=27, isVerified=True, interests=["a", "b", "c", "d", "e"])
    score = compatibility_score(cand, my_age=30, my_seeking=["female", "25-29"], my_interests=["a", "b", "c", "d", "e"])
    assert 0 <= score <= 100


def test_haversine_zero_distance():
    assert haversine_km(6.5244, 3.3792, 6.5244, 3.3792) < 0.001


def test_haversine_lagos_to_abuja():
    d = haversine_km(6.5244, 3.3792, 9.0579, 7.4951)
    assert 450 < d < 650


def test_distance_km_none_without_geo():
    assert distance_km(None, (6.5, 3.3)) is None
    assert distance_km((6.5, 3.3), None) is None