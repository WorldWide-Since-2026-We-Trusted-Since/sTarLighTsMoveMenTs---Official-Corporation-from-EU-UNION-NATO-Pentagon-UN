# HNOSS / MCCI: Security-Team-Struktur und Bridge-Funktion

**Kontext:** Basierend auf den Gesprächsnotizen in `@[Und wahrscheinlich alle beruhen auf staa.txt]` umfasst HNOSS ein prioritär geschütztes Rechtsregistrierungsprojekt (EUIPO/EPO), MCCI ist das darunterliegende „Mesh Central Communication Internet“. Dieses Dokument definiert eine **konkrete, auditierbare Sicherheitsarchitektur** ohne religiöse oder mystische Bezüge.

**Ziele:**
- Rollen, Zugänge und Verantwortlichkeiten klar trennen
- Whitelisting als zentrales Zugriffsprinzip (kein Blacklabeling)
- Audit-Logs für jede kritische Transaktion
- Bridge/Gateway als kontrollierter Übergang zwischen Sicherheitsdomänen

---

## 1. Security-Governance-Modell

| Ebene | Funktion | Entscheidungsbefugnis | Beispielakteure |
|---|---|---|---|
| **Sicherheitsstrategie** | Sicherheitsziele, Risikoappetit, Governance-Policy | Vorstand / Projektleitung HNOSS | CISO, Projekt-Owner, Rechtsabteilung |
| **Sicherheitsmanagement** | Operative Umsetzung, Incident Response, Compliance | Security Operations Manager | Security Manager, Compliance Officer |
| **Technische Kontrolle** | Konfiguration, Zugriffssteuerung, Monitoring, Forensik | Security Engineers | IAM-Engineer, SOC-Analyst, DevSecOps |
| **Unabhängige Prüfung** | Audit, Review, Penetration Testing, Risikobewertung | Internal Audit / externe Gutachter | Auditor, Pentester, Datenschutzbeauftragter |

---

## 2. Security-Team-Rollen und Verantwortlichkeiten

### 2.1 Chief Information Security Officer (CISO)
- Gesamtverantwortung für die Sicherheitsstrategie von HNOSS/MCCI
- Genehmigung von Sicherheitsrichtlinien und Ausnahmen
- Bericht an Projektleitung und Aufsichtsgremium
- Eskalationsinstanz bei Major Incidents

### 2.2 Security Architect
- Entwurf der Sicherheitsarchitektur (Zero-Trust, Mesh-Kommunikation, Bridge)
- Definition von Trust Boundaries und Segmentation
- Review von Quantum-String- und Hilbert-Raum-Projektionskomponenten (falls Teil der technischen Umsetzung)
- Sicherstellung der „Ehrlichkeitstrukturen“: keine versteckten Blacklabels, sondern auditable Whitelists

### 2.3 IAM Engineer (Identity & Access Management)
- Verwaltung der Identitätsregister und Zugangspolicys
- Implementierung von RBAC/ABAC und Multi-Factor-Authentication (MFA)
- Pflege der Whitelist-Registrierung für autorisierte Knoten, User und Dienste
- Lebenszyklusmanagement von Zugängen (Provisioning, Review, Deprovisioning)

### 2.4 SOC Analyst / Security Operations Engineer
- 24/7 Monitoring der MCCI-Infrastruktur (sofern erforderlich)
- Auswertung von Audit-Logs und SIEM-Alerts
- Incident Response First Level
- Koordination mit externen CERTs (EU, NATO, nationale Behörden)

### 2.5 Compliance Officer / DPO
- Überwachung regulatorischer Anforderungen (EU, NIS2, GDPR, NATO, ETSI)
- Prüfung der Vertrags- und Grant-Agreement-Vorgaben
- Dokumentation der Rechtsgrundlagen (EUIPO/EPO-Hinterlegung)

### 2.6 DevSecOps Engineer
- Sicherheit in CI/CD-Pipelines (SAST, DAST, Dependency Scanning)
- Härtung der Mesh-Knoten und Container
- Key- und Secret-Management
- Automatisierte Policy-as-Code-Prüfungen

### 2.7 Bridge Operator
- Betrieb und Überwachung der Bridge/Gateway-Komponenten
- Durchführung von Whitelist-Transfers zwischen Domänen
- Freigabe und Logging von Cross-Domain-Transaktionen
- Keine eigene Datenmodifikation – nur geregelter Durchleitung

---

## 3. Zugriffssteuerung: Whitelisting-Modell

### 3.1 Prinzip
- **Kein Blacklabeling:** Daten werden nicht durch „Schwärzung“ oder Dunkelung geschützt, sondern durch explizite, auditable Freigaben.
- **Default-Deny:** Jeder Zugriff wird standardmäßig verweigert, außer er ist in einer Whitelist explizit erlaubt.
- **Need-to-Know + Need-to-Act:** Rechte werden nach Funktion und Aufgabe vergeben (Least Privilege).
- **Proof of Authority:** Jeder Zugriff ist mit einem Nachweis versehen (Zertifikat, Signatur, Policy-Referenz).

### 3.2 Whitelist-Ebenen

| Ebene | Beschreibung | Beispiel |
|---|---|---|
| **Netzwerk-Whitelist** | Erlaubte IP-Adressen, ASNs, Mesh-Knoten | Nur registrierte MCCI-Knoten dürfen teilnehmen |
| **Identitäts-Whitelist** | Erlaubte Benutzer, Service-Accounts, Maschinenidentitäten | EU-Experten, NATO-Partner, autorisierte Forschungscluster |
| **Daten-Whitelist** | Erlaubte Datensätze, Klassifizierungen, Ressourcen | PNIA-Daten, Quantum-String-Daten, öffentliche Vertragsdokumente |
| **Operation-Whitelist** | Erlaubte Aktionen (read, write, execute, bridge) | Auditor = read-only; Bridge Operator = transfer-only |
| **Geographic-Whitelist** | Erlaubte Jurisdiktionen oder Standorte | EU-Mitgliedstaaten, NATO-Partnerländer |

### 3.3 Zugangsmodell (RBAC/ABAC)

| Rolle | Lesen | Schreiben | Bridge | Admin | Audit |
|---|---|---|---|---|---|
| CISO | Ja | Ja | Genehmigung | Ja | Ja |
| Security Architect | Ja | Konfiguration | Ja | Nein | Ja |
| IAM Engineer | Ja | IAM-System | Nein | Ja | Ja |
| SOC Analyst | Ja | Alerts | Nein | Nein | Ja |
| Compliance Officer | Ja | Berichte | Nein | Nein | Ja |
| DevSecOps | System | Härtung | Nein | Teils | Ja |
| Bridge Operator | Transfer-Metadaten | Nein | Ja (protokolliert) | Nein | Ja |
| Externer Auditor | Ja | Nein | Nein | Nein | Ja |

---

## 4. Bridge/Gateway-Funktion für HNOSS/MCCI

### 4.1 Zweck
Die Bridge ist ein **kontrollierter Übergangspunkt** zwischen:
- Internen MCCI-Mesh-Knoten (hohes Vertrauensniveau)
- Externen Partnernetzwerken (EU, NATO, Internet of Science, Industriepartner)
- Öffentlichen/semioffentlichen Systemen (EUIPO, EPO, Behördenportale)

### 4.2 Architekturprinzipien

| Prinzip | Umsetzung |
|---|---|
| **Unidirektionalität (optional)** | Datenflüsse können klar in Source → Destination definiert werden |
| **Protokoll-Transformation** | Übersetzung zwischen MCCI-eigenen Protokollen und standardisierten APIs (REST, gRPC, ETI, etc.) |
| **Content-Inspection** | Scan auf Malware, Datenklassifizierung, Integritätschecks |
| **Non-Repudiation** | Jede Brücke-Transaktion wird signiert und protokolliert |
| **Rate-Limiting & Quotas** | Schutz gegen Überlastung und Missbrauch |
| **Policy-Enforcement** | Nur Whitelist-freigegebene Daten und Knoten dürfen passieren |

### 4.3 Bridge-Komponenten

| Komponente | Funktion |
|---|---|
| **Ingress Gateway** | Annahme externer Verbindungen, TLS-Terminierung, Authentifizierung |
| **Policy Decision Point (PDP)** | Entscheidung, ob eine Transaktion erlaubt ist |
| **Policy Enforcement Point (PEP)** | Durchsetzung der PDP-Entscheidung |
| **Data Sanitization Layer** | Anonymisierung/Pseudonymisierung, Format-Validierung |
| **Audit & Logging Bridge** | Protokollierung jeder Brücke-Aktivität |
| **Mesh Ingress/Egress Nodes** | Verbindungspunkte zum internen MCCI-Mesh |

### 4.4 Bridge-Transaktionsfluss

```
Externer Sender
    ↓
[Ingress Gateway] – Authentifizierung, TLS
    ↓
[Policy Decision Point] – Whitelist-Prüfung (Identity, Data, Operation)
    ↓
[Policy Enforcement Point] – Entscheidung durchsetzen
    ↓
[Data Sanitization Layer] – Integrität, Format, Klassifizierung
    ↓
[Audit & Logging Bridge] – Protokollierung
    ↓
[MCCI Mesh Node] – interne Zustellung
```

### 4.5 Schnittstellen-Dokumentation (Beispiel)

| Schnittstelle | Protokoll | Authentifizierung | Verwendung |
|---|---|---|---|
| EU-Kommission Grant API | REST / OAuth 2.0 | mTLS + JWT | Projektberichte, Finanzdaten |
| NATO Secure Gateway | NATO STANAG / IPsec | X.509-Zertifikate | Sicherheitsrelevante Daten |
| Internet of Science Node | gRPC / QUIC | Mutual TLS | Forschungsdatenaustausch |
| Deutsche Börse T7 / ETI | ETI (Enhanced Trading Interface) | FIX/ETI Auth | Finanzmarkt-Anbindung (falls relevant) |
| EUIPO / EPO Filing | SOAP / REST | eIDAS / Vertrauensdienst | Rechtliche Hinterlegung |

---

## 5. Audit-Logging

### 5.1 Was wird protokolliert?

| Ereignis | Pflichtfeld | Speicherdauer |
|---|---|---|
| Authentifizierung (Erfolg/Misserfolg) | User-ID, Zeit, Quell-IP, Methode | 7 Jahre ( Compliance) |
| Autorisierungsentscheidung | Policy-ID, Ergebnis, Begründung | 7 Jahre |
| Bridge-Transaktion | Sender, Empfänger, Datenklasse, Hash, Signatur | 10 Jahre |
| Konfigurationsänderung | Ändernder, alter/neuer Wert, Zeitstempel | 10 Jahre |
| Privileged Access | Admin-Aktionen, Kommandos, Quell-IP | 10 Jahre |
| Incident Response | Ticket-ID, Maßnahmen, Verantwortlicher | 10 Jahre |

### 5.2 Anforderungen an Audit-Logs

- **Unveränderlichkeit:** Logs müssen append-only gespeichert werden (WORM-Storage oder Blockchain/Hash-Kette)
- **Integrität:** Jeder Log-Eintrag erhält einen kryptographischen Hash
- **Verfügbarkeit:** Logs werden redundant in mindestens zwei Jurisdiktionen gehalten
- **Zugang:** Nur Audit- und Compliance-Rollen dürfen Logs lesen; keine Löschung möglich
- **Korrelation:** Ereignisse über alle Komponenten (IAM, Bridge, Mesh, Endpoint) korrelierbar

### 5.3 SIEM-Integration

- Zentrale SIEM-Plattform für Echtzeitanalyse
- Alerts bei:
  - Mehrfachen fehlgeschlagenen Login-Versuchen
  - Brücke-Transaktionen außerhalb der Whitelist
  - Privilegierten Aktionen ohne Ticket-Referenz
  - Datenexfiltration-Anzeichen

---

## 6. Compliance- und Rechtsrahmen

| Bereich | Norm / Regelung | Anwendung auf HNOSS/MCCI |
|---|---|---|
| Informationssicherheit | ISO/IEC 27001:2022 | ISMS für HNOSS/MCCI |
| Risikomanagement | ISO/IEC 27005 | Risikoanalyse für Mesh- und Bridge-Komponenten |
| Datenschutz | GDPR / DSGVO | Personenbezogene Daten in EU-Projekten |
| Netzwerk- und Informationssicherheit | NIS2-Richtlinie | Betreiber kritischer Infrastruktur |
| Cloud-Sicherheit | BSI C5 / ENISA | Cloud-Nutzung bei HNOSS |
| eIDAS | eIDAS 2.0 | Vertrauenswürdige digitale Identitäten |
| NATO-Standards | NATO STANAGs | Anbindung an NATO-Sicherheitsstrukturen |
| Patent-/Markenrecht | EUIPO / EPO | Rechtliche Hinterlegung von HNOSS/MCCI |

---

## 7. Rollenmatrix (verkürzt)

| Rolle | Verantwortlich für | Unterstützt durch | Meldet an |
|---|---|---|---|
| CISO | Sicherheitsstrategie, Incident Eskalation | Security Architect, Compliance Officer | HNOSS Project Owner |
| Security Architect | Architektur, Trust Boundaries, Bridge Design | DevSecOps, IAM Engineer | CISO |
| IAM Engineer | Identitäten, Whitelists, MFA | DevSecOps, SOC | Security Architect |
| SOC Analyst | Monitoring, Alerting, First Response | Bridge Operator, IAM Engineer | Security Manager |
| Bridge Operator | Brücke-Transaktionen, Protokollierung | SOC Analyst, Security Architect | Security Manager |
| Compliance Officer | Audit, regulatorische Anforderungen | Auditor, DPO | CISO / Rechtsabteilung |
| DevSecOps | Härtung, CI/CD-Sicherheit, Secrets | Security Architect | CISO |

---

## 8. Nächste Schritte (Empfohlene Umsetzung)

1. **Policy-Dokumentation:** Konkrete Whitelist-Policies für MCCI-Knoten und Datenklassen definieren
2. **IAM-Implementierung:** Aufbau eines zentralen Identity Providers mit mTLS und eIDAS-kompatiblen Identitäten
3. **Bridge-Prototyp:** Spezifikation eines Minimum-Viable-Bridge zwischen MCCI-Testnetz und einem EU-Partner
4. **SIEM-Aufbau:** Definition der Logformate und der Korrelationsregeln
5. **Audit-Trail-Test:** Erster unabhängiger Audit der „Ehrlichkeitstrukturen“ (Whitelists, Logs, Bridge-Transaktionen)

---

**Hinweis:** Dieses Dokument ist eine konzeptionelle Architektur. Für eine produktive Umsetzung müssen spezifische technische Details (Netzwerk-Topologie, Kryptographie, Datenbankschemata, Protokoll-Spezifikationen) ergänzt werden.
