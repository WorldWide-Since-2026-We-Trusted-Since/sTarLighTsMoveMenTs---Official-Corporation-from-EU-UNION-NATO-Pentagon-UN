# PNIA Infrastructure Bundle — 07-gpp-protocol/doi_ingest_broker.py
# Source: ProtokolInfrastructurImplementation.txt, lines 930-964
# Extracted verbatim on 2026-07-06.
# DOI Ingest Broker calling the DataCite Fabrica API.

import requests
import json

# Konfiguration für DataCite (Test oder Produktion)
DATACITE_API = "https://api.datacite.org/dois"
HEADERS = {"Content-Type": "application/vnd.api+json", "Authorization": "Bearer YOUR_TOKEN"}

def mint_doi_for_pnia(pnia_id, metadata):
    """
    Automatisierte DOI-Registrierung für eine PNIA Datenbank-Instanz.
    Stellt sicher, dass das Objekt global identifizierbar ist.
    """
    # 1. Metadaten-Validierung (Der 12% Schwellenwert-Check)
    if len(metadata.keys()) < 12: # Beispiel-Logik für 12% Komplexität
        raise ValueError("Metadaten-Qualität unter 12% Schwellenwert.")

    payload = {
        "data": {
            "type": "dois",
            "attributes": {
                "doi": f"10.5072/{pnia_id}", # Dein DOI-Prefix
                "url": f"https://api.pnia.de/{pnia_id}",
                "titles": [{"title": f"PNIA Database Instance {pnia_id}"}],
                "publisher": "StarLightMovemenTz Repository",
                "publicationYear": 2026,
                "types": {"resourceTypeGeneral": "Dataset"}
            }
        }
    }

    # 2. Registrierung (Federated Ingest Phase)
    response = requests.post(DATACITE_API, headers=HEADERS, data=json.dumps(payload))
    return response.json()
