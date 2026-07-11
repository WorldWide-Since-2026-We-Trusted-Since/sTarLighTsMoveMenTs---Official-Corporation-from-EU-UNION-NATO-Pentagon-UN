#!/usr/bin/env bash
# Registry + ID validator.
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./log.sh
source "${SCRIPT_DIR}/log.sh"

REGISTRY_FILE="${REGISTRY_FILE:-${SCRIPT_DIR}/../registry.csv}"

validate_registry() {
  [[ -f "$REGISTRY_FILE" ]] || { log_error "registry missing: $REGISTRY_FILE"; return 1; }
  local header
  header="$(head -n1 "$REGISTRY_FILE")"
  [[ "$header" == "ID,DB_TYPE,DB_PORT,DB_NAME,DEPENDS_ON,LICENSE,DOI,GPP_TIER" ]] \
    || { log_error "registry header mismatch: $header"; return 1; }
  log_info "registry ok: $(($(wc -l < "$REGISTRY_FILE") - 1)) entries"
}

lookup_id() {
  local id="$1"
  grep "^${id}," "$REGISTRY_FILE" || { log_error "id not found: $id"; return 1; }
}