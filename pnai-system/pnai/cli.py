"""CLI: print a live system snapshot to the console (real data, no placeholders)."""
from __future__ import annotations

import asyncio
import json

from .engine.orchestrator import build_snapshot


def main() -> None:
    snapshot = asyncio.run(build_snapshot())
    print("=" * 70)
    print("  PNAI LIVE SYSTEM — REAL MARKET / CHAIN DATA (no registration)")
    print("=" * 70)
    print(json.dumps(snapshot, indent=2, ensure_ascii=False, default=str))


if __name__ == "__main__":
    main()
