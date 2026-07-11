# Sicherheitsaspekte und Verbindungskonzepte der PNIA-Core Suite

Die PNIA-Core Suite ist darauf ausgelegt, eine sichere und konforme Integration mit externen Systemen wie Nationalbibliotheken und GovTech-Ökosystemen zu gewährleisten. Die Architektur nutzt eine Kombination aus API-Schnittstellen, Protokollen und Infrastrukturkomponenten, um eine automatisierte und sichere Datenübertragung und -validierung zu ermöglichen. Im Folgenden werden die zentralen Verbindungstypen und ihre jeweiligen Sicherheitsaspekte detailliert analysiert.

## 1. DOI-Registrierung mit Nationalbibliotheken und wissenschaftlichen Archiven (DataCite)

Die Anbindung an Nationalbibliotheken und wissenschaftliche Archive erfolgt primär über die Registrierung von Digital Object Identifiers (DOIs) mittels des **DOI Ingest Brokers** [1].

### 1.1 Mechanismus

Das Python-Skript `doi_ingest_broker.py` [1] übermittelt Metadaten von PNIA-Datenbankinstanzen an die DataCite Fabrica API. Dies stellt die globale Eindeutigkeit und Zitierbarkeit jeder PNIA-Datenbankinstanz sicher und fördert deren Auffindbarkeit und Langzeitarchivierung.

### 1.2 Sicherheitsaspekte

*   **Authentifizierung**: Der Zugriff auf die DataCite API erfolgt über einen `Authorization: Bearer YOUR_TOKEN` Header [1]. Dies deutet auf die Verwendung von Token-basierter Authentifizierung hin, die sicherstellt, dass nur autorisierte PNIA-Instanzen DOIs registrieren können.
*   **Metadaten-Validierung**: Vor der Übermittlung an DataCite führt das Skript eine grundlegende Metadaten-Validierung durch (z.B. ein "12% Schwellenwert-Check" basierend auf der Anzahl der Metadatenfelder) [1]. Dies dient als erste Qualitätssicherungsebene, um die Integrität und Vollständigkeit der zu registrierenden Daten zu gewährleisten.
*   **Datenintegrität**: Die Zuweisung einer DOI zu jeder PNIA-Datenbankinstanz schafft eine unveränderliche Referenz, die zur Überprüfung der Datenintegrität und -provenienz in Bibliotheks- und Forschungsinfrastrukturen genutzt werden kann.

## 2. GovTech-Integration über das Good Public Protocol (GPP)

Die Verbindung zur "GovTech-Welt" und zu Initiativen wie GovStack wird durch das **Good Public Protocol (GPP)** und dessen Schnittstellen realisiert [2].

### 2.1 Mechanismus

Die `gpp-interface.yaml` [2] definiert die **GPP-I (Good Public Protocol Interface)** mit drei zentralen API-Endpunkten:

*   `/v1/sanitize`: Prüft Software/Daten auf "Fake-Inhalte" und Validität gemäß ISO-Standard, basierend auf dem "Software-Showering"-Prinzip.
*   `/v1/federated-ingest`: Überträgt validierte Pakete an GovStack/Bibliotheken.
*   `/v1/compliance-audit`: Liefert einen "Issue-basierten Nachweis" oder ein Zertifikat für die internationale Governance-Ebene.

Der `gpp-node` (`main.go` [4]) ist das Kernstück der GPP-Integration und validiert eingehende "States" mittels des `shower.Validator` (`validator.go` [5]).

### 2.2 Sicherheitsaspekte

*   **Machine-to-Machine-Kommunikation**: Die Kommunikation erfolgt ausschließlich über API-Keys und Zertifikate, ohne manuelle Portale oder Benutzer-Logins [2]. Dies reduziert die Angriffsfläche durch menschliche Fehler oder kompromittierte Anmeldeinformationen.
*   **Datenvalidierung und -integrität (`Shower`-Engine)**: Der `/v1/sanitize`-Endpunkt und der `shower.Validator` [5] sind entscheidend für die Datenintegrität. Sie verbieten explizit "dummy", "placeholder", "n/a", "testdata" und prüfen auf leere Payloads. Dies stellt sicher, dass nur "reine" und konforme Daten in das GovTech-Ökosystem gelangen.
*   **Provenienz und Compliance**: Der `provenance-token` Header im `/v1/sanitize`-Endpunkt [2] ist ein wichtiger Mechanismus zur Nachverfolgung der Datenherkunft. Das `gpp-manifest.yaml` [6] legt Validierungsprinzipien wie `cryptographic_signing` für die Quellverifikation und `Strict-Audit` für den Verifizierungsmodus fest, was die Einhaltung internationaler Standards wie GovStack/X-Road unterstreicht und einen "Trust-Layer" bildet.
*   **Auditierbarkeit**: Der `/v1/compliance-audit`-Endpunkt ermöglicht die Erstellung von Nachweisen und Zertifikaten, was die Transparenz und Auditierbarkeit der Compliance-Prozesse erhöht.

## 3. Infrastruktur für externe Zugänglichkeit

Die PNIA-Core Suite nutzt eine robuste Edge- und Gateway-Infrastruktur, um die Kommunikation mit externen Systemen zu ermöglichen.

### 3.1 Edge-Routing (Cloudflare Worker)

*   **Mechanismus**: Der `worker.js` [7] ist für das Edge-Routing zuständig und leitet Anfragen von PNIA-Subdomains dynamisch an interne Dienste weiter.
*   **Sicherheitsaspekte**: Die aktuelle Implementierung des Workers zeigt keine zusätzlichen Authentifizierungs-, Header-Filterungs- oder Ursprungsprüfungsmechanismen. Dies bedeutet, dass die Sicherheit stark von den nachgelagerten internen Diensten abhängt und eine potenzielle Angriffsfläche am Edge darstellen könnte, wenn keine weiteren Schutzmaßnahmen implementiert sind.

### 3.2 API-Gateway (Kong API Gateway)

*   **Mechanismus**: Das Skript `configure_gateway.sh` [8] konfiguriert das Kong API Gateway, um bis zu 1000 PNIA-Instanzen zu exponieren.
*   **Sicherheitsaspekte**: Das Konfigurationsskript verwendet einen unverschlüsselten Admin-Endpunkt (`http://kong-admin-api:8001`) [8]. Es sind keine expliziten Authentifizierungs-, TLS-Einstellungen oder Zugriffssteuerungslisten (ACLs) im Skript sichtbar. Dies stellt ein erhebliches Sicherheitsrisiko dar, da unautorisierter Zugriff auf die Gateway-Konfiguration möglich sein könnte. Obwohl Rate-Limiting optional konfiguriert werden kann, sind grundlegende Sicherheitsmaßnahmen wie Authentifizierung und Verschlüsselung für den Admin-Zugriff unerlässlich.

## 4. Peer-to-Peer Institutionelle Verbindungen

Neben den API-basierten Integrationen existiert ein Mechanismus für sichere Peer-to-Peer-Verbindungen zwischen "souveränen" Knoten [9].

### 4.1 Mechanismus

Das Go-Skript `connect.go` [9] implementiert einen libp2p-basierten "diplomatischen Handshake" zwischen PNIA-Knoten und einem "Genesis-Knoten". Ein `GPPConnector` versucht, eine Verbindung zu einem "souveränen" Knoten herzustellen und verifiziert dessen "ImmunitySeal".

### 4.2 Sicherheitsaspekte

*   **ImmunitySeal-Verifizierung**: Die `ConnectToSovereignNode`-Funktion erfordert eine `VerifyImmunitySeal`-Prüfung [9]. Diese soll einen kryptografischen Abgleich mit einem "First State Ledger" durchführen, um sicherzustellen, dass nur Knoten mit einem gültigen, staatlich registrierten Siegel Daten senden dürfen. Dies ist ein starkes Konzept für vertrauenswürdige Kommunikation.
*   **Aktuelle Implementierungslücke**: Die aktuelle Implementierung von `VerifyImmunitySeal` ist ein Platzhalter (`return true`) [9]. Dies stellt eine kritische Sicherheitslücke dar, da die vorgesehene kryptografische Verifizierung noch nicht implementiert ist und somit die Vertrauenswürdigkeit der P2P-Verbindungen nicht gewährleistet ist.
*   **Sicherheitsisolation**: Bei einem fehlgeschlagenen `ImmunitySeal`-Check wird die Verbindung sofort geschlossen (`c.Host.Close()`), was eine Sicherheitsisolation darstellt [9].

## 5. Zusammenfassung der Sicherheitsaspekte und Connections

Die PNIA-Core Suite verfolgt einen mehrschichtigen Ansatz für externe Verbindungen, der sowohl robuste Sicherheitsmechanismen als auch identifizierte Schwachstellen aufweist.

| Verbindungstyp | Zielinstitution | Mechanismus | Sicherheitsaspekte | Status/Risiko |
| :--- | :--- | :--- | :--- | :--- |
| **DOI-Registrierung** | Nationalbibliotheken, DataCite | `doi_ingest_broker.py` | Token-basierte Authentifizierung, Metadaten-Validierung | Implementiert, grundlegende Sicherheit vorhanden |
| **GovTech-API** | GovStack, internationale Governance | `gpp-interface.yaml`, `gpp-node` | Machine-to-Machine (API-Keys/Zertifikate), `Shower`-Engine (Datenvalidierung), Provenienz (`provenance-token`), Auditierbarkeit | Implementiert, hohe Sicherheit für Datenintegrität und Compliance |
| **Edge-Routing** | Externe Konsumenten | `worker.js` (Cloudflare Worker) | Keine zusätzliche Authentifizierung/Filterung im Worker | Potenzielle Angriffsfläche, Sicherheit hängt von internen Diensten ab |
| **API-Gateway** | Externe Konsumenten | `configure_gateway.sh` (Kong Gateway) | Unverschlüsselter Admin-Endpunkt, keine explizite Auth/TLS/ACLs im Skript | **Kritisches Sicherheitsrisiko**, unautorisierter Zugriff möglich |
| **P2P-Verbindung** | Souveräne/institutionelle Knoten | `connect.go` (libp2p) | Konzept des `ImmunitySeal` für kryptografische Verifizierung | **Kritische Implementierungslücke**, `ImmunitySeal` ist Platzhalter |

## Referenzen

[1] [doi_ingest_broker.py](/home/ubuntu/analysis/doi_ingest_broker.py) - DOI Ingest Broker.
[2] [gpp-interface.yaml](/home/ubuntu/analysis/gpp-interface.yaml) - GPP Interface / Compliance-Gateway Definition.
[3] [validator.go](/home/ubuntu/analysis/validator.go) - Compliance-Prüfung.
[4] [main.go](/home/ubuntu/analysis/main.go) - GPP Node Core.
[5] [GOVERNANCE_MANIFEST.md](/home/ubuntu/analysis/GOVERNANCE_MANIFEST.md) - Ethische und institutionelle Ausrichtung.
[6] [gpp-manifest.yaml](/home/ubuntu/analysis/gpp-manifest.yaml) - Kompaktes Compliance-Manifest für das Good Public Protocol.
[7] [worker.js](/home/ubuntu/analysis/worker.js) - Cloudflare Worker für Edge Routing.
[8] [configure_gateway.sh](/home/ubuntu/analysis/configure_gateway.sh) - Kong API Gateway Konfiguration.
[9] [connect.go](/home/ubuntu/analysis/connect.go) - First-State Connect (P2P-Verbindung).
