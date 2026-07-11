#!/usr/bin/env bash
# Dependency-aware parallel executor.
# Reads registry, topologically sorts by DEPENDS_ON, deploys independent
# nodes concurrently using xargs -P.
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./log.sh
source "${SCRIPT_DIR}/log.sh"
# shellcheck source=./validate.sh
source "${SCRIPT_DIR}/validate.sh"

PARALLELISM="${PARALLELISM:-8}"

# Fail fast if the registry is not a valid DAG.
validate_dag() {
  local script="${SCRIPT_DIR}/validate_dag.py"
  [[ -f "$script" ]] || { log_error "validate_dag.py missing"; return 5; }
  if ! python3 "$script" "$REGISTRY_FILE" >/dev/null; then
    log_error "registry DAG invalid — aborting parallel run"
    python3 "$script" "$REGISTRY_FILE" >&2 || true
    return 1
  fi
  log_info "registry DAG valid"
}

# Emit waves of IDs that can deploy in parallel (space-separated per line).
topo_waves() {
  python3 - "$REGISTRY_FILE" <<'PY'
import csv, sys
from collections import defaultdict
rows=list(csv.DictReader(open(sys.argv[1])))
dep={r['ID']:[d for d in r['DEPENDS_ON'].split('|') if d] for r in rows}
done=set()
while len(done) < len(dep):
    wave=[i for i,d in dep.items() if i not in done and all(x in done for x in d)]
    if not wave:
        sys.stderr.write("cycle detected\n"); sys.exit(2)
    print(" ".join(sorted(wave)))
    done.update(wave)
PY
}

run_parallel() {
  local deploy_cmd="$1"
  validate_registry
  validate_dag
  local wave n=0
  while IFS= read -r wave; do
    n=$((n+1))
    log_info "wave $n: $wave"
    # shellcheck disable=SC2086
    printf '%s\n' $wave | xargs -n1 -P"$PARALLELISM" -I{} bash -c "$deploy_cmd {}"
  done < <(topo_waves)
  log_info "all waves complete ($n)"
}