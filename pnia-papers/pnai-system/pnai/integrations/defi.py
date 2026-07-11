"""Live DeFi data via DeFiLlama (no API key, no registration).

Global Total Value Locked, TVL per chain, and the largest protocols — real,
continuously-updated figures spanning thousands of protocols.
"""
from __future__ import annotations

import httpx

from .base import FeedResult

SOURCE = "defillama"
BASE = "https://api.llama.fi"


async def fetch_defi(client: httpx.AsyncClient, top_n: int = 15) -> FeedResult:
    endpoint = f"{BASE}/v2/chains + /protocols"
    try:
        chains_resp, protocols_resp = (
            await client.get(f"{BASE}/v2/chains", timeout=20),
            await client.get(f"{BASE}/protocols", timeout=30),
        )
        chains_resp.raise_for_status()
        protocols_resp.raise_for_status()

        chains = chains_resp.json()
        protocols = protocols_resp.json()

        total_tvl = sum((c.get("tvl") or 0) for c in chains)
        top_chains = sorted(chains, key=lambda c: -(c.get("tvl") or 0))[:top_n]
        top_protocols = sorted(protocols, key=lambda p: -(p.get("tvl") or 0))[:top_n]

        return FeedResult.success(
            SOURCE,
            endpoint,
            {
                "total_tvl_usd": total_tvl,
                "chains_tracked": len(chains),
                "protocols_tracked": len(protocols),
                "top_chains": [
                    {"name": c.get("name"), "tvl_usd": c.get("tvl"), "token": c.get("tokenSymbol")}
                    for c in top_chains
                ],
                "top_protocols": [
                    {
                        "name": p.get("name"),
                        "tvl_usd": p.get("tvl"),
                        "category": p.get("category"),
                        "chains": p.get("chains", [])[:5],
                    }
                    for p in top_protocols
                ],
            },
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, endpoint, f"{type(exc).__name__}: {exc}")
