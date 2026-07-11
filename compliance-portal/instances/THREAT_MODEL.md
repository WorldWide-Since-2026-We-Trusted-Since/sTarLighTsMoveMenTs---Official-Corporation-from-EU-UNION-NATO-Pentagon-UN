# Threat-Model (STRIDE je Instanz)

Legende — **S**poofing · **T**ampering · **R**epudiation ·
**I**nformation Disclosure · **D**enial of Service · **E**levation of Privilege.

| Modul | Bedrohung | Mitigation |
|---|---|---|
| 01 email_gatekeeper | S (Freemail) | Blacklist + Business-Domain-Check |
| 02 signature | T (Kürzel-Manipulation) | HMAC-SHA-256 + constant-time compare |
| 03 token_mail | I (DB-Diebstahl) | Nur Hash gespeichert, TTL 24 h, One-Time-Use |
| 03 token_mail | R (Replay) | Statuswechsel `pending_email → pending_admin` |
| 04 admin_gate | E (Privilege Escalation) | `user_roles` separate Tabelle, `has_role()` SECURITY DEFINER |
| 04 admin_gate | S (Credential-Stuffing) | HIBP-Check + Rate-Limit |
| 05 admin_review | T (illegaler Statuswechsel) | State-Machine wirft, Audit-Entry |
| 06 fragemodul | T (Antwort-Fälschung) | Zod-Validation server-seitig + Audit |
| 07 audit_log | T (Log-Manipulation) | Hash-Chain, append-only, `verifyChain()` |
| 07 audit_log | D (Speicher füllt) | Log-Retention + Kompaktierung mit Merkle-Root |
| 08 compliance_checks | Bypass | Server-seitige Prüfung, keine Client-Trust |
| 09 integration_bus | R | Alle Publisher schreiben zuerst Audit, dann Event |
| 10 export | I (Fremd-Daten) | Access-Token + `has_role` + Zweckbindung |
| 11 deletion | T (Chain-Bruch) | Pseudonymisierung statt physisches Delete im Audit |
