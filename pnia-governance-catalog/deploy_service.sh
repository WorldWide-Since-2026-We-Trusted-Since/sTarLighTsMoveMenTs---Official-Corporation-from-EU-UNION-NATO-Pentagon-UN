#!/usr/bin/env bash
# =============================================================================
# PNIA Deployment Script — ID-based service registry
#
# Reads a unique ID from stdin (or $1), looks it up in registry.csv, exports
# the matching environment variables so a downstream docker-compose /
# kubectl / terraform step can consume them.
#
# This is the sanitized, working version of the sketch shipped in the user's
# ProtokolInfrastructurImplementation.txt attachment. All values in the
# accompanying registry.csv are EXAMPLE data — clearly prefixed EXAMPLE-*.
# =============================================================================

set -euo pipefail

REGISTRY_FILE="${REGISTRY_FILE:-registry.csv}"

if [[ ! -f "$REGISTRY_FILE" ]]; then
  echo "Error: registry file '$REGISTRY_FILE' not found." >&2
  exit 2
fi

if [[ $# -ge 1 ]]; then
  UNIQUE_ID="$1"
else
  read -r -p "Enter Unique ID: " UNIQUE_ID
fi

if [[ -z "${UNIQUE_ID:-}" ]]; then
  echo "Error: empty ID." >&2
  exit 2
fi

# Skip header, match ID in first column
CONFIG_LINE=$(awk -F',' -v id="$UNIQUE_ID" 'NR>1 && $1==id { print; exit }' "$REGISTRY_FILE")

if [[ -z "$CONFIG_LINE" ]]; then
  echo "Error: ID '$UNIQUE_ID' not found in $REGISTRY_FILE." >&2
  exit 1
fi

IFS=',' read -r ID DB_TYPE DB_PORT DB_NAME <<< "$CONFIG_LINE"

echo "------------------------------------------------"
echo "Resolved deployment configuration:"
echo "  ID:   $ID"
echo "  Type: $DB_TYPE"
echo "  Port: $DB_PORT"
echo "  Name: $DB_NAME"
echo "------------------------------------------------"

export DB_IMAGE_TYPE="$DB_TYPE"
export DB_INTERNAL_PORT="$DB_PORT"
export DB_DATABASE_NAME="$DB_NAME"

# Downstream orchestration hook — replace with your real command.
# Example:
#   docker compose --env-file <(env | grep '^DB_') up -d "$DB_TYPE"
echo "Environment exported. Ready for orchestrator (docker compose / helm / terraform)."
