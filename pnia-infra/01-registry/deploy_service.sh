# PNIA Infrastructure Bundle — 01-registry/deploy_service.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 25-70
# Extracted verbatim on 2026-07-06.
# Interactive deploy script driven by a unique PNIA ID.

#!/bin/bash

# --- Deployment-Skript für PNIA-Integration ---
# Funktion: Deployment basierend auf Unique ID

# Registry Datei definieren
REGISTRY_FILE="registry.csv"

# Benutzereingabe
echo "Bitte geben Sie die Unique ID für das Deployment ein:"
read -r UNIQUE_ID

# Überprüfung, ob ID in der Registry existiert
CONFIG_LINE=$(grep "^$UNIQUE_ID," "$REGISTRY_FILE")

if [ -z "$CONFIG_LINE" ]; then
    echo "Fehler: ID '$UNIQUE_ID' nicht in der Registry gefunden."
    exit 1
fi

# Daten extrahieren (IFS trennt bei Komma)
IFS=',' read -r ID DB_TYPE DB_PORT DB_NAME <<< "$CONFIG_LINE"

echo "------------------------------------------------"
echo "Deployment wird gestartet für:"
echo "ID: $ID | Typ: $DB_TYPE | DB: $DB_NAME"
echo "------------------------------------------------"

# Exportieren der Variablen für docker-compose
export DB_IMAGE_TYPE=$DB_TYPE
export DB_INTERNAL_PORT=$DB_PORT
export DB_NAME=$DB_NAME

# Start des Containers (Annahme: docker-compose.yml ist vorhanden)
# Hier wird die Umgebung für den Container dynamisch geladen
docker compose up -d

# Bestätigung
if [ $? -eq 0 ]; then
    echo "Deployment erfolgreich abgeschlossen."
    echo "Dienst '$DB_NAME' ist unter Port $DB_PORT erreichbar."
else
    echo "Fehler beim Deployment."
fi
