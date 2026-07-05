# HNOSS / MCCI Audit-Log-Datenstruktur

**Version:** 1.0  
**Datum:** 2026-06-29  
**Kontext:** Standardisiertes Format für die unveränderliche Protokollierung aller sicherheitsrelevanten Ereignisse in HNOSS/MCCI, insbesondere für Authentifizierung, Autorisierung, Bridge-Transaktionen und Konfigurationsänderungen.

---

## 1. Designprinzipien

| Prinzip | Umsetzung |
|---|---|
| **Unveränderlichkeit** | Append-only Speicherung; Löschung technisch unmöglich |
| **Integrität** | Jeder Eintrag mit SHA-256-Hash und ECDSA-Signatur gesichert |
| **Korrelation** | Jede Transaktion erhält eine eindeutige `txId` und `sessionId` |
| **Zeitstempel** | UTC-Zeitstempel mit Millisekundenpräzision |
| **Minimaler Informationsgehalt** | Nur Daten, die für Audit und Forensik nötig sind |
| **Standardisierung** | JSON-Schema, maschinenlesbar, SIEM-kompatibel |

---

## 2. JSON-Schema (JSON Schema Draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://hnoss.mcci.local/schemas/audit-log-v1.json",
  "title": "HNOSS Audit Log Entry",
  "type": "object",
  "required": [
    "logId",
    "timestamp",
    "eventType",
    "severity",
    "actor",
    "resource",
    "action",
    "result",
    "sourceIp",
    "domain",
    "integrity"
  ],
  "properties": {
    "logId": { "type": "string", "format": "uuid" },
    "timestamp": { "type": "string", "format": "date-time" },
    "eventType": { "type": "string", "enum": ["AUTHENTICATION", "AUTHORIZATION", "BRIDGE_TRANSFER", "CONFIG_CHANGE", "PRIVILEGED_ACCESS", "INCIDENT", "WHITELIST_CHANGE", "DATA_ACCESS", "SYSTEM_EVENT"] },
    "severity": { "type": "string", "enum": ["DEBUG", "INFO", "NOTICE", "WARNING", "ERROR", "CRITICAL", "ALERT", "EMERGENCY"] },
    "actor": {
      "type": "object",
      "required": ["type", "id", "role"],
      "properties": {
        "type": { "type": "string", "enum": ["USER", "SERVICE", "SYSTEM", "ADMIN"] },
        "id": { "type": "string" },
        "role": { "type": "string" },
        "certFingerprint": { "type": "string" },
        "jwtIssuer": { "type": "string" }
      }
    },
    "resource": {
      "type": "object",
      "required": ["type", "id"],
      "properties": {
        "type": { "type": "string", "enum": ["DATA", "SERVICE", "NODE", "POLICY", "CONFIG", "KEY", "CERTIFICATE"] },
        "id": { "type": "string" },
        "classification": { "type": "string", "enum": ["PUBLIC", "INTERNAL", "RESTRICTED", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] },
        "domain": { "type": "string" }
      }
    },
    "action": { "type": "string", "examples": ["login", "logout", "transfer", "read", "write", "delete", "approve", "reject", "modify", "create"] },
    "result": { "type": "string", "enum": ["SUCCESS", "FAILURE", "PENDING", "DENIED", "ERROR", "TIMEOUT"] },
    "sourceIp": { "type": "string", "format": "ipv4" },
    "domain": { "type": "string" },
    "txId": { "type": "string", "format": "uuid" },
    "sessionId": { "type": "string" },
    "policyRef": { "type": "string" },
    "reason": { "type": "string" },
    "previousValueHash": { "type": "string" },
    "newValueHash": { "type": "string" },
    "integrity": {
      "type": "object",
      "required": ["hash", "algorithm", "signature", "previousLogHash"],
      "properties": {
        "hash": { "type": "string" },
        "algorithm": { "type": "string", "enum": ["SHA-256", "SHA-3-256"] },
        "signature": { "type": "string" },
        "signatureAlgorithm": { "type": "string", "enum": ["ECDSA-P256", "RSA-PSS-4096", "Ed25519"] },
        "previousLogHash": { "type": "string" },
        "logChainIndex": { "type": "integer" }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "userAgent": { "type": "string" },
        "deviceId": { "type": "string" },
        "geoLocation": { "type": "string" },
        "mfaMethod": { "type": "string" },
        "requestDurationMs": { "type": "integer" },
        "complianceTag": { "type": "string" }
      }
    }
  }
}
```

---

## 3. Pflichtfelder (Required Fields)

| Feld | Beschreibung | Beispiel |
|---|---|---|
| `logId` | UUID des Log-Eintrags | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `timestamp` | Ereigniszeit in UTC | `2026-06-29T00:15:30.123Z` |
| `eventType` | Kategorie des Ereignisses | `BRIDGE_TRANSFER` |
| `severity` | Schweregrad | `INFO` |
| `actor` | Wer hat die Aktion ausgelöst | User, Service, System |
| `resource` | Was wurde betroffen | Daten, Service, Policy |
| `action` | Was wurde getan | `transfer`, `read`, `approve` |
| `result` | Ergebnis | `SUCCESS`, `DENIED` |
| `sourceIp` | Quell-IP | `10.0.0.42` |
| `domain` | Sicherheitsdomäne | `mcci-internal`, `eu-commission` |
| `integrity` | Hash, Signatur, Kettenglied | SHA-256 + ECDSA |

---

## 4. Optionale / kontextabhängige Felder

| Feld | Verwendung |
|---|---|
| `txId` | Korrelation mehrerer Log-Einträge zu einer Transaktion |
| `sessionId` | Korrelation während einer Benutzersession |
| `policyRef` | Verweis auf die angewandte Sicherheitsrichtlinie |
| `reason` | Begründung bei Ablehnung oder Ausnahme |
| `previousValueHash` / `newValueHash` | Für Konfigurationsänderungen |
| `complianceTag` | Z. B. `GDPR`, `NIS2`, `EUIPO`, `NATO` |
| `mfaMethod` | `TOTP`, `FIDO2`, `mTLS`, `SmartCard` |
| `requestDurationMs` | Performance- und Latenz-Tracking |

---

## 5. Beispiel-Log-Einträge

### 5.1 Authentifizierung (erfolgreich)

```json
{
  "logId": "uuid-001",
  "timestamp": "2026-06-29T00:15:30.123Z",
  "eventType": "AUTHENTICATION",
  "severity": "INFO",
  "actor": {
    "type": "USER",
    "id": "user.d.pohl",
    "role": "bridge-operator",
    "certFingerprint": "sha256:abc123..."
  },
  "resource": {
    "type": "SERVICE",
    "id": "hnoss-bridge-ingress"
  },
  "action": "login",
  "result": "SUCCESS",
  "sourceIp": "10.0.0.42",
  "domain": "mcci-internal",
  "sessionId": "sess-98765",
  "metadata": {
    "mfaMethod": "FIDO2",
    "geoLocation": "DE"
  },
  "integrity": {
    "hash": "sha256:loghash001",
    "algorithm": "SHA-256",
    "signature": "ecdsa:sig001",
    "signatureAlgorithm": "ECDSA-P256",
    "previousLogHash": "sha256:genesis",
    "logChainIndex": 1
  }
}
```

### 5.2 Bridge-Transaktion (erfolgreich)

```json
{
  "logId": "uuid-002",
  "timestamp": "2026-06-29T00:15:31.456Z",
  "eventType": "BRIDGE_TRANSFER",
  "severity": "INFO",
  "actor": {
    "type": "SERVICE",
    "id": "service-eu-001",
    "role": "eu-reporting"
  },
  "resource": {
    "type": "DATA",
    "id": "grant-report-2026-q2",
    "classification": "RESTRICTED",
    "domain": "eu-commission"
  },
  "action": "transfer",
  "result": "SUCCESS",
  "sourceIp": "192.168.10.5",
  "domain": "eu-commission",
  "txId": "tx-uuid-777",
  "policyRef": "POL-2026-001",
  "metadata": {
    "requestDurationMs": 145,
    "complianceTag": "EUIPO"
  },
  "integrity": {
    "hash": "sha256:loghash002",
    "algorithm": "SHA-256",
    "signature": "ecdsa:sig002",
    "signatureAlgorithm": "ECDSA-P256",
    "previousLogHash": "sha256:loghash001",
    "logChainIndex": 2
  }
}
```

### 5.3 Autorisierung verweigert

```json
{
  "logId": "uuid-003",
  "timestamp": "2026-06-29T00:16:00.789Z",
  "eventType": "AUTHORIZATION",
  "severity": "WARNING",
  "actor": {
    "type": "USER",
    "id": "user.unknown",
    "role": "guest"
  },
  "resource": {
    "type": "DATA",
    "id": "top-secret-blueprint",
    "classification": "TOP_SECRET"
  },
  "action": "read",
  "result": "DENIED",
  "sourceIp": "203.0.113.45",
  "domain": "external-unknown",
  "policyRef": "POL-002",
  "reason": "Data classification TOP_SECRET not allowed for target domain.",
  "integrity": {
    "hash": "sha256:loghash003",
    "algorithm": "SHA-256",
    "signature": "ecdsa:sig003",
    "signatureAlgorithm": "ECDSA-P256",
    "previousLogHash": "sha256:loghash002",
    "logChainIndex": 3
  }
}
```

---

## 6. Log-Lebenszyklus und Speicherung

| Phase | Anforderung |
|---|---|
| **Erzeugung** | Synchron beim Ereignis, keine Batching-Verzögerung > 1 s |
| **Signierung** | Innerhalb von 100 ms nach Erzeugung |
| **Replikation** | Mindestens 3 geografisch getrennte Speicherorte |
| **Aufbewahrung** | 7–10 Jahre je nach Compliance-Tag |
| **Löschung** | Technisch nicht möglich (WORM-Storage) |
| **Export** | Nur für Audit-Rollen, verschlüsselt, mit Wasserzeichen |

---

## 7. SIEM-Integration

| Feld | SIEM-Nutzung |
|---|---|
| `eventType` | Kategorisierung und Dashboard |
| `severity` | Alert-Routing (P1–P4) |
| `actor.id` | User-Behavior-Analytics |
| `resource.classification` | DLP- und Exfiltrations-Regeln |
| `result` | Failed-Access-Detection |
| `sourceIp` | Geo-IP-Analyse, Threat-Intelligence |
| `policyRef` | Compliance-Reporting |
| `integrity.logChainIndex` | Konsistenzprüfung der Log-Kette |

---

## 8. Compliance-Zuordnung

| Compliance-Bereich | Audit-Log-Anforderung |
|---|---|
| ISO/IEC 27001:2022 | A.8.15, A.8.16 (Logging, Monitoring) |
| NIS2 | Melde- und Protokollierungspflichten |
| GDPR / DSGVO | Art. 32 (Sicherheit der Verarbeitung), Zugriffsprotokolle |
| eIDAS 2.0 | Vertrauenswürdige Protokolle für digitale Identitäten |
| NATO | STANAG-Compliance für Verschlusssachen |
| EUIPO / EPO | Rechtssichere Nachweispflicht für Hinterlegungen |

---

## 9. Test- und Validierungsregeln

| Test | Erwartetes Ergebnis |
|---|---|
| Log-Injection | Nur authentifizierte Dienste können Logs schreiben |
| Hash-Manipulation | Veränderte Logs werden sofort durch Kettensprung erkannt |
| Löschversuch | Append-only-Storage verweigert Löschung |
| Korrelation | Alle Einträge einer `txId` sind innerhalb von 1 Sekunde abrufbar |
| SIEM-Export | Exportierte Logs enthalten Integritätsnachweise |

---

**Nutzung:** Diese Datenstruktur ist die Basis für alle HNOSS/MCCI-Audit-Logs und muss von allen Sicherheitskomponenten (IAM, Bridge, Mesh, Endpoint) eingehalten werden.
