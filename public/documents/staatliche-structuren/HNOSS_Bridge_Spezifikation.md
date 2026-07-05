# HNOSS / MCCI Bridge-Spezifikation

**Version:** 1.0  
**Datum:** 2026-06-29  
**Kontext:** Schnittstellen- und Gateway-Dokumentation für den kontrollierten Übergang zwischen MCCI-Mesh-Knoten und externen Partnerdomänen (EU, NATO, Behörden, Internet of Science, Finanzmärkte).

---

## 1. Zweck und Scope

Die HNOSS Bridge ist ein **kontrollierter, auditierbarer Gateway** zwischen Sicherheitsdomänen. Sie ermöglicht den Datenaustausch zwischen:

- **Interner MCCI-Domäne** (hohes Vertrauensniveau, private Mesh-Knoten)
- **Partnerdomänen** (EU-Institutionen, NATO, Internet of Science, vertraglich gebundene Forschungseinrichtungen)
- **Öffentlichen Infrastrukturen** (EUIPO, EPO, Behördenportale, Clearing-Stellen)

Die Bridge arbeitet nach dem Prinzip **„Default-Deny + Whitelisting“** – jede Transaktion bedarf einer expliziten, protokollierten Freigabe.

---

## 2. Architekturkomponenten

| Komponente | Identifier | Funktion |
|---|---|---|
| **Ingress Gateway** | `hnoss-bridge-ingress` | Annahme und Terminierung eingehender Verbindungen; TLS/mTLS; DoS-Protection |
| **Egress Gateway** | `hnoss-bridge-egress` | Ausgehende Verbindungen; Policy-Enforcement; Rate-Limiting |
| **Policy Decision Point (PDP)** | `hnoss-pdp` | Zentrale Entscheidungsinstanz für Zugriff, Datenklassen und Operationen |
| **Policy Enforcement Point (PEP)** | `hnoss-pep` | Technische Durchsetzung der PDP-Entscheidungen an Ingress/Egress |
| **Identity & Trust Service** | `hnoss-its` | Verwaltung von Identitäten, Zertifikaten, Trust Anchors |
| **Sanitization Layer** | `hnoss-sanitizer` | Formatvalidierung, Schema-Prüfung, Pseudonymisierung/Anonymisierung |
| **Audit Bridge Logger** | `hnoss-audit-log` | Unveränderliche Protokollierung aller Transaktionen |
| **Mesh Node Connector** | `hnoss-mesh-connector` | Verbindung zum internen MCCI-Mesh |

---

## 3. Datenflussdiagramm

```
Externe Domäne
       │
       ▼
┌─────────────────────┐
│  Ingress Gateway    │ ← TLS/mTLS, Auth, DDoS-Protection
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  PEP (Ingress)      │ ← Policy-Prüfung
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  Policy Decision    │ ← Whitelisting (Identity, Data, Operation, Geo)
│  Point (PDP)        │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  Sanitization Layer │ ← Schema, Integrität, Klassifizierung
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  Audit Bridge Logger│ ← Hash, Signatur, Timestamp
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  Mesh Node Connector│ ← Interne Zustellung
└─────────────────────┘
       │
       ▼
   MCCI-Mesh
```

---

## 4. Schnittstellen-API

### 4.1 Endpunkte

| Methode | Pfad | Zweck | Authentifizierung |
|---|---|---|---|
| `POST` | `/v1/bridge/transfer` | Einzelne Datenübertragung | mTLS + JWT |
| `POST` | `/v1/bridge/batch` | Batch-Übertragung | mTLS + JWT |
| `GET`  | `/v1/bridge/status/{txId}` | Statusabfrage einer Transaktion | mTLS + JWT |
| `POST` | `/v1/bridge/whitelist/apply` | Whitelist-Eintrag aktivieren | mTLS + JWT + Admin-Role |
| `GET`  | `/v1/bridge/whitelist/check` | Whitelist-Prüfung | mTLS + JWT |
| `POST` | `/v1/bridge/audit/query` | Audit-Log-Abfrage | mTLS + JWT + Auditor-Role |

### 4.2 Request-Schema (POST /v1/bridge/transfer)

```json
{
  "metadata": {
    "txId": "uuid-v4",
    "sourceDomain": "mcci-internal",
    "targetDomain": "eu-commission",
    "initiator": "user-or-service-id",
    "initiatorRole": "bridge-operator",
    "timestamp": "2026-06-29T00:00:00Z",
    "policyRef": "POL-2026-001",
    "dataClassification": "RESTRICTED"
  },
  "payload": {
    "schema": "eu-grant-report-v2",
    "format": "JSON",
    "contentHash": "sha256:...",
    "signature": "ecdsa:...",
    "data": "<base64-encoded-payload>"
  },
  "whitelists": {
    "identity": ["id:service-eu-001"],
    "data": ["resource:grant-report-2026"],
    "operation": ["op:transfer-read"],
    "geo": ["jurisdiction:EU"]
  }
}
```

### 4.3 Response-Schema

```json
{
  "txId": "uuid-v4",
  "status": "ACCEPTED | REJECTED | PENDING",
  "decision": {
    "pdp": "ALLOW",
    "pep": "ENFORCED",
    "policyRef": "POL-2026-001"
  },
  "auditRef": "audit-sha256:...",
  "timestamp": "2026-06-29T00:00:01Z",
  "message": "Transfer accepted and logged."
}
```

---

## 5. Authentifizierung und Vertrauensmodell

| Schicht | Mechanismus | Trust Anchor |
|---|---|---|
| Transport | TLS 1.3 / mTLS | MCCI-eigene PKI + externe Trust Anchors (EU, NATO) |
| Identität | JWT + X.509-Zertifikat | Identity Provider (eIDAS-kompatibel) |
| Nachricht | ECDSA/RSA-Signaturen | HSM-geschützte Schlüssel der Quelldomäne |
| Daten | SHA-256 Content-Hash | Blockchain-ähnliche Hash-Kette für Audit-Logs |

---

## 6. Policy-Regeln (Beispiele)

| Regel-ID | Beschreibung | Auswirkung |
|---|---|---|
| `POL-001` | Nur identitäts-whitelistete Dienste dürfen an die Bridge | Default-Deny |
| `POL-002` | Daten der Klasse `TOP SECRET` dürfen nicht in öffentliche Domänen | Block |
| `POL-003` | Batch-Transfers > 10.000 Datensätze erfordern Dual-Control | PENDING |
| `POL-004` | Transfers außerhalb der EU erfordern geo-Whitelist + DSB-Freigabe | PENDING |
| `POL-005` | Jede Transaktion muss signiert und audit-logged sein | Enforce |
| `POL-006` | Privilegierte Aktionen (Whitelist-Änderung) erfordern 4-Augen-Prinzip | Enforce |

---

## 7. Fehlercodes und Status

| Code | Bedeutung | Maßnahme |
|---|---|---|
| `200` | OK | Transaktion akzeptiert |
| `400` | Bad Request | Schema- oder Formatfehler |
| `401` | Unauthorized | Authentifizierung fehlgeschlagen |
| `403` | Forbidden | Policy-Regel verweigert Zugriff |
| `409` | Conflict | Transaktions-ID existiert bereits |
| `429` | Too Many Requests | Rate-Limit überschritten |
| `500` | Internal Error | Bridge-Operator + SOC informieren |
| `503` | Service Unavailable | Bridge-Modus auf Quarantäne |

---

## 8. Betriebsmodi

| Modus | Beschreibung | Verwendung |
|---|---|---|
| **Normal** | Standard-Whitelisting und Logging | Produktivbetrieb |
| **Quarantäne** | Alle Transaktionen PENDING, manuelle Freigabe | Sicherheitsvorfall |
| **Read-Only** | Keine ausgehenden Transfers, Audit-Abfragen erlaubt | Wartung / Audit |
| **Fail-Closed** | Bridge blockiert alle Verbindungen | Kritischer Vorfall |

---

## 9. Integrationsbeispiele

| Externe Domäne | Protokoll | Policy-Set | Besonderheit |
|---|---|---|---|
| EU-Kommission (Grant API) | REST / OAuth 2.0 / mTLS | `EU-GRANT-v2` | Projektberichte, Finanzdaten |
| NATO Secure Gateway | NATO STANAG / IPsec | `NATO-CONF-v3` | Verschlusssachen nur bis NATO-Restricted |
| Internet of Science | gRPC / QUIC | `IOS-RESEARCH-v1` | Forschungsdaten, Peer-Review-Metadaten |
| Deutsche Börse (T7/ETI) | ETI / FIX | `T7-MARKET-v1` | Marktdaten, Clearing-Informationen |
| EUIPO / EPO | SOAP / REST / eIDAS | `EUIPO-LEGAL-v1` | Rechtliche Hinterlegungen, Vertragsdaten |
| Nationale Behörden | REST / eIDAS | `GOV-DE-v2` | Melde- und Genehmigungsdaten |

---

## 10. Nicht-funktionale Anforderungen

| Anforderung | Zielwert |
|---|---|
| Verfügbarkeit | 99.99 % (geplant) |
| Latenz | < 200 ms für einzelne Transaktionen |
| Durchsatz | > 10.000 Transaktionen/Minute |
| Audit-Log-Speicherung | Append-only, repliziert, 7–10 Jahre |
| Recovery Time Objective (RTO) | < 15 Minuten |
| Recovery Point Objective (RPO) | 0 (synchrone Replikation) |

---

## 11. Sicherheitskontrollen

| Kontrolle | Umsetzung |
|---|---|
| Input Validation | Schema-Prüfung, Größenlimits, Zeichensatz |
| Content Inspection | Virenscan, DLP-Klassifizierung, Datenmaskierung |
| Non-Repudiation | Digitale Signaturen, Timestamps, Hash-Kette |
| Rate Limiting | Quotas pro Domäne, User, Operation |
| Segmentation | Netzwerk-Whitelisting, VLANs, Zero-Trust |
| Monitoring | SIEM-Integration, Real-Time Alerts |
| Backup & Recovery | Redundante Bridge-Cluster, georedundante Logs |

---

**Nächste Schritte:** Definition der konkreten Datenfelder im Audit-Log (siehe `HNOSS_Audit_Log_Datenstruktur.md`).
