# PNIA Infrastructure Bundle — 03-service-mesh/gen_virtual_services.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 218-247
# Extracted verbatim on 2026-07-06.
# Istio VirtualService generator for 1000 IDs.

#!/bin/bash

# Skript zur Generierung der VirtualService Routing-Regeln für 1000 Instanzen
OUTPUT_DIR="routing_manifests"
mkdir -p "$OUTPUT_DIR"

echo "Generiere VirtualService Routen für 1000 Datenbanken..."

for i in {1..1000}; do
    ID="PNIA-$(printf "%04d" $i)"

    cat <<EOF > "$OUTPUT_DIR/$ID-route.yaml"
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: route-$ID
spec:
  hosts:
  - "$ID.pnia.internal"
  http:
  - route:
    - destination:
        host: pnia-db-service
        subset: $ID
EOF
done

echo "Fertig. Manifeste für das Service-Mesh unter '$OUTPUT_DIR' bereitgestellt."
