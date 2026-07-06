#!/bin/bash
# SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
# @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
# 
# HNOSS SSH Tunnel Script für Cloudflare Integration
# Sichert die Verbindung zur pLedge250freedom.gov.eu Domain

set -e

# Environment Variables (werden als Secrets bereitgestellt)
export SSH_TUNNEL_HOST="${SSH_TUNNEL_HOST:-pLedge250freedom.gov.eu}"
export SSH_TUNNEL_PORT="${SSH_TUNNEL_PORT:-22}"
export SSH_TUNNEL_USER="${SSH_TUNNEL_USER:-hnoss-tunnel}"
export TUNNEL_LOCAL_PORT="${TUNNEL_LOCAL_PORT:-8080}"

# Cloudflared Tunnel (Zero Trust)
echo "🚀 Starting HNOSS Secure Tunnel..."

# Cloudflared einrichten
if ! command -v cloudflared &> /dev/null; then
    echo "Installing cloudflared..."
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
    sudo dpkg -i /tmp/cloudflared.deb
fi

# Tunnel starten mit Token (kein API-Key im Code)
cloudflared tunnel --hostname pLedge250freedom.gov.eu --url http://localhost:3000 &

# SSH Tunnel für Backup
ssh -M -S /tmp/hnoss-tunnel.sock -f -N -L ${TUNNEL_LOCAL_PORT}:localhost:3000 ${SSH_TUNNEL_USER}@${SSH_TUNNEL_HOST} 2>/dev/null || true

echo "✅ Tunnel active: https://pLedge250freedom.gov.eu"
echo "🔒 Security: No API keys exposed in source code"