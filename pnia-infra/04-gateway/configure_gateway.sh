# PNIA Infrastructure Bundle — 04-gateway/configure_gateway.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 294-326
# Extracted verbatim on 2026-07-06.
# Registers 1000 services and routes through the Kong Admin API.

#!/bin/bash

# Konfiguration des Gateway-Endpunkts
KONG_ADMIN_URL="http://kong-admin-api:8001"

echo "Registriere 1000 Datenbanken am API-Gateway..."

for i in {1..1000}; do
    ID="PNIA-$(printf "%04d" $i)"

    # 1. Service erstellen (Verbindung zur internen K8s-Adresse)
    curl -s -X POST $KONG_ADMIN_URL/services \
      --data name="$ID-service" \
      --data url="http://$ID.pnia-db-service:8123" > /dev/null

    # 2. Route erstellen (Mapping des URL-Pfades auf den Service)
    curl -s -X POST $KONG_ADMIN_URL/services/"$ID-service"/routes \
      --data name="$ID-route" \
      --data paths[]="/$ID" \
      --data strip_path=true > /dev/null

    # 3. Optional: Rate Limiting pro ID einfügen
    curl -s -X POST $KONG_ADMIN_URL/services/"$ID-service"/plugins \
      --data name="rate-limiting" \
      --data config.minute=1000 \
      --data config.policy=local > /dev/null

    echo "Gateway-Konfiguration für $ID erfolgreich."
done

echo "Fertig. Das Gateway ist nun für 1000 Instanzen einsatzbereit."
