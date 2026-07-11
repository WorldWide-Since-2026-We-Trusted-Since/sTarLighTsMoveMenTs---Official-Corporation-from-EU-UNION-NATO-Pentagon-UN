"""Live global crypto market data via CoinGecko (no key). Cached to respect limits."""
from __future__ import annotations

import httpx

from .base import FeedResult
from .cache import cached

SOURCE = "coingecko-global"
ENDPOINT = "https://api.coingecko.com/api/v3/global"


async def _fetch(client: httpx.AsyncClient) -> FeedResult:
    try:
        resp = await client.get(ENDPOINT, timeout=20)
        resp.raise_for_status()
        d = resp.json()["data"]
        return FeedResult.success(
            SOURCE,
            ENDPOINT,
            {
                "total_market_cap_usd": d["total_market_cap"].get("usd"),
                "total_market_cap_eur": d["total_market_cap"].get("eur"),
                "total_volume_24h_usd": d["total_volume"].get("usd"),
                "btc_dominance": d["market_cap_percentage"].get("btc"),
                "eth_dominance": d["market_cap_percentage"].get("eth"),
                "active_cryptocurrencies": d.get("active_cryptocurrencies"),
                "markets": d.get("markets"),
            },
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, ENDPOINT, f"{type(exc).__name__}: {exc}")


async def fetch_global(client: httpx.AsyncClient) -> FeedResult:
    return await cached("coingecko_global", ttl=60.0, producer=lambda: _fetch(client))
