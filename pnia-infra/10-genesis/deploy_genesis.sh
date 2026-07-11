# PNIA Infrastructure Bundle — 10-genesis/deploy_genesis.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 2853-2892
# Extracted verbatim on 2026-07-06.
# All-in-one Genesis-Node bootstrap script (Arch Linux).

#!/bin/bash
# First State Genesis-Deployment Script
set -e

echo "[Genesis] Starte Deployment für First State Node..."

# 1. Deployment der Identity-Plattform
echo "[Genesis] Deploye Portal..."
mkdir -p /var/www/stellar-portal
cp "sTarLighTsMoveMenTz - Stellar__ Identity Portal Card HTML-Datei.html" /var/www/stellar-portal/index.html

# 2. Deployment des FSC-D Daemon
echo "[Genesis] Starte First State Core Daemon..."
# Setze Berechtigungen für das First State Protokoll
chmod +x ./daemon/fscd
sudo cp ./daemon/fscd /usr/local/bin/fscd

# 3. Systemd-Service für den First State Modus
cat <<EOF | sudo tee /etc/systemd/system/first-state-node.service
[Unit]
Description=First State Core Daemon (Sovereign Infrastructure)
After=network.target

[Service]
ExecStart=/usr/local/bin/fscd
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable first-state-node
sudo systemctl start first-state-node

echo "[Genesis] First State Protocol Modus: ACTIVATED"
echo "[Genesis] Identity Portal erreichbar unter localhost."
