"""
HTTP client for the Trust & Safety Service exclusions
(GET /api/v1/safety/exclusions). Returns empty exclusions when unreachable.
"""
import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class TrustSafetyClient:
    def __init__(self, base_url: str | None = None, timeout: float = 3.0) -> None:
        self.base_url = base_url or settings.TRUST_SAFETY_SERVICE_URL
        self.timeout = timeout

    async def get_exclusions(self, user_id: str, token: str) -> dict[str, list[str]]:
        """Return {blocked_by: [...], blocking: [...]} (who blocks me / whom I block)."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(
                    f"{self.base_url}/api/v1/safety/exclusions",
                    headers={"Authorization": f"Bearer {token}"},
                )
                resp.raise_for_status()
            data = resp.json()
            return {
                "blocked_by": list(data.get("blockedBy", [])),
                "blocking": list(data.get("blocking", [])),
            }
        except (httpx.HTTPError, ValueError) as exc:
            logger.warning("trust-safety service unreachable (%s); assuming no exclusions", exc)
            return {"blocked_by": [], "blocking": []}


trust_safety_client = TrustSafetyClient()
