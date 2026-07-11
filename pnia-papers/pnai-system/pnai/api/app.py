"""FastAPI app: live system snapshot, real-time WebSocket ticker, and dashboard."""
from __future__ import annotations

import asyncio
import contextlib
from pathlib import Path

import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse

from ..engine.orchestrator import build_snapshot
from ..integrations import settlement
from ..integrations.base import utcnow_iso
from ..integrations.stream import ticker


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    ticker.start()  # start the live Binance WebSocket stream
    yield
    await ticker.stop()


app = FastAPI(title="PNAI Live System", version="0.2.0", lifespan=lifespan)

_STATIC = Path(__file__).resolve().parent.parent / "static"


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "time": utcnow_iso()}


@app.get("/api/snapshot")
async def snapshot() -> JSONResponse:
    """Full live snapshot: all real feeds (parallel) + Master-Token certificate."""
    return JSONResponse(await build_snapshot())


@app.get("/api/ticker")
async def ticker_now() -> JSONResponse:
    return JSONResponse(ticker.snapshot())


@app.websocket("/ws/ticker")
async def ws_ticker(ws: WebSocket) -> None:
    """Push the live ticker to the dashboard ~2x/second."""
    await ws.accept()
    try:
        while True:
            await ws.send_json(ticker.snapshot())
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        return
    except Exception:  # noqa: BLE001
        with contextlib.suppress(Exception):
            await ws.close()


@app.get("/api/settlement/status")
async def settlement_status() -> dict:
    return {
        "configured": settlement.is_configured(),
        "note": (
            "Real fiat payouts require your own registered provider credentials "
            "(SETTLEMENT_PROVIDER / SETTLEMENT_API_KEY / SETTLEMENT_API_URL). "
            "Without them, no payout is attempted or faked."
        ),
    }


@app.post("/api/settlement/test")
async def settlement_test() -> JSONResponse:
    """Attempt a 1-cent test payout (only succeeds with real credentials)."""
    async with httpx.AsyncClient() as client:
        result = await settlement.trigger_settlement(
            client,
            amount_cents=1,
            currency="EUR",
            reference="PNAI-TEST",
            destination={"note": "configure your own beneficiary"},
        )
    return JSONResponse(result.to_dict())


@app.get("/")
async def dashboard() -> FileResponse:
    return FileResponse(_STATIC / "index.html")
