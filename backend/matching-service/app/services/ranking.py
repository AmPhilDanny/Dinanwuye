"""
Compatibility scoring: V0 heuristic (age band + seeking overlap + shared interests).
Replaced by an ML ranker (lightgbm / embeddings) in Phase 2.
"""
from math import asin, cos, radians, sin, sqrt

from app.schemas.schemas import CandidateProfile

SEEKING_AGE_BANDS = {
    "18-24": (18, 24),
    "25-29": (25, 29),
    "30-34": (30, 34),
    "35-39": (35, 39),
    "40-44": (40, 44),
    "45-49": (45, 49),
    "50+": (50, 120),
}

KNOWN_GENDERS = {"male", "female", "nonbinary", "any"}

MAX_DISTANCE_KM = 50.0


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    )
    return 2 * r * asin(sqrt(a))


def _age_in_band(age: int, band: str | None) -> bool:
    if not band:
        return True
    lo, hi = SEEKING_AGE_BANDS.get(band, (0, 120))
    return lo <= age <= hi


def compatibility_score(candidate: CandidateProfile, my_age: int, my_seeking: list[str], my_interests: list[str]) -> int:
    """Return an integer 0-100 compatibility score."""
    score = 40.0

    my_gender_targets = {g.lower() for g in my_seeking if g.lower() in KNOWN_GENDERS}
    if my_gender_targets and "any" not in my_gender_targets:
        if candidate.gender.lower() not in my_gender_targets:
            score -= 25.0

    age_bands = [b.lower() for b in my_seeking if b.lower() in SEEKING_AGE_BANDS]
    if age_bands:
        if any(_age_in_band(candidate.age, band) for band in age_bands):
            score += 15.0
        else:
            score -= 10.0

    shared = len(set(candidate.interests) & set(my_interests))
    score += min(shared, 4) * 7.0

    if candidate.isVerified:
        score += 5.0

    return max(0, min(100, round(score)))


def distance_km(user_geo: tuple[float, float] | None, candidate_geo: tuple[float, float] | None) -> float | None:
    if not user_geo or not candidate_geo:
        return None
    return round(haversine_km(user_geo[0], user_geo[1], candidate_geo[0], candidate_geo[1]), 1)
