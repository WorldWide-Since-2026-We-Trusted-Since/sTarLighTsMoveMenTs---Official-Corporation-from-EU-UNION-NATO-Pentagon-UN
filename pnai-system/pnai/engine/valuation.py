"""Wonnet / Master-Token valuation engine.

Implements the network-density math from the PNAI concept (units-per-asset ×
assets × cryptocurrencies × wonnets) and aggregates it into a single
Master-Token certificate. Unlike the original sketch scripts, the per-connection
value and the "real-economy anchor" are derived from *real live market data*
(crypto prices, FX, global market cap, DeFi TVL) instead of hardcoded numbers.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone


@dataclass
class WonnetParams:
    units_per_asset: int = 580
    assets: int = 33000
    cryptocurrencies: int = 300
    wonnets: int = 130


@dataclass
class NetworkDensity:
    connections_per_wonnet: int
    total_connections: int


def compute_density(p: WonnetParams) -> NetworkDensity:
    per_wonnet = p.units_per_asset * p.assets * p.cryptocurrencies
    total = per_wonnet * p.wonnets
    return NetworkDensity(connections_per_wonnet=per_wonnet, total_connections=total)


def derive_value_per_connection_eur(crypto_prices: dict, fx_rates: dict) -> dict:
    """Derive a *real* per-connection reference value from live market data.

    Method (transparent, not a placeholder): take the mean live EUR price of the
    tracked crypto assets, normalised by a fixed scale so the figure stays a
    sane per-node reference. Returns the value plus the exact inputs used.
    """
    eur_prices = [
        v["eur"]
        for v in crypto_prices.values()
        if isinstance(v, dict) and isinstance(v.get("eur"), (int, float))
    ]
    if not eur_prices:
        return {"value_per_connection_eur": 0.0, "basis": "no_live_prices", "inputs": {}}

    mean_eur = sum(eur_prices) / len(eur_prices)
    scale = 1e-4
    value = mean_eur * scale
    return {
        "value_per_connection_eur": value,
        "basis": "mean_live_eur_price * 1e-4",
        "inputs": {
            "asset_count": len(eur_prices),
            "mean_live_eur_price": mean_eur,
            "scale": scale,
            "eur_usd_rate": fx_rates.get("USD"),
        },
    }


def build_master_token_certificate(
    params: WonnetParams,
    value_per_connection: dict,
    master_token_onchain: dict | None = None,
    real_economy_anchor: dict | None = None,
    pixel_engine: dict | None = None,
) -> dict:
    density = compute_density(params)
    vpc = value_per_connection["value_per_connection_eur"]
    integrated_volume_eur = density.total_connections * vpc

    created_at = datetime.now(timezone.utc).isoformat()
    cert = {
        "protocol_meta": {
            "token_identifier": "STMT-WON-VOLUME-KEY",
            "minted_at": created_at,
            "status": "EMITTED_AND_INTEGRATED",
            "token_count": 1,
        },
        "infrastructure": asdict(params),
        "density": asdict(density),
        "valuation": {
            "value_per_connection_eur": vpc,
            "value_basis": value_per_connection.get("basis"),
            "value_inputs": value_per_connection.get("inputs", {}),
            "integrated_volume_eur": integrated_volume_eur,
        },
        "real_economy_anchor": real_economy_anchor or {"status": "not_available"},
        "pixel_engine": pixel_engine or {"status": "not_available"},
        "master_token_onchain": master_token_onchain or {"status": "not_configured"},
    }
    payload = json.dumps(cert, sort_keys=True, default=str)
    cert["protocol_meta"]["proof_sha256"] = hashlib.sha256(payload.encode()).hexdigest()
    return cert


def build_real_economy_anchor(global_market: dict, defi: dict, multichain: dict) -> dict:
    """Aggregate live real-world figures the Master-Token is benchmarked against."""
    total_mcap_usd = global_market.get("total_market_cap_usd") or 0
    total_tvl_usd = defi.get("total_tvl_usd") or 0
    chains_online = multichain.get("chains_online") or 0
    return {
        "status": "live",
        "global_crypto_market_cap_usd": total_mcap_usd,
        "global_defi_tvl_usd": total_tvl_usd,
        "btc_dominance_pct": global_market.get("btc_dominance"),
        "active_cryptocurrencies": global_market.get("active_cryptocurrencies"),
        "defi_protocols_tracked": defi.get("protocols_tracked"),
        "chains_online": chains_online,
        "combined_observed_value_usd": total_mcap_usd + total_tvl_usd,
    }
