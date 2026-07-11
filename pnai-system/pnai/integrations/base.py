"""Shared types for live-data integrations.

Every integration returns a `FeedResult` so the origin of each number is
traceable: which provider, which endpoint, and when it was fetched. This is
what makes the data verifiably real rather than a placeholder.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class FeedResult:
    """A single live-data fetch with full provenance."""

    source: str
    endpoint: str
    fetched_at: str
    ok: bool
    data: dict[str, Any] = field(default_factory=dict)
    error: str | None = None

    @classmethod
    def success(cls, source: str, endpoint: str, data: dict[str, Any]) -> "FeedResult":
        return cls(
            source=source,
            endpoint=endpoint,
            fetched_at=utcnow_iso(),
            ok=True,
            data=data,
        )

    @classmethod
    def failure(cls, source: str, endpoint: str, error: str) -> "FeedResult":
        return cls(
            source=source,
            endpoint=endpoint,
            fetched_at=utcnow_iso(),
            ok=False,
            error=error,
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "source": self.source,
            "endpoint": self.endpoint,
            "fetched_at": self.fetched_at,
            "ok": self.ok,
            "data": self.data,
            "error": self.error,
        }
