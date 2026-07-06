#!/bin/bash
# SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
# @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
#
# HNOSS Secure Tunnel Script - Cloudflare Zero Trust Integration
# Keine SSH-Zugangsdaten im Code - nutzt Cloudflare CIAM Auth

set -euo pipefail

# =============================================================================
# CONFIGURATION - via Environment Variables (Secrets via wrangler)
# =============================================================================
TUNNEL_HOST="${SSH_TUNNEL_HOST:-pLedge250freedom.gov.eu}"
TUNNEL_TOKEN="${TUNNEL_TOKEN:-}"  # REQUIRED: Cloudflare Tunnel Token (wrangler secret)

# =============================================================================
# LOGGING FUNCTIONS
# =============================================================================
log_info() { echo "[INFO] $*" >&2; }
log_error() { echo "[ERROR] $*" >&2; }
log_success() { echo "[SUCCESS] $*" >&2; }

# =============================================================================
# VALIDATION
# =============================================================================
if [[ -z "$TUNNEL_TOKEN" ]]; then
    log_error "TUNNEL_TOKEN not set. Use: wrangler secret put TUNNEL_TOKEN"
    exit 1
fi

# =============================================================================
# CLOUDFLARED SETUP (Zero Trust - No API Keys)
# =============================================================================
log_info "🔒 HNOSS Secure Tunnel Setup..."

# Install cloudflared if missing
if ! command -v cloudflared &>/dev/null; then
    log_info "Installing cloudflared..."
    curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb" \
        -o /tmp/cloudflared.deb
    sudo dpkg -i /tmp/cloudflared.deb
fi

# =============================================================================
# TUNNEL START (Browser-Based Auth Required)
# =============================================================================
log_info "Starting tunnel to ${TUNNEL_HOST}..."

# Use tunnel token (not hostname) - more secure
cloudflared tunnel --no-autoupdate run "${TUNNEL_TOKEN}" \
    --url http://localhost:3000 \
    --logfile /var/log/hnoss-tunnel.log \
    --loglevel info &

TUNNEL_PID=$!
log_success "Tunnel PID: ${TUNNEL_PID}"
log_success "Secure Tunnel active for: https://${TUNNEL_HOST}"
log_info "🔐 Auth: Browser-based Cloudflare Access required"
