# PNIA-Core Suite: Externe Verbindungskanäle zu GovTech und Nationalbibliotheken

Die PNIA-Core Suite ist darauf ausgelegt, eine nahtlose und konforme Integration mit externen GovTech-Ökosystemen und wissenschaftlichen/bibliothekarischen Infrastrukturen zu gewährleisten. Dies wird durch eine Kombination aus dedizierten API-Schnittstellen, Protokollen und Infrastrukturkomponenten erreicht, die eine sichere und automatisierte Datenübertragung und -validierung ermöglichen.

## 1. Integration mit Nationalbibliotheken und wissenschaftlichen Archiven (DataCite)

Die Anbindung an Nationalbibliotheken und wissenschaftliche Archive erfolgt primär über die Registrierung von Digital Object Identifiers (DOIs) mittels des **DOI Ingest Brokers** [1].

*   **`doi_ingest_broker.py`**: Dieses Python-Skript ist dafür verantwortlich, Metadaten von PNIA-Datenbankinstanzen an die DataCite Fabrica API zu übermitteln. DataCite ist eine führende Organisation, die die Registrierung von DOIs für Forschungsdaten und andere wissenschaftliche Objekte ermöglicht. Durch die Zuweisung einer DOI wird jede PNIA-Datenbankinstanz global eindeutig identifizierbar und zitierbar, was ihre Auffindbarkeit und Langzeitarchivierung in Bibliotheks- und Forschungsinfrastrukturen sicherstellt.
    *   **Mechanismus:** Das Skript konstruiert eine JSON-Payload mit spezifischen Metadaten (z.B. `doi`, `url`, `titles`, `publisher`, `publicationYear`, `resourceTypeGeneral`) und sendet diese per HTTP POST an die DataCite API. Eine Metadaten-Validierung (hier beispielhaft als "12% Schwellenwert-Check" implementiert) stellt die Qualität der zu registrierenden Daten sicher.
    *   **Variable:** `DATACITE_API` (`https://api.datacite.org/dois`) definiert den Endpunkt für die DOI-Registrierung.

## 2. GovTech-Integration über das Good Public Protocol (GPP)

Die Verbindung zur "GovTech-Welt" und zu Initiativen wie GovStack wird durch das **Good Public Protocol (GPP)** und dessen Schnittstellen realisiert [2].

*   **`gpp-interface.yaml`**: Diese OpenAPI-Spezifikation definiert die **GPP-I (Good Public Protocol Interface)** als den "Handshake" zwischen der PNIA-Infrastruktur und der GovTech-Welt. Sie beschreibt drei zentrale API-Endpunkte:
    *   `/v1/sanitize`: "Duscht Software/Daten von Fake-Inhalten" und prüft auf Validität gemäß ISO-Standard. Dies ist ein direkter Bezug zum "Software-Showering"-Prinzip, das die Datenintegrität sicherstellt.
    *   `/v1/federated-ingest`: "Reicht das validierte Paket bei GovStack/Bibliotheken ein". Dies ist der direkte Kanal für die Übertragung konformer Daten an GovTech-Plattformen.
    *   `/v1/compliance-audit`: Liefert einen "Issue-basierten Nachweis" oder ein Zertifikat für die internationale Governance-Ebene.
    *   **Mechanismus:** Die Kommunikation erfolgt rein "Machine-to-Machine" über API-Keys und Zertifikate, ohne manuelle Portale. Die GPP-API automatisiert Compliance-Prozesse, indem sie Daten vor der Einreichung validiert.
    *   **Implikation:** Durch die Einhaltung von GovStack/X-Road-Standards wird das PNIA-Protokoll als Teil der globalen GovTech-Architektur positioniert und liefert eine "Trust-Layer".

*   **`openapi.yaml` (PNIA Deploy-by-ID API)**: Die übergeordnete API-Spezifikation listet explizit "DataCite and GPP" als Integrationspunkte auf [3]. Dies bestätigt die strategische Bedeutung dieser externen Verbindungen für das gesamte PNIA-System.

*   **`main.go` (GPP Node)**: Der GPP Node (`gpp-node`) ist das Kernstück der GPP-Integration. Er validiert eingehende "States" und integriert die "Endgeldlohn"-Logik, die eine Verbuchung der Leistung in einem Public Ledger vorsieht. Dieses Ledger kann von "staatlichen Finanzbehörden" direkt in ihre ERP-Systeme (z.B. SAP/GovStack) eingebunden werden, um "Endgeldlohn" automatisiert auszuzahlen [4].
    *   **Mechanismus:** Der `shower.Validator` prüft die Daten auf Verfassungskonformität, bevor sie weiterverarbeitet und in die "Archiv-Kette" verankert werden. Die Integration mit ERP-Systemen deutet auf eine tiefe finanzielle und administrative Anbindung an staatliche Infrastrukturen hin.

## 3. Infrastruktur für externe Zugänglichkeit

Um die Kommunikation mit externen Systemen zu ermöglichen, setzt PNIA-Core auf eine robuste Edge- und Gateway-Infrastruktur.

*   **`worker.js` (Cloudflare Worker)**: Dieser Worker ist für das Edge-Routing zuständig und leitet Anfragen von PNIA-Subdomains (`PNIA-XXXX.pnia.dein-projekt.de`) dynamisch an interne Dienste weiter [5].
    *   **Mechanismus:** Er extrahiert die PNIA-ID aus der Subdomain und konstruiert eine interne Ziel-URL, die dann an den entsprechenden internen Dienst (z.B. `http://PNIA-XXXX.internal-network:8080`) weitergeleitet wird. Dies ermöglicht eine skalierbare und sichere Exposition der PNIA-Dienste nach außen.

*   **`configure_gateway.sh` (Kong API Gateway)**: Dieses Skript konfiguriert das Kong API Gateway, um bis zu 1000 PNIA-Instanzen zu exponieren [6].
    *   **Mechanismus:** Für jede PNIA-ID wird ein Service und eine Route im Kong Gateway erstellt. Die Route (`/PNIA-XXXX`) leitet Anfragen an den internen Kubernetes-Dienst (`http://PNIA-XXXX.pnia-db-service:8123`) weiter. Optional können auch Rate-Limiting-Plugins pro Dienst konfiguriert werden. Dies stellt eine kontrollierte und performante Schnittstelle für externe Konsumenten dar.

## 4. Peer-to-Peer Institutionelle Verbindungen

Neben den API-basierten Integrationen existiert auch ein Mechanismus für sichere Peer-to-Peer-Verbindungen zwischen "souveränen" Knoten [7].

*   **`connect.go` (First-State Connect)**: Dieses Go-Skript implementiert einen libp2p-basierten "diplomatischen Handshake" zwischen PNIA-Knoten und einem "Genesis-Knoten".
    *   **Mechanismus:** Ein `GPPConnector` versucht, eine Verbindung zu einem "souveränen" Knoten herzustellen und verifiziert dessen "ImmunitySeal" (ein digitales Siegel der Institution). Nur Knoten mit einem gültigen, staatlich registrierten Siegel dürfen Daten senden. Dies deutet auf eine hochsichere, vertrauenswürdige Kommunikationsschicht für den Austausch zwischen staatlichen oder institutionellen Entitäten hin.
    *   **Implikation:** Diese P2P-Verbindung könnte für den Austausch sensibler Governance-Informationen oder für die Synchronisation von "First State"-Manifesten zwischen vertrauenswürdigen Partnern genutzt werden.

## 5. Zusammenfassung der Verbindungswege

Die PNIA-Core Suite nutzt eine mehrschichtige Strategie für externe Verbindungen:

| Verbindungstyp | Zielinstitution | Mechanismus | Zweck |
| :--- | :--- | :--- | :--- |
| **DOI-Registrierung** | Nationalbibliotheken, wissenschaftliche Archive (DataCite) | `doi_ingest_broker.py` (Python-Skript) | Globale Identifizierbarkeit und Zitierbarkeit von Daten. |
| **GovTech-API** | GovStack, internationale Governance-Ebene | `gpp-interface.yaml` (OpenAPI), `gpp-node` (Go-Anwendung) | Automatisierte Compliance, Validierung und föderiertes Ingest von Daten. Integration mit staatlichen ERP-Systemen. |
| **Edge-Routing** | Externe Konsumenten | `worker.js` (Cloudflare Worker) | Sichere und skalierbare Exposition von PNIA-Diensten über Subdomains. |
| **API-Gateway** | Externe Konsumenten | `configure_gateway.sh` (Kong API Gateway) | Verwaltung und Schutz des Zugriffs auf interne PNIA-Dienste. |
| **P2P-Verbindung** | Souveräne/institutionelle Knoten | `connect.go` (Go-Skript mit libp2p) | Hochsichere, vertrauenswürdige Kommunikation und Synchronisation zwischen staatlichen/institutionellen Entitäten.

Diese Architektur ermöglicht es der PNIA-Core Suite, als integraler Bestandteil eines breiteren GovTech- und wissenschaftlichen Ökosystems zu fungieren, indem sie sowohl standardisierte API-Schnittstellen als auch spezialisierte, sichere Peer-to-Peer-Kanäle nutzt.

## 6. Referenzen

[1] [doi_ingest_broker.py](/home/ubuntu/concept_pnia/pnia-infra/infra/07-gpp-protocol/doi_ingest_broker.py) - DOI Ingest Broker.
[2] [gpp-interface.yaml](/home/ubuntu/concept_pnia/pnia-infra/infra/07-gpp-protocol/gpp-interface.yaml) - GPP Interface / Compliance-Gateway Definition.
[3] [openapi.yaml](/home/ubuntu/concept_pnia/pnia-infra/infra/api/openapi.yaml) - PNIA Deploy-by-ID API Spezifikation.
[4] [main.go](/home/ubuntu/concept_pnia/pnia-infra/infra/08-gpp-node/cmd/gpp-node/main.go) - GPP Node Core.
[5] [worker.js](/home/ubuntu/concept_pnia/pnia-infra/infra/05-cloudflare/worker.js) - Cloudflare Worker für Edge Routing.
[6] [configure_gateway.sh](/home/ubuntu/concept_pnia/pnia-infra/infra/04-gateway/configure_gateway.sh) - Kong API Gateway Konfiguration.
[7] [connect.go](/home/ubuntu/concept_pnia/pnia-infra/infra/09-first-state/connect.go) - First-State Connect (P2P-Verbindung).
