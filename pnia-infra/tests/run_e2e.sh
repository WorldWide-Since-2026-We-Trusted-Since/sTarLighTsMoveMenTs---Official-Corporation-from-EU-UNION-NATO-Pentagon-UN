#!/usr/bin/env bash
# End-to-end integration test for the PNIA orchestrator.
# - Uses a fixture registry (4 IDs, mixed dependencies)
# - Mocks deploy_service.v2.sh so no docker is required
# - Verifies: exit 0, every fixture ID deployed exactly once,
#             dependency order respected.
set -Eeuo pipefail
IFS=$'\n\t'

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA="$(cd "$HERE/.." && pwd)"
REG="$HERE/fixtures/registry.csv"
LOG="$(mktemp -t pnia_e2e_XXXXXX.log)"
trap 'rm -f "$LOG"' EXIT

echo "==> DAG validation"
python3 "$INFRA/00-core/lib/validate_dag.py" "$REG" >/dev/null

echo "==> Orchestrator run (mock deploy)"
PNIA_REGISTRY="$REG" \
PNIA_DEPLOY_BIN="$HERE/mock_deploy.sh" \
PNIA_TEST_LOG="$LOG" \
  python3 "$INFRA/06-orchestrator/pnia_orchestrator.v2.py"

echo "==> Verifying deployment log"
python3 - "$LOG" "$REG" <<'PY'
import csv, json, sys
log_path, reg_path = sys.argv[1], sys.argv[2]
rows = list(csv.DictReader(open(reg_path)))
expected_ids = {r["ID"] for r in rows}
deps = {r["ID"]: [d for d in r["DEPENDS_ON"].split("|") if d] for r in rows}

events = [json.loads(l) for l in open(log_path) if l.strip()]
seen = [e["id"] for e in events]

assert set(seen) == expected_ids, f"deployed set mismatch: {sorted(set(seen))} vs {sorted(expected_ids)}"
assert len(seen) == len(expected_ids), f"duplicate deployments: {seen}"

ts = {e["id"]: float(e["ts"]) for e in events}
for node, ds in deps.items():
    for d in ds:
        assert ts[d] <= ts[node], f"dependency order violated: {d} -> {node}"

print(f"OK: {len(seen)} IDs deployed, all dependencies satisfied")
PY

echo "==> PASS"