"""Real-time price ticker via Coinbase public WebSocket (no key, no registration).

A single background task keeps a live ticker-channel subscription open and stores
the latest tick per product. The API layer fans this out to dashboard clients.
(Binance is geo-restricted in some regions; Coinbase's feed is openly reachable.)
"""
from __future__ import annotations

import asyncio
import contextlib
import json
import time

import websockets

WS_URL = "wss://ws-feed.exchange.coinbase.com"
PRODUCTS = [
    "BTC-USD",
    "ETH-USD",
    "SOL-USD",
    "XRP-USD",
    "ADA-USD",
    "DOGE-USD",
    "AVAX-USD",
    "LTC-USD",
]


class LiveTicker:
    """Holds the most recent live tick for each product."""

    def __init__(self) -> None:
        self.latest: dict[str, dict] = {}
        self.connected: bool = False
        self.updated_at: float = 0.0
        self._task: asyncio.Task | None = None

    def start(self) -> None:
        if self._task is None or self._task.done():
            self._task = asyncio.create_task(self._run())

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._task

    async def _run(self) -> None:
        sub = {"type": "subscribe", "product_ids": PRODUCTS, "channels": ["ticker"]}
        while True:
            try:
                async with websockets.connect(WS_URL, ping_interval=15) as ws:
                    await ws.send(json.dumps(sub))
                    self.connected = True
                    async for raw in ws:
                        m = json.loads(raw)
                        if m.get("type") != "ticker" or "price" not in m:
                            continue
                        price = float(m["price"])
                        open_24h = float(m.get("open_24h") or price)
                        change = ((price - open_24h) / open_24h * 100) if open_24h else 0.0
                        self.latest[m["product_id"]] = {
                            "symbol": m["product_id"].replace("-", ""),
                            "price": price,
                            "change_pct_24h": change,
                            "high_24h": float(m.get("high_24h") or 0),
                            "low_24h": float(m.get("low_24h") or 0),
                            "volume_24h": float(m.get("volume_24h") or 0),
                        }
                        self.updated_at = time.time()
            except asyncio.CancelledError:
                self.connected = False
                raise
            except Exception:  # noqa: BLE001 - reconnect on any drop
                self.connected = False
                await asyncio.sleep(3)

    def snapshot(self) -> dict:
        return {
            "source": "coinbase-ws",
            "connected": self.connected,
            "updated_at": self.updated_at,
            "symbols": list(self.latest.values()),
        }


ticker = LiveTicker()
