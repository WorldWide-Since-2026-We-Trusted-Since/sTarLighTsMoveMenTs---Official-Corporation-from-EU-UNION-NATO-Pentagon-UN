"""Live on-chain reads via public Ethereum JSON-RPC (no key, no registration).

Read-only: current block, gas price, and ERC-20 balance/total-supply for any
token address (e.g. a Master-Token contract). Uses raw JSON-RPC over httpx so
no signing keys or accounts are ever required.
"""
from __future__ import annotations

import httpx

from .base import FeedResult

SOURCE = "ethereum-publicnode"
RPC_URL = "https://ethereum-rpc.publicnode.com"

# Standard ERC-20 selectors.
_SEL_TOTAL_SUPPLY = "0x18160ddd"  # totalSupply()
_SEL_DECIMALS = "0x313ce567"  # decimals()
_SEL_SYMBOL = "0x95d89b41"  # symbol()


async def _rpc(client: httpx.AsyncClient, method: str, params: list) -> dict:
    payload = {"jsonrpc": "2.0", "method": method, "params": params, "id": 1}
    resp = await client.post(RPC_URL, json=payload, timeout=20)
    resp.raise_for_status()
    body = resp.json()
    if "error" in body:
        raise RuntimeError(body["error"])
    return body


async def fetch_chain_status(client: httpx.AsyncClient) -> FeedResult:
    try:
        block_hex = (await _rpc(client, "eth_blockNumber", []))["result"]
        gas_hex = (await _rpc(client, "eth_gasPrice", []))["result"]
        chain_hex = (await _rpc(client, "eth_chainId", []))["result"]
        return FeedResult.success(
            SOURCE,
            RPC_URL,
            {
                "chain_id": int(chain_hex, 16),
                "block_number": int(block_hex, 16),
                "gas_price_gwei": int(gas_hex, 16) / 1e9,
            },
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, RPC_URL, f"{type(exc).__name__}: {exc}")


def _decode_uint(hex_result: str) -> int:
    return int(hex_result, 16) if hex_result and hex_result != "0x" else 0


def _decode_string(hex_result: str) -> str:
    if not hex_result or hex_result == "0x":
        return ""
    raw = bytes.fromhex(hex_result[2:])
    # ABI dynamic string: offset(32) + length(32) + data.
    if len(raw) >= 64:
        length = int.from_bytes(raw[32:64], "big")
        return raw[64 : 64 + length].decode("utf-8", errors="ignore").strip("\x00")
    return raw.decode("utf-8", errors="ignore").strip("\x00")


async def fetch_token_info(client: httpx.AsyncClient, token_address: str) -> FeedResult:
    """Read a live ERC-20 token's symbol, decimals and total supply on mainnet."""
    endpoint = f"{RPC_URL} (eth_call -> {token_address})"
    try:
        addr = token_address.lower()

        async def call(selector: str) -> str:
            res = await _rpc(client, "eth_call", [{"to": addr, "data": selector}, "latest"])
            return res["result"]

        decimals = _decode_uint(await call(_SEL_DECIMALS))
        total_supply_raw = _decode_uint(await call(_SEL_TOTAL_SUPPLY))
        symbol = _decode_string(await call(_SEL_SYMBOL))
        total_supply = total_supply_raw / (10**decimals) if decimals else total_supply_raw
        return FeedResult.success(
            SOURCE,
            endpoint,
            {
                "token_address": token_address,
                "symbol": symbol,
                "decimals": decimals,
                "total_supply_raw": str(total_supply_raw),
                "total_supply": total_supply,
            },
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, endpoint, f"{type(exc).__name__}: {exc}")
