"""Live Crypto Fear & Greed Index via alternative.me (no key, no registration)."""
from __future__ import annotations

import httpx

from .base import FeedResult

SOURCE = "alternative.me-fng"
ENDPOINT = "https://api.alternative.me/fng/"


async def fetch_fear_greed(client: httpx.AsyncClient) -> FeedResult:
    try:
        resp = await client.get(ENDPOINT, timeout=15)
        resp.raise_for_status()
        item = resp.json()["data"][0]
        return FeedResult.success(
            SOURCE,
            ENDPOINT,
            {
                "value": int(item["value"]),
                "classification": item["value_classification"],
                "timestamp": item["timestamp"],
            },
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, ENDPOINT, f"{type(exc).__name__}: {exc}")
