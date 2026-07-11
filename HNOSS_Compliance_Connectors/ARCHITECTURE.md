# HNOSS Compliance Connectors — Architektur

## Compliance-as-API

Das Bündel definiert Compliance nicht als "Dokument", sondern als API-Endpunkt.
Jede regulatorische Prüfung ist ein deterministischer, auditierbarer Funktionsaufruf
mit Herkunftsnachweis (source_url + sha256).

## Authark-Rolle

Das System läuft vollständig autark. Keine Cloud-Abhängigkeit für die Kernlogik.
Die kdb+-Tabelle `access_governance` ist die Single Source of Truth für Tenant-Identität.

## Komponenten

### q/kdb+ Core (`q/core/`)

| Modul | Verantwortung |
|-------|---------------|
| `hash.q` | SHA-256 Token-Ableitung (Authark-kompatibel) |
| `audit.q` | Append-only Audit-Log (kdb+ splayed table) |
| `registry.q` | Connector-Registry + Health-Table |

### q/kdb+ Connectors (`q/connectors/`)

| Modul | Endpunkt | Validierung |
|-------|----------|-------------|
| `eidas_lotl.q` | eu-lotl.xml | XML-Signatur + XSD (ETSI TS 119 612) |
| `bsi_tr03107.q` | Offline XSD | Schema-Konformität eIDs |
| `xoev_xrepo.q` | xrepository.de | Schema-Registry-Lookup + Cache |
| `bafin_mvp.q` | portal.mvp.bafin.de | mTLS-Envelope, Dry-Run ohne Cert |

### Authark-Bridge (`q/authark/bridge.q`)

Hash-Token → Tenant-Mapping, `access_governance`-Query.
Standalone-Modus bei fehlendem `AUTHARK_BASE_URL`.

### Validate (`q/validate.q`)

Preflight-Validator. Ruft alle Connectoren parallel, schreibt Audit-Record.

## Datenfluss

```
POST /validate {tenant_id, payload_type}
  → Authark-Bridge: SHA-256(Tenant-ID + Metadata) → access_governance Lookup
  → q IPC → validate.q
      → eidas_lotl.q   (status; details; source_url; fetched_at; sha256)
      → bsi_tr03107.q  (status; details; source_url; fetched_at; sha256)
      → xoev_xrepo.q   (status; details; source_url; fetched_at; sha256)
      → bafin_mvp.q    (status; details; source_url; fetched_at; sha256)
  → audit.q: splayed record
  ← {status, per_connector, audit_id, hash}
```

## Status-Semantik

- `PASS` — Validierung erfolgreich gegen echten Endpunkt/Schema
- `FAIL` — Validierung fehlgeschlagen (echter Befund, keine Simulation)
- `SKIPPED_NO_CERT` — Bailey-Connector ohne Client-Zertifikat (Dry-Run)
- `SKIPPED_NO_CREDENTIALS` — Connector ohne Konfiguration
- `HEALTH_OK` — Modul geladen, Bereit

Kein Silent-Pass. Kein Fake-OK.