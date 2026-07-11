# PNIA-Core Connection Map

Cross-Verbindungen zwischen Paragraphen und Code-Modulen.

| Paper | Paragraph | Titel | Cross-Refs |
|-------|-----------|-------|------------|
| legal | §1.1 | Gegenstand und Zweck | arch:§2.1 · info:§4.2 |
| legal | §1.2 | Begriffsbestimmungen | arch:§2.2 |
| legal | §2.1 | Verhältnis zum Bundesnaturschutzgesetz | arch:§3.1 |
| legal | §2.2 | Grundrechtsbezug (GG) und DSGVO-Konformität | info:§4.3 |
| legal | §3.1 | Prinzip der Juris-Code-Synergie | arch:§2.3 · arch:§4.1 |
| legal | §3.2 | Rechtsfolge fehlender Cross-Referenz | arch:§5.1 |
| legal | §4.1 | Abgrenzung zu militärischen Standards | info:§2.1 · info:§2.2 |
| legal | §5.1 | Haftung und Betreiberpflichten | arch:§5.2 |
| legal | §6.1 | Inkrafttreten und Fortschreibung | one:§1.1 |
| architecture | §1.1 | Zielsetzung | legal:§1.1 · one:§1.1 |
| architecture | §2.1 | Kernkonzept: Unique ID als Registrierungsschlüssel | legal:§1.2 |
| architecture | §2.2 | Registry-Semantik | legal:§3.1 |
| architecture | §2.3 | ACP / MCP-Bridge | legal:§3.1 · one:§1.2 |
| architecture | §3.1 | Serverless-Topologie | legal:§2.1 |
| architecture | §3.2 | Atomare Metrologie (Cosmos Peace Uhr) | info:§3.1 |
| architecture | §4.1 | Manifest und Cross-Reference | legal:§3.1 · one:§1.3 |
| architecture | §5.1 | Validator | legal:§3.2 |
| architecture | §5.2 | Rollback und Reversibilität | legal:§5.1 |
| architecture | §6.1 | Referenzumgebung | info:§4.1 |
| one_pager | §1.1 | Zielbild | legal:§1.1 · arch:§1.1 |
| one_pager | §1.2 | Architekturprinzipien | arch:§2.1 · arch:§2.3 · arch:§3.1 |
| one_pager | §1.3 | Juristische Verankerung | legal:§3.1 · arch:§4.1 |
| one_pager | §1.4 | Bereitstellung | arch:§4.1 |
| information | §1.1 | Kontext | legal:§1.1 · arch:§1.1 |
| information | §2.1 | Bezug zu GovStack | legal:§4.1 |
| information | §2.2 | Abgrenzung zu militärischen Standards | legal:§4.1 |
| information | §3.1 | Public-Goods-Protokolle | arch:§3.2 |
| information | §4.1 | Referenzumgebung und Nachhaltigkeit | arch:§6.1 |
| information | §4.2 | Autarkie und keine fiktiven Daten | legal:§1.1 |
| information | §4.3 | Menschenrechte und Datenschutz | legal:§2.2 |

## Modul-Mapping

| Modul | Rechtliche Referenz | Technische Referenz |
|-------|--------------------|--------------------|
| legal_binding | legal §1.1 – §6.1 | docs/legal_binding.pdf |
| acp_bridge | legal §3.1 | src/protocols/acp_bridge.ts |
| metrology_core | arch §3.2 | src/core/metrology.js |
| identity_registry | arch §2.2 | config/identity.json |