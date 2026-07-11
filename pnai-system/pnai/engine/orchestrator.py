"""Parallel orchestration: fetch all live feeds at once and build a snapshot."""
from __future__ import annotations

import asyncio
import os

import httpx

from ..integrations import chain, crypto, defi, fx, market, multichain, sentiment
from ..integrations.base import utcnow_iso
from ..integrations.cache import cached
from .pixel import pixel_interaction
from .valuation import (
    WonnetParams,
    build_master_token_certificate,
    build_real_economy_anchor,
    derive_value_per_connection_eur,
)

# Optional: a real ERC-20 to treat as the Master-Token (read-only on-chain).
MASTER_TOKEN_ADDRESS = os.getenv("MASTER_TOKEN_ADDRESS", "").strip()


async def build_snapshot() -> dict:
    """Fetch every live source in parallel and assemble the full system state."""
    async with httpx.AsyncClient() as client:
        tasks = {
            "crypto": cached("crypto_prices", 20.0, lambda: crypto.fetch_prices(client)),
            "fx": cached("fx_rates", 60.0, lambda: fx.fetch_rates(client)),
            "chain": chain.fetch_chain_status(client),
            "multichain": multichain.fetch_multichain(client),
            "defi": cached("defi", 60.0, lambda: defi.fetch_defi(client)),
            "global_market": market.fetch_global(client),
            "sentiment": sentiment.fetch_fear_greed(client),
        }
        if MASTER_TOKEN_ADDRESS:
            tasks["master_token"] = chain.fetch_token_info(client, MASTER_TOKEN_ADDRESS)

        keys = list(tasks.keys())
        results = await asyncio.gather(*tasks.values())
        feeds = dict(zip(keys, results))

    crypto_prices = feeds["crypto"].data.get("prices", {}) if feeds["crypto"].ok else {}
    fx_rates = feeds["fx"].data.get("rates", {}) if feeds["fx"].ok else {}
    global_market = feeds["global_market"].data if feeds["global_market"].ok else {}
    defi_data = feeds["defi"].data if feeds["defi"].ok else {}
    multichain_data = feeds["multichain"].data if feeds["multichain"].ok else {}
    token_feed = feeds.get("master_token")

    params = WonnetParams()
    vpc = derive_value_per_connection_eur(crypto_prices, fx_rates)
    anchor = build_real_economy_anchor(global_market, defi_data, multichain_data)
    pixel = pixel_interaction(crypto_prices, params)
    certificate = build_master_token_certificate(
        params,
        vpc,
        master_token_onchain=token_feed.data if (token_feed and token_feed.ok) else None,
        real_economy_anchor=anchor,
        pixel_engine=pixel,
    )

    sources_total = len(feeds)
    sources_ok = sum(1 for f in feeds.values() if f.ok)

    return {
        "generated_at": utcnow_iso(),
        "health": {"sources_ok": sources_ok, "sources_total": sources_total},
        "feeds": {k: v.to_dict() for k, v in feeds.items()},
        "certificate": certificate,
    }
