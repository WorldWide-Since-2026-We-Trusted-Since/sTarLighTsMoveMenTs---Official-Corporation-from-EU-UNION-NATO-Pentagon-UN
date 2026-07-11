# HNOSS Compliance-Skript

Referenz-Implementierung des Double-Gate Governance-Portals in
modularer, autharker Form. Jede Datei ist eine eigenständige
"Instanz" (Modul) mit einem klar umrissenen Zweck und einer
1:1-Zuordnung zu einem oder mehreren Rechtsartikeln (siehe
`LEGAL_MAPPING.md`) sowie einem Bedrohungsmodell
(`THREAT_MODEL.md`).

## Zusammenspiel (Orchestrator)

```
                  ┌────────────────────────┐
                  │  01 email_gatekeeper   │  Business-Email-Prüfung
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │  02 signature          │  E-Signature Kürzel/HMAC
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │  03 token_mail         │  Verify-Token + Mail-Versand
                  └───────────┬────────────┘
                              ▼   (Bestätigung)
                  ┌────────────────────────┐
                  │  04 admin_gate         │  Admin-Login + Session
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │  05 admin_review       │  State-Machine Approve/Reject
                  └───────────┬────────────┘
                              ▼   (Approved)
                  ┌────────────────────────┐
                  │  06 fragemodul         │  Antragskatalog + Antworten
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │  07 audit_log          │  Append-Only Hash-Chain
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │  08 compliance_checks  │  AI Act / DSA / DSGVO Rules
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │  09 integration_bus    │  Orchestrator (verbindet alle)
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │  10 export             │  DSGVO Art. 15 & 20
                  │  11 deletion           │  DSGVO Art. 17
                  └────────────────────────┘
```

## Betriebsmodi

1. **Cloud-Deployment (Lovable Cloud):** Live-Portal mit echter
   Datenbank (PostgreSQL + Row-Level-Security), Managed Email-Delivery
   und Auth-Provider. Die Instanzen werden als TanStack-Server-Fns
   und React-Routen ausgeliefert.
2. **Autharkes Self-Hosting:** Jedes Modul kann als eigenständiges
   Node-/Deno-Skript oder in ein bestehendes Backend integriert
   werden. Die exportierten Funktionen sind rein und ohne
   Framework-Abhängigkeit.

## Ausführung (Autark)

```bash
# Node ≥20 wird empfohlen
npm i zod
# jedes Modul enthält am Ende ein optionales "if (import.meta.main)" Beispiel
node --experimental-strip-types 01_instanz_email_gatekeeper.ts
```

## Sicherheitsprinzipien

- **Double-Gate:** Kein Zugriff auf das Fragemodul ohne
  (1) Bestätigung der Business-Email und (2) explizite Freigabe
  durch einen Administrator.
- **Zero-Trust:** Jede Instanz validiert ihre Inputs selbst
  (Zod-Schemas). Keine Instanz vertraut auf vorgelagerte
  Validierung.
- **Hash-Chain-Audit:** Jeder Auditeintrag enthält
  `hash = SHA256(prev_hash ‖ canonical_json(payload))`.
  Manipulation ist erkennbar, weil sich alle nachfolgenden
  Hashes ändern.
- **HMAC-Access-Tokens:** URLs enthalten HMAC-signierte,
  zeitlich begrenzte Tokens; die Signatur wird server-seitig
  verifiziert.
- **Minimale Datenerhebung (DSGVO Art. 5 Abs. 1 lit. c):**
  Nur Felder, die für die Governance-Entscheidung nötig sind.
