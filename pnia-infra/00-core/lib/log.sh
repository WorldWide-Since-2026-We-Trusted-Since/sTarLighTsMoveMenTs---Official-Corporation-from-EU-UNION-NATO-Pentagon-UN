#!/usr/bin/env bash
# Structured JSON logger + error trap. Source this from every script.
set -Eeuo pipefail
IFS=$'\n\t'

_pnia_log() {
  local level="$1"; shift
  local msg="$*"
  local ts
  ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '{"ts":"%s","level":"%s","script":"%s","pid":%d,"msg":%s}\n' \
    "$ts" "$level" "${SCRIPT_NAME:-${0##*/}}" "$$" \
    "$(printf '%s' "$msg" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))' 2>/dev/null || printf '"%s"' "$msg")" >&2
}

log_info()  { _pnia_log INFO  "$*"; }
log_warn()  { _pnia_log WARN  "$*"; }
log_error() { _pnia_log ERROR "$*"; }

_pnia_trap() {
  local ec=$?
  log_error "unhandled error exit=$ec line=${BASH_LINENO[0]} cmd=${BASH_COMMAND}"
  exit "$ec"
}
trap _pnia_trap ERR