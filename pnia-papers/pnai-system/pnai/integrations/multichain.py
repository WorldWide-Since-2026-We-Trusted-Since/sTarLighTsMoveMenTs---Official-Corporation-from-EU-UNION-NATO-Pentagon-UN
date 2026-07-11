"""Live multi-chain status via public JSON-RPC endpoints (no key, no registration)."""
from __future__ import annotations

import asyncio

import httpx

from .base import FeedResult

SOURCE = "publicnode-multichain"

# name -> (rpc_url, chain_id, native gas symbol)
CHAINS: dict[str, tuple[str, int, str]] = {
    "ethereum": ("https://ethereum-rpc.publicnode.com", 1, "ETH"),
    "polygon": ("https://polygon-bor-rpc.publicnode.com", 137, "POL"),
    "bsc": ("https://bsc-rpc.publicnode.com", 56, "BNB"),
    "optimism": ("https://optimism-rpc.publicnode.com", 10, "ETH"),
    "base": ("https://base-rpc.publicnode.com", 8453, "ETH"),
    "arbitrum": ("https://arbitrum-one-rpc.publicnode.com", 42161, "ETH"),
}


async def _chain_status(client: httpx.AsyncClient, name: str, url: str) -> dict:
    async def rpc(method: str) -> str:
        resp = await client.post(
            url,
            json={"jsonrpc": "2.0", "method": method, "params": [], "id": 1},
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()["result"]

    try:
        block_hex = await rpc("eth_blockNumber")
        gas_hex = await rpc("eth_gasPrice")
        return {
            "chain": name,
            "ok": True,
            "block_number": int(block_hex, 16),
            "gas_price_gwei": int(gas_hex, 16) / 1e9,
            "rpc": url,
        }
    except Exception as exc:  # noqa: BLE001
        return {"chain": name, "ok": False, "error": f"{type(exc).__name__}: {exc}", "rpc": url}


async def fetch_multichain(client: httpx.AsyncClient) -> FeedResult:
    """Query every chain in parallel and return per-chain live block/gas."""
    try:
        results = await asyncio.gather(
            *[_chain_status(client, name, url) for name, (url, _cid, _g) in CHAINS.items()]
        )
        online = sum(1 for r in results if r["ok"])
        return FeedResult.success(
            SOURCE,
            "multi-rpc",
            {"chains": results, "chains_online": online, "chains_total": len(results)},
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, "multi-rpc", f"{type(exc).__name__}: {exc}")
