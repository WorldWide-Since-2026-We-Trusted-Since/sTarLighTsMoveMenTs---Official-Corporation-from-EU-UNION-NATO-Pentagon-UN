"""Fiat settlement bridge — activates ONLY with real, user-provided credentials.

IMPORTANT / HONEST BOUNDARY
---------------------------
Real fiat payouts (Stripe, Circle, Coinbase, Monerium, SEPA bank rails) move
real money and are legally gated behind registration + KYC/business
verification + licensing (MiCA, PSD2, AML). There is NO way — technical or
legal — to obtain live settlement credentials without registering. This module
therefore does NOT fake a payout. It is a real, correctly-structured client
that performs a live call only when you supply your own provider credentials,
and otherwise reports `not_configured` instead of pretending to settle.
"""
from __future__ import annotations

import os

import httpx

from .base import FeedResult

SOURCE = "settlement-bridge"


def _provider_config() -> dict:
    """Read settlement credentials from the environment (never hardcoded)."""
    return {
        "provider": os.getenv("SETTLEMENT_PROVIDER", "").strip().lower(),
        "api_key": os.getenv("SETTLEMENT_API_KEY", "").strip(),
        "api_url": os.getenv("SETTLEMENT_API_URL", "").strip(),
    }


def is_configured() -> bool:
    cfg = _provider_config()
    return bool(cfg["provider"] and cfg["api_key"] and cfg["api_url"])


async def trigger_settlement(
    client: httpx.AsyncClient,
    amount_cents: int,
    currency: str,
    reference: str,
    destination: dict,
) -> FeedResult:
    """Trigger a real payout via the configured provider.

    Returns a `not_configured` failure (not a fake success) when credentials are
    absent, so the system never reports money moved when it did not.
    """
    cfg = _provider_config()
    if not is_configured():
        return FeedResult.failure(
            SOURCE,
            "settlement",
            "not_configured: set SETTLEMENT_PROVIDER, SETTLEMENT_API_KEY and "
            "SETTLEMENT_API_URL to your own real provider credentials to enable payouts.",
        )

    headers = {"Authorization": f"Bearer {cfg['api_key']}"}
    payload = {
        "amount": amount_cents,
        "currency": currency,
        "reference": reference,
        "destination": destination,
    }
    try:
        resp = await client.post(cfg["api_url"], json=payload, headers=headers, timeout=20)
        resp.raise_for_status()
        return FeedResult.success(
            SOURCE,
            cfg["api_url"],
            {"provider": cfg["provider"], "response": resp.json()},
        )
    except Exception as exc:  # noqa: BLE001
        return FeedResult.failure(SOURCE, cfg["api_url"], f"{type(exc).__name__}: {exc}")
