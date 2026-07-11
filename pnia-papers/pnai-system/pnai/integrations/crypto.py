"""Live crypto prices via CoinGecko public API (no API key, no registration)."""
from __future__ import annotations

import httpx

from .base import FeedResult

SOURCE = "coingecko"
BASE_URL = "https://api.coingecko.com/api/v3"

# A representative spread of assets; extend freely.
DEFAULT_IDS = [
    "bitcoin",
    "ethereum",
    "tether",
    "usd-coin",
    "binancecoin",
    "ripple",
    "solana",
    "cardano",
]
DEFAULT_VS = ["eur", "usd"]


async def fetch_prices(
    client: httpx.AsyncClient,
    ids: list[str] | None = None,
    vs_currencies: list[str] | None = None,
) -> FeedResult:
    ids = ids or DEFAULT_IDS
    vs_currencies = vs_currencies or DEFAULT_VS
    endpoint = f"{BASE_URL}/simple/price"
    params = {
        "ids": ",".join(ids),
        "vs_currencies": ",".join(vs_currencies),
        "include_last_updated_at": "true",
    }
    try:
        resp = await client.get(endpoint, params=params, timeout=20)
        resp.raise_for_status()
        return FeedResult.success(SOURCE, endpoint, {"prices": resp.json()})
    except Exception as exc:  # noqa: BLE001 - surface any transport/parse error verbatim
        return FeedResult.failure(SOURCE, endpoint, f"{type(exc).__name__}: {exc}")
