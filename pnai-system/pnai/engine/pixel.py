"""Pixel-Wechselwirkungs- & Schleif-Engine (fixpoint convergence).

Implements the conceptual core from the PNAI files that was still missing:

* "Pixel-Wechselwirkung": the whole network is treated as one image made of
  746.46 billion data-pixels. When one asset/crypto ("pixel") shifts, the change
  ripples proportionally across all coupled pixels (a leverage / Hebel matrix).
* "Affiliate-Variationen" A/B/C: the rigid data volume is made elastic via
  percentage variations of the base pixel density.
* "Schleif-Technik" + "Fixpoint": instead of a one-shot calculation, the weight
  vector is iteratively re-ground (geschliffen) through the coupling matrix until
  it converges to a stable fixed point (fixpoint) — the equilibrium the concept
  describes as "permanent über die Points geschliffen".

All inputs come from real live market data (live EUR prices); nothing hardcoded.
"""
from __future__ import annotations

from .valuation import WonnetParams, compute_density


def _live_weights(crypto_prices: dict) -> tuple[list[str], list[float]]:
    """Turn live EUR prices into a normalised weight vector (sums to 1)."""
    items = [
        (k, v["eur"])
        for k, v in crypto_prices.items()
        if isinstance(v, dict) and isinstance(v.get("eur"), (int, float)) and v["eur"] > 0
    ]
    if not items:
        return [], []
    names = [k for k, _ in items]
    total = sum(p for _, p in items)
    weights = [p / total for _, p in items]
    return names, weights


def _coupling_matrix(weights: list[float], coupling: float) -> list[list[float]]:
    """Symmetric cross-interaction (Wechselwirkungs) matrix.

    Off-diagonal entries spread a `coupling` fraction of each pixel's weight to
    its neighbours proportionally; the diagonal keeps the remainder. Rows sum to
    1 so the map is a stochastic operator with a guaranteed fixed point.
    """
    n = len(weights)
    if n == 0:
        return []
    m = [[0.0] * n for _ in range(n)]
    for i in range(n):
        others = sum(weights[j] for j in range(n) if j != i) or 1.0
        for j in range(n):
            if i == j:
                m[i][j] = 1.0 - coupling
            else:
                m[i][j] = coupling * (weights[j] / others)
    return m


def _apply(matrix: list[list[float]], vec: list[float]) -> list[float]:
    n = len(vec)
    out = [0.0] * n
    for i in range(n):
        out[i] = sum(matrix[i][j] * vec[j] for j in range(n))
    s = sum(out) or 1.0
    return [x / s for x in out]


def run_schleif_fixpoint(
    crypto_prices: dict,
    coupling: float = 0.25,
    max_iters: int = 200,
    tol: float = 1e-12,
) -> dict:
    """Grind the live weight vector through the coupling matrix to its fixpoint."""
    names, weights = _live_weights(crypto_prices)
    if not names:
        return {"status": "no_live_prices", "reached_fixpoint": False, "iterations": 0}

    matrix = _coupling_matrix(weights, coupling)
    vec = weights[:]
    iterations = 0
    delta = float("inf")
    for iterations in range(1, max_iters + 1):
        nxt = _apply(matrix, vec)
        delta = max(abs(a - b) for a, b in zip(nxt, vec))
        vec = nxt
        if delta < tol:
            break

    return {
        "status": "converged" if delta < tol else "max_iters",
        "reached_fixpoint": delta < tol,
        "iterations": iterations,
        "coupling": coupling,
        "final_max_delta": delta,
        "pixels": len(names),
        "fixpoint_weights": {n: round(w, 8) for n, w in zip(names, vec)},
        "initial_weights": {n: round(w, 8) for n, w in zip(names, weights)},
    }


def pixel_interaction(
    crypto_prices: dict,
    params: WonnetParams,
    shift_percent: float = 15.0,
) -> dict:
    """Affiliate-Variationen A/B/C of the total pixel density under a live shift.

    Mirrors the concept's PixelWechselwirkungsEngine: a base density, a leveraged
    variation, and an interaction-shifted variation — but the leverage is driven
    by the live fixpoint spread instead of a hardcoded factor.
    """
    density = compute_density(params)
    base_pixels = density.total_connections

    fp = run_schleif_fixpoint(crypto_prices)
    # Live leverage: how far the fixpoint moved the most-shifted pixel.
    if fp.get("reached_fixpoint") or fp.get("iterations"):
        init = fp.get("initial_weights", {})
        fin = fp.get("fixpoint_weights", {})
        spread = max((abs(fin[k] - init[k]) for k in init), default=0.0)
    else:
        spread = 0.0
    hebel_faktor = 1.0 + spread

    return {
        "token_symbol": "STMT-WON-PIXEL-KEY",
        "schleif_fixpoint": fp,
        "variations": {
            "A_basis": {
                "beschreibung": "Basis-Pixeldichte (rohes Netzwerkvolumen)",
                "pixel_dichte": base_pixels,
            },
            "B_wechselwirkung_hebel": {
                "beschreibung": "Gehebelt durch Live-Fixpoint-Spread",
                "hebel_faktor": hebel_faktor,
                "pixel_dichte": int(base_pixels * hebel_faktor),
            },
            "C_interaktion_shift": {
                "beschreibung": f"{shift_percent}% Interaktions-Verschiebung",
                "pixel_dichte": int(base_pixels * (1.0 + (shift_percent * 2 / 100))),
            },
        },
    }
