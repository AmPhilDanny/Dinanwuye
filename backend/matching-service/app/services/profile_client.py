"""
HTTP client for the Profile Service (GET /api/v1/profiles/me, /api/v1/profiles/candidates).
Falls back to the deterministic mock pool when unreachable (dev mode).
"""
import logging

import httpx

from app.core.config import settings
from app.schemas.schemas import CandidateProfile
from app.services.mock_profiles import mock_candidates_for

logger = logging.getLogger(__name__)


class ProfileClient:
    def __init__(self, base_url: str | None = None, timeout: float = 3.0) -> None:
        self.base_url = base_url or settings.PROFILE_SERVICE_URL
        self.timeout = timeout

    async def get_my_profile(self, user_id: str, token: str) -> dict:
        """Fetch the caller's own profile (age/gender/seeking/interests) for scoring."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(
                    f"{self.base_url}/api/v1/profiles/me",
                    headers={"Authorization": f"Bearer {token}"},
                )
                resp.raise_for_status()
            return resp.json()
        except Exception as exc:
            logger.warning("profile service unreachable (%s); using default self-profile", exc)
            return {
                "age": 30,
                "gender": "male",
                "seeking": ["female"],
                "interests": [],
                "locationGeo": None,
            }

    async def get_candidates(
        self,
        user_id: str,
        token: str,
        limit: int = 20,
        cursor: str | None = None,
    ) -> list[CandidateProfile]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(
                    f"{self.base_url}/api/v1/profiles/candidates",
                    params={"limit": limit, "cursor": cursor},
                    headers={"Authorization": f"Bearer {token}"},
                )
                resp.raise_for_status()
            payload = resp.json()
            items = payload.get("items", payload if isinstance(payload, list) else [])
            return [CandidateProfile.model_validate(c) for c in items]
        except Exception as exc:
            logger.warning("profile service unreachable (%s); using mock pool", exc)
            return mock_candidates_for(user_id)


profile_client = ProfileClient()
