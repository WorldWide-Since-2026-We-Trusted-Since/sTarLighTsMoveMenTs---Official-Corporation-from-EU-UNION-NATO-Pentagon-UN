#!/usr/bin/env bash
# Mock replacement for deploy_service.v2.sh — no docker required.
# Appends the deployed ID + a UTC timestamp to $PNIA_TEST_LOG.
set -Eeuo pipefail
id="${1:?Usage: $0 <PNIA-ID>}"
log="${PNIA_TEST_LOG:?PNIA_TEST_LOG env var required}"
# Simulate a small, per-ID amount of work so ordering is observable.
sleep 0.05
printf '{"ts":"%s","id":"%s"}\n' "$(date -u +%s.%N)" "$id" >> "$log"
echo "mock deploy done: $id"