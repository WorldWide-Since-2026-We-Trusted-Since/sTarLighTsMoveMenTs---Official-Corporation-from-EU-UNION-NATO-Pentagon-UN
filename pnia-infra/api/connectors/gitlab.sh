#!/usr/bin/env bash
set -Eeuo pipefail
: "${GITLAB_TOKEN:?}"; : "${GITLAB_PROJECT_ID:?}"
verb="${1:?}"; id="${2:?}"
curl -fsSL -X POST \
  -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/pipeline?ref=main" \
  --data-urlencode "variables[][key]=PNIA_ID" \
  --data-urlencode "variables[][value]=$id" \
  --data-urlencode "variables[][key]=PNIA_VERB" \
  --data-urlencode "variables[][value]=$verb"