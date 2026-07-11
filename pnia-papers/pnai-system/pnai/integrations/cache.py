"""Tiny async TTL cache so rate-limited public APIs aren't hammered.

CoinGecko's free tier rate-limits aggressively; caching each source for a few
seconds keeps the dashboard's frequent refreshes well within limits while the
data stays effectively live.
"""
from __future__ import annotations

import time
from typing import Awaitable, Callable

from .base import FeedResult

_STORE: dict[str, tuple[float, FeedResult]] = {}


async def cached(key: str, ttl: float, producer: Callable[[], Awaitable[FeedResult]]) -> FeedResult:
    now = time.monotonic()
    hit = _STORE.get(key)
    if hit and (now - hit[0]) < ttl and hit[1].ok:
        return hit[1]
    result = await producer()
    # Only cache successes; on failure keep serving the last good value if any.
    if result.ok:
        _STORE[key] = (now, result)
    elif hit:
        return hit[1]
    return result
