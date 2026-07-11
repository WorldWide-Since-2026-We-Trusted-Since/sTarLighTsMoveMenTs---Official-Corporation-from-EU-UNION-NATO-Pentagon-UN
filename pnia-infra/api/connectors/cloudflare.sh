#!/usr/bin/env bash
set -Eeuo pipefail
: "${CLOUDFLARE_API_TOKEN:?}"; : "${CF_ACCOUNT_ID:?}"
verb="${1:?}"; id="${2:?}"
curl -fsSL -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts/pnia-${id,,}" \
  --data-binary @../../05-cloudflare/worker.js