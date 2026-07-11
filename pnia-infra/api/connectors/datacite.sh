#!/usr/bin/env bash
set -Eeuo pipefail
: "${DATACITE_USER:?}"; : "${DATACITE_PASS:?}"
verb="${1:?}"; id="${2:?}"; payload="${3:-/dev/null}"
curl -fsSL -u "$DATACITE_USER:$DATACITE_PASS" \
  -H "Content-Type: application/vnd.api+json" \
  -X "$verb" "https://api.datacite.org/dois/${id}" \
  --data-binary "@$payload"