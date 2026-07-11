# PNIA Infrastructure Bundle — 04-gateway/generate_credentials.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 348-370
# Extracted verbatim on 2026-07-06.
# Generates one cryptographic API key per PNIA ID and writes credentials.csv.

#!/bin/bash

# --- Konfiguration ---
CREDENTIALS_FILE="credentials.csv"
echo "ID,API_KEY" > "$CREDENTIALS_FILE"

echo "Generiere 1000 sichere API-Schlüssel für die PNIA-Infrastruktur..."

for i in {1..1000}; do
    ID="PNIA-$(printf "%04d" $i)"

    # Generiere einen kryptographisch sicheren 32-Byte Schlüssel
    # base64 kodiert, damit er als String kompatibel ist
    API_KEY=$(openssl rand -base64 32 | tr -d '/+=')

    # Speichern in die CSV
    echo "$ID,$API_KEY" >> "$CREDENTIALS_FILE"
done

echo "Fertig. Die Keys wurden in '$CREDENTIALS_FILE' gespeichert."

