"""Live fiat FX rates via Frankfurter (ECB reference rates, no key, no registration)."""
from __future__ import annotations

import httpx

from .base import FeedResult

SOURCE = "frankfurter-ecb"
BASE_URL = "https://api.frankfurter.dev/v1"

DEFAULT_BASE = "EUR"
DEFAULT_SYMBOLS = ["USD", "GBP", "CHF", "JPY", "SEK", "PLN"]


async def fetch_rates(
    client: httpx.AsyncClient,
    base: str = DEFAULT_BASE,
    symbols: list[str] | None = None,
) -> FeedResult:
    symbols = symbols or DEFAULT_SYMBOLS
    endpoint = f"{BASE_URL}/latest"
    params = {"base": base, "symbols": ",".join(symbols)}
    try:
        resp = await client.get(endpoint, params=params, timeout=20)
        resp.raise_for_status()
        body = resp.json()
        return FeedResult.success(
            SOURCE,
            endpoint,
            {"base": body.get("base"), "date": body.get("date"), "rates": body.get("rates", {})},
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, endpoint, f"{type(exc).__name__}: {exc}")
