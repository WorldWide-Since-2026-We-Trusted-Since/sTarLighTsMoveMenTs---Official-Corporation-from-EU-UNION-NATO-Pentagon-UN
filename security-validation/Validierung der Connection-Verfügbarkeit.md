# Validierung der Connection-Verfügbarkeit

Die folgende Analyse bewertet den aktuellen Status und die Verfügbarkeit der einzelnen Verbindungskanäle der PNIA-Core Suite basierend auf den bereitgestellten Skripten und einer Live-Prüfung der externen Endpunkte.

## 1. Externe Verbindungen (Third-Party)

### 1.1 DataCite API (DOI-Registrierung)
*   **Endpunkt**: `https://api.datacite.org/dois` [1]
*   **Live-Status**: **VERFÜGBAR** (HTTP 200 OK bei Prüfung am 09.07.2026).
*   **Validierung**: Die API ist erreichbar und antwortet auf Anfragen. Die technische Integration via `doi_ingest_broker.py` ist konzeptionell korrekt, erfordert jedoch einen gültigen Bearer-Token für produktive Schreibvorgänge.

### 1.2 GovStack / GPP-Schnittstelle
*   **Endpunkt**: `https://api.pnia.example/gpp/tick` (laut `openapi.yaml` [2])
*   **Status**: **KONZEPTIONELL / NICHT ERREICHBAR**.
*   **Validierung**: Die Domain `pnia.example` ist eine Platzhalter-Domain. Die tatsächliche Verfügbarkeit hängt vom Deployment in der Zielumgebung ab. Die Endpunkte `/v1/sanitize`, `/v1/federated-ingest` und `/v1/compliance-audit` sind in der Spezifikation definiert, aber es gibt keinen aktiven produktiven Endpunkt in der Testumgebung.

## 2. Infrastruktur-Verbindungen (Gateway & Edge)

### 2.1 Cloudflare Edge Routing
*   **Mechanismus**: Dynamisches Mapping von Subdomains (z.B. `PNIA-0001.pnia.dein-projekt.de`) auf interne Ziel-URLs [3].
*   **Status**: **BEREIT (Konfigurationsebene)**.
*   **Validierung**: Das Skript `worker.js` ist funktional vollständig für das Routing. Die tatsächliche Verfügbarkeit hängt von der korrekten Einrichtung des Cloudflare Tunnels und der Auflösung von `*.internal-network` ab. Ohne diese Backend-Infrastruktur führt der Worker zu einem Gateway-Fehler (502/504).

### 2.2 Kong API Gateway
*   **Mechanismus**: Exponierung von bis zu 1000 PNIA-Instanzen über `/PNIA-XXXX` Pfade [4].
*   **Status**: **INAKTIV (Sandbox-Umgebung)**.
*   **Validierung**: Eine Prüfung der offenen Ports in der aktuellen Umgebung zeigt keinen aktiven Kong-Dienst auf den Standardports (8000, 8001). Das Skript `configure_gateway.sh` ist ein Automatisierungswerkzeug, das erst bei Ausführung in einer Umgebung mit installiertem Kong wirksam wird.

## 3. Peer-to-Peer Verbindungen

### 3.1 First-State P2P Connect
*   **Protokoll**: libp2p [5]
*   **Status**: **EINGESCHRÄNKT / EXPERIMENTELL**.
*   **Validierung**: Der Code in `connect.go` ermöglicht den Aufbau von P2P-Verbindungen. Da jedoch die `VerifyImmunitySeal`-Funktion ein Platzhalter ist, der immer `true` zurückgibt, ist die *sicherheitsrelevante* Verfügbarkeit (die Validierung der Souveränität) aktuell nicht gegeben. Verbindungen können technisch aufgebaut werden, aber ohne Vertrauensprüfung.

## Zusammenfassung der Verfügbarkeit

| Connection | Ziel | Typ | Status | Anmerkung |
| :--- | :--- | :--- | :--- | :--- |
| **DataCite** | `api.datacite.org` | API | **GRÜN** | Externer Dienst ist online und bereit. |
| **GPP / GovStack** | `api.pnia.example` | API | **ROT** | Platzhalter-Domain in der Konfiguration. |
| **Edge Routing** | Cloudflare Worker | Proxy | **GELB** | Logik vorhanden, Backend-Tunnel erforderlich. |
| **API Gateway** | Kong Gateway | Gateway | **GRAU** | Dienst in aktueller Umgebung nicht gestartet. |
| **P2P Connect** | Souveräne Knoten | P2P | **GELB** | Technisch möglich, Sicherheitsprüfung fehlt. |

## Empfohlene nächste Schritte zur Validierung
1.  **Ersetzung der Platzhalter-URLs**: Austausch von `pnia.example` durch die tatsächliche Produktions-Domain in `openapi.yaml`.
2.  **End-to-End Handshake-Test**: Durchführung eines Test-Ingests bei DataCite (Sandbox-Modus), um die Token-Gültigkeit zu prüfen.
3.  **Dienst-Check**: Verifizierung, ob die internen Dienste unter `*.internal-network:8080` tatsächlich auf Anfragen des Cloudflare Workers reagieren.

## Referenzen
[1] [doi_ingest_broker.py](/home/ubuntu/analysis/doi_ingest_broker.py)
[2] [openapi.yaml](/home/ubuntu/analysis/openapi.yaml)
[3] [worker.js](/home/ubuntu/analysis/worker.js)
[4] [configure_gateway.sh](/home/ubuntu/analysis/configure_gateway.sh)
[5] [connect.go](/home/ubuntu/analysis/connect.go)
