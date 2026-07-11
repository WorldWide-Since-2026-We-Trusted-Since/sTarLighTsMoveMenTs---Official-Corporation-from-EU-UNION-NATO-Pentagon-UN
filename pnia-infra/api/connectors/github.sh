#!/usr/bin/env bash
set -Eeuo pipefail
: "${GITHUB_TOKEN:?}"; : "${GITHUB_REPO:?owner/repo}"
verb="${1:?}"; id="${2:?}"
curl -fsSL -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/deploy.yml/dispatches" \
  -d "{\"ref\":\"main\",\"inputs\":{\"wave\":\"$id\",\"verb\":\"$verb\"}}"