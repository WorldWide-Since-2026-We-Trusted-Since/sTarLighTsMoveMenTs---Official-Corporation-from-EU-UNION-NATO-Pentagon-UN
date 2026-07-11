# Validierungskonzept für PNIA-Core Suite Connections

Dieses Dokument beschreibt ein Validierungskonzept für die externen Verbindungskanäle der PNIA-Core Suite zu Nationalbibliotheken (via DataCite) und GovTech-Ökosystemen (via GovStack), sowie die zugrundeliegende Infrastruktur und Peer-to-Peer-Verbindungen. Ziel ist es, die Sicherheit, Integrität und Konformität dieser Verbindungen systematisch zu überprüfen und zu gewährleisten.

## 1. Validierung der DOI-Registrierung (DataCite)

Die Validierung der DOI-Registrierung konzentriert sich auf die korrekte Authentifizierung und die Qualität der übermittelten Metadaten.

### 1.1 Authentifizierung

*   **Prüfziel**: Sicherstellen, dass nur autorisierte PNIA-Instanzen DOIs bei DataCite registrieren können.
*   **Validierungsschritte**:
    1.  **Token-Management-Audit**: Überprüfung des Prozesses zur Generierung, Speicherung und Rotation des `Bearer YOUR_TOKEN` [1]. Sicherstellen, dass der Token sicher verwaltet wird und nicht hartkodiert ist.
    2.  **Zugriffstests**: Versuch, eine DOI-Registrierung mit einem ungültigen oder fehlenden Token durchzuführen. Die API sollte den Zugriff verweigern.

### 1.2 Metadaten-Validierung

*   **Prüfziel**: Gewährleistung der Qualität und Vollständigkeit der Metadaten vor der DOI-Registrierung.
*   **Validierungsschritte**:
    1.  **Schwellenwert-Test**: Testen des "12% Schwellenwert-Checks" [1] mit Metadaten-Payloads, die unter und über diesem Schwellenwert liegen. Verifizieren, dass das Skript `doi_ingest_broker.py` [1] entsprechend reagiert (Fehler bei Unterschreitung, Erfolg bei Überschreitung).
    2.  **Schema-Konformität**: Überprüfung, ob die generierte JSON-Payload dem DataCite-Metadaten-Schema entspricht. Dies kann durch die Verwendung von DataCite-Validierungstools oder durch manuelle Überprüfung der Struktur erfolgen.
    3.  **Datenintegrität der Metadaten**: Sicherstellen, dass die Metadaten korrekt aus den PNIA-Datenbankinstanzen extrahiert werden und keine Verfälschungen oder Verluste während des Prozesses auftreten.

## 2. Validierung der GovTech-Integration (GPP/GovStack)

Die Validierung der GovTech-Integration konzentriert sich auf die Machine-to-Machine-Kommunikation, die Datenvalidierung durch die `Shower`-Engine, Provenienz und Auditierbarkeit.

### 2.1 Machine-to-Machine-Kommunikation

*   **Prüfziel**: Sicherstellen, dass die Kommunikation ausschließlich über API-Keys und Zertifikate erfolgt und keine manuellen Zugänge existieren.
*   **Validierungsschritte**:
    1.  **Zertifikats- und API-Key-Management**: Audit der Prozesse zur Generierung, Verteilung, Speicherung und Rotation von API-Keys und Zertifikaten. Sicherstellen, dass diese kryptografisch stark und sicher verwaltet werden.
    2.  **Zugriffskontrolle**: Testen des Zugriffs auf die GPP-API (`gpp-interface.yaml` [2]) mit ungültigen oder fehlenden API-Keys/Zertifikaten. Alle Zugriffsversuche sollten fehlschlagen.

### 2.2 Datenvalidierung (`Shower`-Engine)

*   **Prüfziel**: Verifizieren, dass die `Shower`-Engine (`validator.go` [3]) effektiv "Fake-Inhalte" und Platzhalter entfernt und nur konforme Daten akzeptiert.
*   **Validierungsschritte**:
    1.  **Negativtests für `/v1/sanitize`**: Senden von Payloads an den `/v1/sanitize`-Endpunkt [2], die verbotene Muster wie "dummy", "placeholder", "n/a", "testdata" oder leere Pakete enthalten. Verifizieren, dass die `Shower`-Engine diese korrekt ablehnt und entsprechende Fehlermeldungen zurückgibt.
    2.  **Positivtests für `/v1/sanitize`**: Senden von sauberen, konformen Payloads und Verifizieren, dass diese erfolgreich verarbeitet werden.
    3.  **ISO-Standard-Konformität**: Wenn ein spezifischer ISO-Standard für die Validität genannt wird, muss überprüft werden, ob die `Shower`-Engine diesen Standard korrekt implementiert und durchsetzt.

### 2.3 Provenienz und Auditierbarkeit

*   **Prüfziel**: Sicherstellen, dass die Herkunft der Daten nachvollziehbar ist und Compliance-Audits durchgeführt werden können.
*   **Validierungsschritte**:
    1.  **`provenance-token`-Validierung**: Überprüfung, ob der `provenance-token` Header [2] korrekt generiert, übermittelt und auf Gültigkeit geprüft wird. Simulation von fehlenden oder manipulierten Tokens, um die Reaktion des Systems zu testen.
    2.  **Audit-Report-Generierung**: Testen des `/v1/compliance-audit`-Endpunkts [2], um zu verifizieren, dass er korrekte und vollständige "Issue-basierte Nachweise" oder Zertifikate liefert.
    3.  **Compliance-Manifest-Abgleich**: Überprüfung, ob die Implementierung der GPP-API die im `gpp-manifest.yaml` [6] definierten Validierungsprinzipien (z.B. `cryptographic_signing`, `Strict-Audit`) tatsächlich einhält.

## 3. Validierung der Infrastruktur für externe Zugänglichkeit

Die Validierung dieser Komponenten konzentriert sich auf die Identifizierung und Behebung von Schwachstellen in der Edge- und Gateway-Infrastruktur.

### 3.1 Edge-Routing (Cloudflare Worker)

*   **Prüfziel**: Bewertung der Sicherheit des `worker.js` [7] und der Abhängigkeiten von nachgelagerten Diensten.
*   **Validierungsschritte**:
    1.  **Sicherheitsanalyse des Workers**: Code-Review des `worker.js` auf potenzielle Schwachstellen wie Injektionsangriffe, unzureichende Eingabevalidierung oder Offenlegung sensibler Informationen. Empfehlung zur Implementierung von Authentifizierungs- oder Filtermechanismen direkt im Worker, falls möglich.
    2.  **End-to-End-Tests**: Überprüfung, ob die Weiterleitung von Anfragen korrekt und sicher erfolgt und keine unerwarteten Informationen offengelegt werden.

### 3.2 API-Gateway (Kong API Gateway)

*   **Prüfziel**: Behebung der kritischen Sicherheitsrisiken im Zusammenhang mit dem Kong API Gateway.
*   **Validierungsschritte**:
    1.  **Absicherung des Admin-Endpunkts**: **Dringende Empfehlung**: Der unverschlüsselte Admin-Endpunkt (`http://kong-admin-api:8001`) [8] muss umgehend abgesichert werden. Dies beinhaltet:
        *   **Implementierung von HTTPS**: Erzwingen einer verschlüsselten Kommunikation für den Admin-Zugriff.
        *   **Authentifizierung und Autorisierung**: Implementierung robuster Authentifizierungsmechanismen (z.B. API-Keys, OAuth, mTLS) und feingranularer Autorisierungsregeln für den Admin-Zugriff.
        *   **Netzwerksegmentierung**: Beschränkung des Zugriffs auf den Admin-Endpunkt auf vertrauenswürdige Netzwerke oder IP-Adressen.
    2.  **Konfigurations-Audit**: Überprüfung des `configure_gateway.sh` [8] und der resultierenden Kong-Konfiguration auf weitere Sicherheitslücken, wie z.B. fehlende TLS-Einstellungen für die exponierten Dienste, unzureichende Ratenbegrenzung oder fehlende ACLs.
    3.  **Penetrationstests**: Durchführung von Penetrationstests auf das Kong API Gateway, um potenzielle Angriffsvektoren zu identifizieren und auszunutzen.

## 4. Validierung der Peer-to-Peer Institutionellen Verbindungen

Die Validierung der P2P-Verbindungen konzentriert sich auf die Schließung der kritischen Implementierungslücke des `ImmunitySeal`.

### 4.1 `ImmunitySeal`-Verifizierung

*   **Prüfziel**: Implementierung und Validierung des kryptografischen Abgleichs des `ImmunitySeal` [9].
*   **Validierungsschritte**:
    1.  **Implementierung des `ImmunitySeal`**: **Dringende Empfehlung**: Die Platzhalter-Implementierung (`return true`) [9] muss durch eine tatsächliche kryptografische Verifizierung ersetzt werden. Dies beinhaltet:
        *   **Definition des "First State Ledger"**: Klärung, wie das "First State Ledger" aufgebaut ist und welche kryptografischen Signaturen oder Zertifikate es enthält.
        *   **Kryptografische Prüfung**: Implementierung der Logik zum Abgleich des `ImmunitySeal` des Peer-Knotens mit den Einträgen im "First State Ledger" unter Verwendung etablierter kryptografischer Verfahren (z.B. digitale Signaturen, Public-Key-Infrastruktur).
    2.  **Interoperabilitätstests**: Testen der P2P-Verbindung mit verschiedenen "souveränen" Knoten, die gültige und ungültige `ImmunitySeals` präsentieren, um die korrekte Funktion der Verifizierung und der Sicherheitsisolation zu gewährleisten.
    3.  **Resilienztests**: Überprüfung des Verhaltens der P2P-Verbindung bei Netzwerkstörungen oder Angriffen auf die `ImmunitySeal`-Verifizierung.

## 5. Kontinuierliche Validierung und Überwachung

Zusätzlich zu den oben genannten spezifischen Validierungsschritten ist eine kontinuierliche Validierung und Überwachung unerlässlich, um die langfristige Sicherheit und Konformität der PNIA-Core Suite Connections zu gewährleisten.

*   **Automatisierte Tests**: Implementierung von Unit-, Integrations- und End-to-End-Tests in der CI/CD-Pipeline, um die Funktionalität und Sicherheit der Verbindungen bei jeder Codeänderung zu überprüfen.
*   **Sicherheitsaudits und Penetrationstests**: Regelmäßige Durchführung externer Sicherheitsaudits und Penetrationstests durch unabhängige Dritte.
*   **Monitoring und Alerting**: Implementierung eines robusten Monitoring-Systems, das ungewöhnliche Aktivitäten, Fehlermeldungen oder Sicherheitsvorfälle in den Verbindungskanälen erkennt und entsprechende Alerts auslöst.
*   **Incident Response Plan**: Entwicklung und regelmäßige Überprüfung eines Incident Response Plans für den Fall von Sicherheitsvorfällen.

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
