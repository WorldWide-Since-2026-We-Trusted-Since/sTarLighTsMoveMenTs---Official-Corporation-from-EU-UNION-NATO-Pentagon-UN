#!/bin/bash
# SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
# @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
#
# 🔒 HNOSS Zero Trust Tunnel Setup für pLedge250freedom.gov.eu
# ZERO-KEY-IN-CODE ARCHITEKTUR
# Keine API-Keys oder Secrets in diesem Skript!
# Authentifizierung via Browser (wrangler login / cloudflared tunnel login)

set -euo pipefail

# =============================================================================
# KONFIGURATION - Hardcodierte Werte für pLedge250freedom.gov.eu
# =============================================================================
DOMAIN="pLedge250freedom.gov.eu"
TUNNEL_NAME="hnoss-secure-tunnel"
LOCAL_PORT=8080  # App Port - anpassen falls nötig

# =============================================================================
# LOGGING FUNKTIONEN
# =============================================================================
log_info() { echo "[INFO] $*" >&2; }
log_error() { echo "[ERROR] $*" >&2; }
log_success() { echo "[SUCCESS] $*" >&2; }

# =============================================================================
# HAUPTLOGIK
# =============================================================================
echo "🔒 Starte HNOSS Zero Trust Tunnel Setup für ${DOMAIN}..."

# 1. Prüfen ob cloudflared installiert ist
if ! command -v cloudflared &> /dev/null; then
    log_info "📦 Installiere cloudflared..."
    curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb" \
        -o /tmp/cloudflared.deb
    sudo dpkg -i /tmp/cloudflared.deb || sudo apt install -y /tmp/cloudflared.deb
    rm -f /tmp/cloudflared.deb
fi

# 2. Browser-basierte Authentifizierung
log_info "🔑 Führe browser-basierte Authentifizierung durch..."
echo "   Öffne diesen Link in deinem Browser:"
echo "   https://dash.cloudflare.com/login"
read -p "Drücke ENTER wenn du authentifiziert bist..."

# 3. Tunnel erstellen (benötigt Auth)
log_info "🏗️ Erstelle Tunnel: ${TUNNEL_NAME}"
cloudflared tunnel create "${TUNNEL_NAME}"

# 4. Tunnel UUID abrufen
TUNNEL_UUID=$(cloudflared tunnel list | grep "${TUNNEL_NAME}" | awk '{print $1}')
if [[ -z "${TUNNEL_UUID}" ]]; then
    log_error "Konnte Tunnel UUID nicht abrufen"
    exit 1
fi

# 5. Konfiguration generieren
log_info "📝 Generiere Tunnel-Konfiguration..."
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml <<EOF
# 🔒 HNOSS Tunnel Configuration
# Erstellt am: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Domain: ${DOMAIN}

tunnel: ${TUNNEL_UUID}
credentials-file: /home/$(whoami)/.cloudflared/${TUNNEL_UUID}.json

ingress:
  - hostname: ${DOMAIN}
    service: http://localhost:${LOCAL_PORT}
  - service: http_status:404
EOF

log_success "Konfiguration erstellt: ~/.cloudflared/config.yml"

# 6. DNS Routing einrichten
log_info "🚀 Richte DNS Routing ein..."
cloudflared tunnel route dns "${TUNNEL_NAME}" "${DOMAIN}"

# 7. Tunnel als Systemdienst installieren (optional)
if command -v systemctl &> /dev/null; then
    log_info "🛡️ Installiere Tunnel als Systemdienst..."
    sudo cloudflared service install
    sudo systemctl start cloudflared
    sudo systemctl enable cloudflared
    log_success "Tunnel-Dienst aktiviert"
else
    log_info "⚠️ Systemd nicht verfügbar - starte Tunnel im Vordergrund"
    log_info "Verwende: cloudflared tunnel run ${TUNNEL_NAME}"
fi

log_success "✅ HNOSS Secure Tunnel für ${DOMAIN} ist bereit!"
echo ""
echo "🔐 Deployment Befehle:"
echo "   cloudflared tunnel run ${TUNNEL_NAME}  # Tunnel starten"
echo "   wrangler deploy                        # Worker veröffentlichen (nach wrangler login)"