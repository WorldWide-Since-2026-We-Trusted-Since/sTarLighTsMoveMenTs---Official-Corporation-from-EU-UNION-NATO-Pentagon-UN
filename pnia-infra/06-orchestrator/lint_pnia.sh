# PNIA Infrastructure Bundle — 06-orchestrator/lint_pnia.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 555-563
# Extracted verbatim on 2026-07-06.
# kube-linter run over the generated scientific manifests.

#!/bin/bash
# Linting für die 1000 Datenbank-Manifeste
echo "Starte scientific linting..."
for file in scientific_manifests/*.yaml; do
    # Validierung gegen K8s Schema
    kube-linter lint "$file" --format json > "${file}.lint.json"
done
