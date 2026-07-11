#!/usr/bin/env bash
set -Eeuo pipefail
: "${GPP_NODE_URL:?}"
verb="${1:?}"; id="${2:?}"; payload="${3:-/dev/null}"
curl -fsSL -X POST "$GPP_NODE_URL/tick" \
  -H "Content-Type: application/json" \
  -H "X-PNIA-Id: $id" -H "X-PNIA-Verb: $verb" \
  --data-binary "@$payload"