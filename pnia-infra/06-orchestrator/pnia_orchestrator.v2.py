"""PNIA orchestrator v2 — asyncio parallel deploy, DAG-aware.

Reads infra/00-core/registry.csv and calls deploy_service.v2.sh for every
ID, respecting DEPENDS_ON. Independent nodes run concurrently.
"""
from __future__ import annotations

import asyncio
import csv
import json
import logging
import os
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = Path(os.environ.get("PNIA_REGISTRY", ROOT / "00-core" / "registry.csv"))
DEPLOY = Path(os.environ.get("PNIA_DEPLOY_BIN", ROOT / "01-registry" / "deploy_service.v2.sh"))
VALIDATE_DAG = ROOT / "00-core" / "lib" / "validate_dag.py"

logging.basicConfig(
    level=logging.INFO,
    format='{"ts":"%(asctime)s","level":"%(levelname)s","msg":%(message)r}',
)
log = logging.getLogger("pnia")


@dataclass(frozen=True)
class Node:
    id: str
    deps: tuple[str, ...]
    row: dict[str, str]


def load_nodes() -> dict[str, Node]:
    with REGISTRY.open() as f:
        return {
            r["ID"]: Node(
                id=r["ID"],
                deps=tuple(d for d in r["DEPENDS_ON"].split("|") if d),
                row=r,
            )
            for r in csv.DictReader(f)
        }


async def deploy(node: Node, done: dict[str, asyncio.Event]) -> None:
    for dep in node.deps:
        await done[dep].wait()
    log.info(json.dumps({"event": "start", "id": node.id, "row": node.row}))
    proc = await asyncio.create_subprocess_exec(
        "bash", str(DEPLOY), node.id,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
    )
    out, err = await proc.communicate()
    if proc.returncode != 0:
        log.error(json.dumps({"event": "fail", "id": node.id, "stderr": err.decode()[-500:]}))
        raise RuntimeError(f"deploy failed: {node.id}")
    log.info(json.dumps({"event": "done", "id": node.id}))
    done[node.id].set()


async def main() -> int:
    # Fail-fast DAG validation before touching anything.
    check = await asyncio.create_subprocess_exec(
        "python3", str(VALIDATE_DAG), str(REGISTRY),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
    )
    _, err = await check.communicate()
    if check.returncode != 0:
        log.error(json.dumps({"event": "dag_invalid", "stderr": err.decode()[-500:]}))
        return check.returncode

    nodes = load_nodes()
    done = {i: asyncio.Event() for i in nodes}
    results = await asyncio.gather(
        *(deploy(n, done) for n in nodes.values()), return_exceptions=True,
    )
    failures = [r for r in results if isinstance(r, Exception)]
    log.info(json.dumps({"event": "summary", "total": len(nodes), "failed": len(failures)}))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))