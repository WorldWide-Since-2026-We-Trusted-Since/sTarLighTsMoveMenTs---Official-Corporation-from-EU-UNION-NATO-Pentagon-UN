# PNIA Infrastructure Bundle — 02-scale-1000/gen_pnia_resources.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 102-170
# Extracted verbatim on 2026-07-06.
# Generates 1000 Kubernetes manifests with GPU/CPU/RAM reservations.

#!/bin/bash

# --- Konfiguration ---
OUTPUT_DIR="pnia_manifests"
mkdir -p "$OUTPUT_DIR"

# Datenbank-Typen für das Array
DB_TYPES=("clickhouse" "singlestore" "timescale" "influxdb" "duckdb")

# Ressourcen-Spezifikation (High Performance Tier)
CPU_LIMIT="64"
RAM_LIMIT="256Gi"
GPU_COUNT="4"

echo "Starte Generierung für 1000 PNIA-Datenbank-Instanzen..."

for i in {1..1000}; do
    # ID generieren
    ID="PNIA-$(printf "%04d" $i)"

    # Datenbanktyp rotieren
    DB_TYPE=${DB_TYPES[$((i % ${#DB_TYPES[@]}))]}

    # Dateiname
    FILENAME="$OUTPUT_DIR/$ID-$DB_TYPE.yaml"

    # Generiere YAML-Manifest (Beispiel für Kubernetes Custom Resource)
    cat <<EOF > "$FILENAME"
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: $ID
  labels:
    app: pnia-database
    db-type: $DB_TYPE
spec:
  replicas: 1
  selector:
    matchLabels:
      id: $ID
  template:
    metadata:
      labels:
        id: $ID
    spec:
      containers:
      - name: database-instance
        image: $DB_TYPE:latest
        resources:
          limits:
            cpu: "$CPU_LIMIT"
            memory: "$RAM_LIMIT"
            nvidia.com/gpu: "$GPU_COUNT"
          requests:
            cpu: "32"
            memory: "128Gi"
        env:
        - name: DATABASE_ID
          value: "$ID"
EOF

done

echo "Fertig. 1000 Manifeste wurden in '$OUTPUT_DIR' generiert."

Technische Erläuterung der Ressourcen-Integration

