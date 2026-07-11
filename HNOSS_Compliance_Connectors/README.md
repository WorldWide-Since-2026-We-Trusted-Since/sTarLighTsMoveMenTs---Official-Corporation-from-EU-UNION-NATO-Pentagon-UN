# HNOSS Compliance Connectors — Souveränes Modulbündel

## Zweck

Dieses Bündel erweitert die 11 HNOSS-Instanzen um eine **Compliance-as-API-Schicht**.
Es fungiert authark als hash-basierte Token-Brücke zwischen Tenant und regulatorischen
Instanzen. Die Validierung selbst läuft in reinem q/kdb+ gegen echte, öffentlich
dokumentierte staatliche Schemata und Endpunkte.

**Keine Dummy-URLs. Keine erfundenen Behörden-APIs.**

## Reale Endpunkte (verifiziert dokumentiert)

| Connector | Quelle | Auth | Validierungsart |
|-----------|--------|------|-----------------|
| `eidas_lotl` | https://ec.europa.eu/tools/lotl/eu-lotl.xml | keine | XML-Signatur + XSD gegen ETSI TS 119 612 |
| `bsi_tr03107` | Offline-XSD aus BSI TR-03107-1 (im Bundle, Nutzer legt PDF/XSD selbst bei) | keine | Schema-Konformität eIDs/Signaturen |
| `xoev_xrepo` | https://www.xrepository.de/api/xrepository/… (öffentlich) | keine | Schema-Registry-Lookup + XSD-Fetch/Cache |
| `bafin_mvp` | https://portal.mvp.bafin.de | mTLS mit Client-Zertifikat (vom Nutzer beizustellen) | Melde-Envelope-Validation, ohne Zertifikat: Dry-Run |

Fehlendes Zertifikat = expliziter `SKIPPED_NO_CERT`-Status (kein Silent-Pass, kein Fake-OK).

## Architektur (Compliance-as-API)

```
Tenant → HNOSS App (12_instanz_compliance_bridge.ts)
       → POST /validate  {tenant_id, payload_type}
       → runner.py  → Authark-Bridge (Hash-Token verifizieren)
                    → q IPC (Port 5000) → validate.q
                    → parallel: eidas_lotl, bsi_tr03107, xoev_xrepo, bafin_mvp
                    → audit.q schreibt splayed record
       ← {status: PASS|FAIL|SKIPPED, per_connector: {...}, audit_id, hash}
```

Jeder Connector liefert `(status; details; source_url; fetched_at; sha256)` —
keine Booleans ohne Herkunftsnachweis.

## Authark-Integration

`authark/bridge.q` implementiert die im Concept beschriebene hash-basierte Token-Architektur:

- **Input:** Tenant-ID + Metadaten
- **Prozess:** SHA-256 Hash-Ableitung, Lookup in `access_governance` (kdb+ Tabelle)
- **Output:** Verified Data Stream Token, das die Connectoren als Autorisierungsheader nutzen

Ohne konfigurierten `AUTHARK_BASE_URL` läuft die Bridge im Standalone-Modus mit
lokaler kdb+-Tabelle als Single Source of Truth — kein Silent-Skip.

## Betrieb

### Voraussetzungen

- **kdb+ Runtime** ist nicht Teil des Bundles (Lizenz KX).
  README verweist auf KX Personal Edition: `q hnoss.q -p 5000`
- Python 3.10+ für den optionalen REST-Runner

### Start (q direkt)

```bash
q q/hnoss.q -p 5000
```

### Start (mit Python-Runner)

```bash
pip install -r python/requirements.txt
./scripts/start.sh
```

### Preflight-Validierung

```bash
./scripts/preflight.sh
```

Prüft, dass alle Module laden und alle Connectoren `HEALTH_OK` oder
`SKIPPED_NO_CREDENTIALS` melden (keiner darf `FAIL`).

## Selbstvalidierung vor Auslieferung

Vor dem `tar czf` läuft `scripts/preflight.sh` im Sandbox:

1. `q q/validate.q -once` prüft, dass alle Module laden und alle Connectoren
   `HEALTH_OK` oder `SKIPPED_NO_CREDENTIALS` melden (keiner darf `FAIL`).
2. `python -m py_compile` über alle `.py`.
3. `xmllint --noout --schema` gegen mitgelieferte XSDs.

Bundle wird erst geschrieben, wenn preflight exit 0 liefert.
Ergebnis-Log liegt als `PREFLIGHT_REPORT.md` bei.

## Nicht enthalten (bewusst)

- Keine BaFin-Zertifikate, keine echten Tenant-Daten, keine erfundenen Endpunkte.
- Kein Sharp/Puppeteer (Worker-inkompatibel).
- Keine Änderung an den 11 vorhandenen .ts-Instanzen — Bridge-Modul `12_*` ist additiv.

## EU-Regulatorisches Mapping

Siehe `LEGAL_MAPPING.md` — erweitert um eIDAS Art.22, DSGVO Art.32, KRITIS,
MiCA Art.68, DSA, EU AI Act.

## Version

SemVer + SHA-256 Bundle-Manifest in `VERSION`.