#!/usr/bin/env python3
"""Validate that registry.csv DEPENDS_ON edges form a valid DAG.

Exit codes:
  0 - valid
  2 - cycle detected
  3 - dangling dependency (references a missing ID)
  4 - self-dependency
  5 - registry file missing / malformed
"""
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

REQUIRED = ["ID", "DB_TYPE", "DB_PORT", "DB_NAME", "DEPENDS_ON", "LICENSE", "DOI", "GPP_TIER"]


def load(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        print(json.dumps({"ok": False, "error": "missing", "path": str(path)}))
        sys.exit(5)
    with path.open() as f:
        reader = csv.DictReader(f)
        if reader.fieldnames != REQUIRED:
            print(json.dumps({"ok": False, "error": "header", "got": reader.fieldnames, "want": REQUIRED}))
            sys.exit(5)
        return list(reader)


def validate(rows: list[dict[str, str]]) -> dict:
    ids = {r["ID"] for r in rows}
    deps = {r["ID"]: [d for d in r["DEPENDS_ON"].split("|") if d] for r in rows}

    # self-dependency
    self_deps = [i for i, ds in deps.items() if i in ds]
    if self_deps:
        return {"ok": False, "error": "self_dependency", "nodes": self_deps, "code": 4}

    # dangling
    dangling = {i: [d for d in ds if d not in ids] for i, ds in deps.items()}
    dangling = {k: v for k, v in dangling.items() if v}
    if dangling:
        return {"ok": False, "error": "dangling", "edges": dangling, "code": 3}

    # cycle detection via Kahn's algorithm
    indeg = {i: 0 for i in ids}
    for i, ds in deps.items():
        for d in ds:
            indeg[i] += 1
    queue = [i for i, n in indeg.items() if n == 0]
    order: list[str] = []
    remaining = dict(deps)
    while queue:
        node = queue.pop(0)
        order.append(node)
        for other, ds in list(remaining.items()):
            if node in ds:
                ds.remove(node)
                if not ds and other not in order and other not in queue:
                    queue.append(other)
        remaining.pop(node, None)
    if len(order) != len(ids):
        cycle_nodes = sorted(set(ids) - set(order))
        return {"ok": False, "error": "cycle", "nodes": cycle_nodes, "code": 2}

    # topological waves (parallel groups)
    waves: list[list[str]] = []
    done: set[str] = set()
    while len(done) < len(ids):
        wave = sorted(i for i, ds in deps.items() if i not in done and all(x in done for x in ds))
        waves.append(wave)
        done.update(wave)

    return {"ok": True, "nodes": len(ids), "waves": waves, "order": order}


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "registry.csv"
    result = validate(load(path))
    print(json.dumps(result, indent=2))
    return 0 if result.get("ok") else int(result.get("code", 1))


if __name__ == "__main__":
    sys.exit(main())