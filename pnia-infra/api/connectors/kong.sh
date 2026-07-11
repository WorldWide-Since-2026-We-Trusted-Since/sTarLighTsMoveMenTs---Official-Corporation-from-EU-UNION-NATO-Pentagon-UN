#!/usr/bin/env bash
set -Eeuo pipefail
: "${KONG_ADMIN_URL:?}"
verb="${1:?}"; id="${2:?}"
curl -fsSL -X POST "$KONG_ADMIN_URL/consumers/${id}/key-auth" -d "key=${id}"