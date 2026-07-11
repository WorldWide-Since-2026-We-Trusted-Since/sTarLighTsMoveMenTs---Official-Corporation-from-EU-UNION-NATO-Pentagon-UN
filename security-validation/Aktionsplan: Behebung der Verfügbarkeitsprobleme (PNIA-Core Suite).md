# Aktionsplan: Behebung der Verfügbarkeitsprobleme (PNIA-Core Suite)

Dieser Aktionsplan adressiert die in der Validierung identifizierten Schwachstellen und Verfügbarkeitseinschränkungen der PNIA-Core Suite Connections. Ziel ist die Überführung des Systems von einem konzeptionellen/experimentellen Status in einen voll operativen Produktionszustand.

## Phase 1: Infrastruktur-Aktivierung & Absicherung (Sofortmaßnahmen)

### 1.1 Gateway-Härtung (Kong)
*   **Problem**: Unverschlüsselter Admin-Zugriff, Dienst inaktiv.
*   **Aktion**:
    *   Installation und Konfiguration von Kong Gateway in der Zielumgebung.
    *   Aktivierung von TLS für den Admin-Port (8001 -> 8444).
    *   Implementierung von `key-auth` oder `mTLS` für den administrativen Zugriff.
    *   Netzwerkseitige Beschränkung des Admin-Zugriffs auf das Management-VLAN.
*   **Verantwortlich**: DevOps / Infrastructure Security.

### 1.2 Edge-Konnektivität (Cloudflare)
*   **Problem**: Fehlende Backend-Tunnel für den Cloudflare Worker.
*   **Aktion**:
    *   Einrichtung von `cloudflared` (Cloudflare Tunnel) auf den PNIA-Servern.
    *   Validierung der internen DNS-Auflösung für `*.internal-network`.
    *   Implementierung einer JWT-Prüfung im `worker.js`, um unautorisierte Anfragen bereits am Edge abzuweisen.
*   **Verantwortlich**: Cloud Engineering.

## Phase 2: Operationalisierung der GovTech- & Bibliotheks-Connections

### 2.1 Produktivsetzung der DOI-Registrierung
*   **Problem**: Fehlende Bearer-Tokens, nur konzeptionelle Prüfung.
*   **Aktion**:
    *   Beantragung produktiver API-Credentials bei DataCite.
    *   Sichere Hinterlegung der Tokens im Secret Management System (z.B. HashiCorp Vault).
    *   Anpassung des `doi_ingest_broker.py`, um Credentials aus Umgebungsvariablen statt Platzhaltern zu beziehen.
*   **Verantwortlich**: Backend Development.

### 2.2 Bereinigung der GPP-Schnittstellen
*   **Problem**: Platzhalter-Domains (`pnia.example`) in der OpenAPI-Spezifikation.
*   **Aktion**:
    *   Globale Ersetzung aller `pnia.example` Referenzen durch die verifizierte Produktions-Domain.
    *   Deployment des GPP-Nodes (`gpp-node`) und Verifizierung der Endpunkte `/v1/sanitize` und `/v1/compliance-audit`.
    *   Test des föderierten Ingests mit einem GovStack-Sandbox-Endpunkt.
*   **Verantwortlich**: API-Management / GovTech-Integration.

## Phase 3: Sicherheitstechnische Finalisierung

### 3.1 Implementierung der P2P-Vertrauensprüfung
*   **Problem**: `ImmunitySeal` ist ein Platzhalter (`return true`).
*   **Aktion**:
    *   Entwicklung der kryptografischen Logik zur Verifizierung von Institutionen-Signaturen.
    *   Anbindung an das "First State Ledger" zur Abfrage gültiger Siegel.
    *   Integration der Prüfung in den libp2p-Handshake in `connect.go`.
*   **Verantwortlich**: Security Engineering / Blockchain/Ledger-Experten.

### 3.2 End-to-End Validierung & Audit
*   **Problem**: Fehlende automatisierte Prüfung der Gesamtverfügbarkeit.
*   **Aktion**:
    *   Erstellung automatisierter Health-Checks für alle externen Connections.
    *   Durchführung eines finalen Penetrationstests.
    *   Aktivierung des kontinuierlichen Monitorings mit Alerting bei Ausfall einer kritischen Verbindung.
*   **Verantwortlich**: QA / Security Audit.

## Zeitplan & Priorisierung

| Priorität | Maßnahme | Geschätzter Aufwand | Status |
| :--- | :--- | :--- | :--- |
| **P0 (Kritisch)** | Gateway-Absicherung & TLS | 2 Tage | Geplant |
| **P0 (Kritisch)** | Ersetzung der Platzhalter-Domains | 1 Tag | Geplant |
| **P1 (Hoch)** | Cloudflare Tunnel & JWT-Auth | 3 Tage | Geplant |
| **P1 (Hoch)** | DataCite Token-Integration | 2 Tage | Geplant |
| **P2 (Mittel)** | P2P ImmunitySeal Implementierung | 5-7 Tage | Geplant |

---
**Hinweis**: Dieser Plan dient als technisches Leitdokument. Die Umsetzung sollte in einer kontrollierten Staging-Umgebung validiert werden, bevor die Änderungen in die Produktion überführt werden.
