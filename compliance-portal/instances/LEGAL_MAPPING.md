# Rechtliche Zuordnung (Paragraph-Mapping)

| Modul | EU AI Act (VO 2024/1689) | DSA (VO 2022/2065) | DSGVO (VO 2016/679) | Weitere |
|---|---|---|---|---|
| 01 email_gatekeeper | Art. 26 (Deployer) | Art. 14 (AGB-Kohärenz) | Art. 5 (Datenminimierung) | — |
| 02 signature | — | — | Art. 32 (Integrität) | eIDAS Art. 3(10), 25 |
| 03 token_mail | Art. 26 | — | Art. 32 | — |
| 04 admin_gate | Art. 14 (Human Oversight) | Art. 16 (Kontaktstelle) | Art. 32 | — |
| 05 admin_review | Art. 14 | Art. 16, 20 (Beschwerde) | Art. 22 (keine rein autom. Entscheidung) | — |
| 06 fragemodul | Art. 10 (Data Gov.), Art. 13 (Transparenz) | — | Art. 13 (Info-Pflicht) | — |
| 07 audit_log | Art. 12 (Logging) | Art. 24 (Transparenzbericht) | Art. 5(2), 32, 33, 34 | — |
| 08 compliance_checks | Art. 5 (Verbote), Art. 9 (Risiko-Sys.) | — | Art. 25 (Privacy by Design) | HLEG AI Ethics |
| 09 integration_bus | Art. 12 | — | — | — |
| 10 export | — | — | Art. 15, 20 (Auskunft/Portabilität) | — |
| 11 deletion | — | — | Art. 17 (Löschung) | — |

## Kernaussagen

- **AI Act Art. 5**: Der Zweck-Text wird gegen eine Keyword-Liste
  bekannter verbotener Praktiken abgeglichen; ein Treffer blockt die
  Anfrage automatisch (Instanz 08). Der Admin muss die Entscheidung
  dennoch manuell bestätigen (Art. 14 Human Oversight).
- **AI Act Art. 12**: Sämtliche Aktionen landen in `audit_log`
  (append-only, Hash-Chain). Der Log ist maschinenlesbar exportierbar.
- **DSA Art. 16**: Die App stellt eine sichtbare Kontaktstelle
  bereit (siehe `/downloads` → Concept Paper Kap. 6).
- **DSGVO Art. 25**: "Privacy by Design" wird durch minimales
  Datenmodell + Verify-Token-Hashing + optionale Pseudonymisierung
  bei Löschung umgesetzt.
- **DSGVO Art. 33**: Bei Verdacht auf Data Breach kann der Audit-Log
  als Nachweis der 72-h-Meldung dienen.
