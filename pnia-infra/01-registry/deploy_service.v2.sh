#!/usr/bin/env bash
# Hardened, idempotent, parallel-capable deploy-by-ID.
# Usage:
#   ./deploy_service.v2.sh PNIA-001                # single
#   ./deploy_service.v2.sh --all                   # dependency-aware parallel wave
set -Eeuo pipefail
IFS=$'\n\t'
SCRIPT_NAME="deploy_service.v2"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE="${HERE}/../00-core"
# shellcheck source=../00-core/lib/log.sh
source "${CORE}/lib/log.sh"
# shellcheck source=../00-core/lib/validate.sh
source "${CORE}/lib/validate.sh"
# shellcheck source=../00-core/lib/parallel.sh
source "${CORE}/lib/parallel.sh"

deploy_one() {
  local id="$1"
  local line
  line="$(lookup_id "$id")"
  IFS=',' read -r ID DB_TYPE DB_PORT DB_NAME DEPS LICENSE DOI TIER <<< "$line"
  log_info "deploy id=$ID type=$DB_TYPE port=$DB_PORT db=$DB_NAME tier=$TIER"
  export DB_IMAGE_TYPE="$DB_TYPE" DB_INTERNAL_PORT="$DB_PORT" \
         DB_INSTANCE_NAME="$DB_NAME" PNIA_ID="$ID" PNIA_LICENSE="$LICENSE" \
         PNIA_DOI="$DOI" PNIA_TIER="$TIER"
  # Idempotent: --project-name namespaces the container per ID.
  docker compose -p "pnia-${ID,,}" -f "${HERE}/docker-compose.yml" up -d
  log_info "deployed id=$ID"
}

main() {
  validate_registry
  if [[ "${1:-}" == "--all" ]]; then
    export -f deploy_one lookup_id log_info log_warn log_error _pnia_log _pnia_trap
    export REGISTRY_FILE SCRIPT_NAME HERE CORE
    run_parallel "source '${CORE}/lib/log.sh'; source '${CORE}/lib/validate.sh'; deploy_one"
  else
    deploy_one "${1:?Usage: $0 <PNIA-ID> | --all}"
  fi
}

main "$@"