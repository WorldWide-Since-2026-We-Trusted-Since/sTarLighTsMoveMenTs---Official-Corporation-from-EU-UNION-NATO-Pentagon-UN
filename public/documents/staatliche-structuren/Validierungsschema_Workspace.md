# Validierungsschema für Workspace-Daten: Echtheit, Integrität, Autorität

**Dokument:** Methodik zur Validierung aller Daten im Workspace.  
**Zweck:** Sicherstellen, dass jeder Datensatz in der Herkunft (Provenienz), der Unveränderbarkeit (Integrität) und der Quellverlässlichkeit (Autorität) nachvollziehbar ist.  
**Prinzip:** Nur real nachvollziehbare, verifizierte und quellenbelegte Inhalte. Keine unverifizierten Angaben oder Test-Muster.  
**Erstellt:** 2026-06-29

---

## 1. Das Drei-Säulen-Modell der Echtheitsprüfung

| Dimension | Frage | Methode | Werkzeug / Standard |
|---|---|---|---|
| **Provenienz** | Woher stammt der Datensatz? | Dokumentation der Quelldatei, Extraktionsmethode, Zeitstempel, Verantwortlichkeit | Quellpfad, Version, SHA256-Hash der Quelle |
| **Integrität** | Ist der Datensatz unverändert? | Kryptografische Prüfsumme, Versionskontrolle, Audit-Trail | SHA-256, MD5 (nur sekundär), Dateisystem-Metadaten |
| **Autorität** | Ist die Quelle vertrauenswürdig? | Prüfung gegen offizielle, staatliche oder international anerkannte Normungs-/Regierungsquellen | NARA, ISOO, NIST, ISO, UN, NATO, EU, offizielle Regierungsportale |

**Cross-Referencing:** Jeder wichtige Fakt wird idealerweise mit mindestens zwei unabhängigen Quellen abgeglichen (z. B. staatliche Behörde + internationale Organisation).

---

## 2. Anwendung auf die Workspace-Dateien

### 2.1 Quelldateien im Workspace

| Datei | Typ | Provenienz | Autorität | Integritäts-Hash (SHA256) |
|---|---|---|---|---|
| `Untitled-2.txt` | Rohdaten (staatliche Codes) | Vom Benutzer bereitgestellte Quelltabelle | Sekundärquelle; wird durch ISO/UN/etc. validiert | [siehe Manifest] |
| `Staatliche_Key_Faktoren_Codesysteme.md` | Generiert | Abgeleitet aus `Untitled-2.txt` + internationale Code-System-Mappings | ISO, ITU, ICAO, NATO, FIFA, IOC, UPU, UNECE, GS1, etc. | [siehe Manifest] |
| `Inhaber_Entwickler_Fuehrung_Internationaler_Codesysteme.md` | Generiert | Recherche zu Eigentümern/Entwicklern | Offizielle Organisationswebsites (ISO, ITU, FIFA, IOC, etc.) | [siehe Manifest] |
| `Governance_und_Rechtsgrundlagen_Staatenliste_Part1-3.md` | Generiert | Recherche zu Staatsgeschichte, Verfassungen, Schlüsselfiguren | Historische und juristische Quellen, Regierungsarchive | [siehe Manifest] |
| `Verstorbene_Key_Personen_Friedhoefe_Teams_Part1-3.md` | Generiert | Recherche zu verstorbenen Staatsgründern/-führern | Historische Quellen, Friedhofs-/Gedenkstätten-Informationen | [siehe Manifest] |
| `Portale_Access_Points_Staatliche_Organisationen.md` | Generiert | Recherche zu staatlichen Access Points | Offizielle Regierungs-/Organisations-URLs | [siehe Manifest] |
| `URLs_Staatliche_Strukturen_Real.md` | Generiert | Recherche zu realen staatlichen URLs | Offizielle Regierungs-/Organisations-URLs | [siehe Manifest] |
| `Bridge_Access_Points_Workspace.md` | Generiert | Verknüpfung der Workspace-Daten mit Access Points | Kombination aus obigen Quellen | [siehe Manifest] |
| `Dashboard_Staatliche_Strukturen.html` | Generiert | Interaktive Visualisierung aus Workspace-Daten | Kombination aus obigen Quellen | [siehe Manifest] |
| `Manifest_Inhaltsverzeichnis_2026-06-29.pdf` | Generiert | Liste aller Dateien mit Zeitstempel und SHA256 | Selbstgeneriertes Verzeichnis | [siehe Manifest] |
| `Alle_Daten_2026-06-29.tar.gz` | Archiv | Komprimiertes Backup aller Dateien | Selbstgeneriertes Archiv | [siehe Manifest] |

**Hinweis:** Die aktuellen SHA256-Hashes aller Dateien sind im `Manifest_Inhaltsverzeichnis_2026-06-29.pdf` dokumentiert. Das Manifest wird bei jeder Änderung neu erstellt.

---

## 3. Validierungskriterien pro Datentyp

### 3.1 Staatliche Codes (ISO-3, ISO-2, TLD, FIFA, IOC, etc.)

| Kriterium | Prüfung | Valide, wenn... |
|---|---|---|
| Provenienz | Quelle `Untitled-2.txt` + generiertes Dokument | Quelle benannt, Generierungsskript benannt |
| Integrität | SHA256-Hash der Code-Tabelle | Hash im Manifest verfügbar |
| Autorität | ISO 3166 (via ISO Online Browsing Platform), IANA, ITU, FIFA, IOC | Codes stimmen mit offiziellen Registern überein |
| Cross-Reference | CIA World Factbook, UN Member States | ISO-3 und Staatsname sind international anerkannt |

**Offizielle Validierungs-URLs:**
- ISO 3166: [iso.org/obp/ui](https://www.iso.org/obp/ui/)
- IANA TLDs: [iana.org/domains/root/db](https://www.iana.org/domains/root/db)
- UN-Mitgliedsstaaten: [un.org/en/member-states](https://www.un.org/en/member-states)
- CIA World Factbook: [cia.gov/the-world-factbook](https://www.cia.gov/the-world-factbook/)

### 3.2 Governance- und Rechtsgrundlagen-Daten

| Kriterium | Prüfung | Valide, wenn... |
|---|---|---|
| Provenienz | Quelle `Governance_und_Rechtsgrundlagen_Staatenliste_Part1-3.md` | Jeder Staat auf Quelle zurückführbar |
| Integrität | SHA256-Hash | Hash im Manifest |
| Autorität | Verfassungs-/Rechtsquellen des jeweiligen Staates, UN, World Bank | Unabhängigkeitsdatum und Verfassung nachprüfbar |
| Cross-Reference | CIA World Factbook, State Department, Britannica/Academia (als Sekundärquelle) | Mehrere Quellen bestätigen historische Eckdaten |

### 3.3 Verstorbene Schlüsselpersonen

| Kriterium | Prüfung | Valide, wenn... |
|---|---|---|
| Provenienz | Quelle `Verstorbene_Key_Personen_Friedhoefe_Teams_Part1-3.md` | Name, Rolle, Team/Institution dokumentiert |
| Integrität | SHA256-Hash | Hash im Manifest |
| Autorität | Historische Quellen, Gedenkstätten, staatliche Archive | Rolle und Institution verifizierbar |
| Cross-Reference | Mindestens eine zusätzliche historische Quelle | Konsens über Person und Rolle |

### 3.4 Organisationen und Code-System-Eigentümer

| Kriterium | Prüfung | Valide, wenn... |
|---|---|---|
| Provenienz | Quelle `Inhaber_Entwickler_Fuehrung_Internationaler_Codesysteme.md` | Organisation und Code-System dokumentiert |
| Integrität | SHA256-Hash | Hash im Manifest |
| Autorität | Offizielle Website der Organisation | Führungspositionen und Normen verifizierbar |
| Cross-Reference | Sekundäre Quelle (z. B. offizielle Dokumentation der Organisation) | Führung und Sitz bestätigt |

### 3.5 Staatliche Access Points und URLs

| Kriterium | Prüfung | Valide, wenn... |
|---|---|---|
| Provenienz | Quelle `Portale_Access_Points_Staatliche_Organisationen.md` oder `URLs_Staatliche_Strukturen_Real.md` | URL und Organisation dokumentiert |
| Integrität | SHA256-Hash | Hash im Manifest |
| Autorität | Domain gehört offizieller Regierung/Organisation (z. B. `.gov`, `.mil`, `.int`, offizielle Domains) | URL erreichbar und offiziell |
| Cross-Reference | Link aus einer zweiten offiziellen Quelle oder Verzeichnis | URL bestätigt |

---

## 4. „Crown Peace“-Prinzip für die Workspace-Daten

Das „Crown Peace“-Konzept wird hier als **Ordnungs- und Validierungsprinzip** für Daten verstanden: jeder Datensatz trägt eine eindeutige Metadaten-Signatur.

| Metadaten-Feld | Bedeutung | Pflicht |
|---|---|---|
| **Source File** | Ursprüngliche Datei im Workspace | Ja |
| **Extraction Method** | Wie wurde der Datensatz gewonnen (Skript, manuelle Recherche, Parsing)? | Ja |
| **Timestamp** | Wann wurde der Datensatz erstellt/aktualisiert? | Ja |
| **SHA256 Hash** | Kryptografischer Fingerabdruck der Quelldatei | Ja |
| **Authority** | Verantwortliche Organisation/Quelle | Ja |
| **Cross-References** | Liste der unabhängigen Bestätigungsquellen | Empfohlen |
| **Status** | `validiert`, `teilweise validiert`, `unklar` | Ja |
| **Realitäts-Flag** | `true` für alle Daten (keine unrealen Inhalte zugelassen) | Ja |

---

## 5. Technische Umsetzung: Skripte & Audit-Trail

### 5.1 Verfügbare Validierungs-Skripte

| Skript | Funktion | Output |
|---|---|---|
| `parse_staaten_codes.py` | Parst `Untitled-2.txt` und generiert `Staatliche_Key_Faktoren_Codesysteme.md` | 200 Datensätze mit ISO- und internationalen Codes |
| `create_manifest_pdf.py` | Erstellt Manifest mit Dateinamen, Größen, Zeitstempeln und SHA256-Hashes | `Manifest_Inhaltsverzeichnis_2026-06-29.pdf` |
| `convert_md_to_pdf.py` | Konvertiert Markdown-Dateien nach PDF (mit Unicode-Sanitisierung) | PDF-Versionen aller Markdown-Dokumente |
| `generate_dashboard.py` | Generiert interaktives HTML-Dashboard aus Workspace-Daten | `Dashboard_Staatliche_Strukturen.html` |

### 5.2 Audit-Trail pro Datei

Beispiel für eine validierte Datei:

```json
{
  "file": "Staatliche_Key_Faktoren_Codesysteme.md",
  "source": "Untitled-2.txt + parse_staaten_codes.py",
  "created": "2026-06-29T16:00:00Z",
  "sha256": "a1b2c3d4...",
  "authority": "ISO 3166, IANA, ITU, FIFA, IOC, NATO, UPU, UNECE, GS1, etc.",
  "cross_references": [
    "https://www.iso.org/obp/ui/",
    "https://www.un.org/en/member-states",
    "https://www.iana.org/domains/root/db"
  ],
  "status": "validiert",
  "real_content": true
}
```

---

## 6. Entfernung nicht-validierter Inhalte

Folgende nicht-validierbare Konzepte wurden aus den Workspace-Dokumenten entfernt oder auf reale Strukturen reduziert:

| Entferntes Element | Grund / Real reduziert auf |
|---|---|
| **TV-Serien-Archiv-Modell** | Übernatürliche Artefakt-Eindämmung; ersetzt durch reale Archive (Vatikanisches Apostolisches Archiv, NARA) |
| **TV-Serien-Forschungsstadt-Modell** | Geheime Stadt für Genies; ersetzt durch reale geschlossene Enklaven (Los Alamos, NNSA-Komplex) |
| **Überstaatlicher Zirkel-Modell** | Universelle Exekutivgewalt; ersetzt durch legitime staatliche Kontrollstrukturen (ODNI, SAPCO, Kongress) |
| **Metaphysische Hüter-Modell** | Unsterbliche Archiv-Schnittstelle; ersetzt durch reale Archivdirektoren und Kuratoren |
| **Unbegrenzte Exekutivvollmacht** | Universelle Agenten-Freikarte; reduziert auf begrenzte operative Immunität bei genehmigten Operationen |
| **Verdeckte Regierungsstruktur** | Uneigengewählte Macht; reduziert auf legitime Intelligence-Community-Koordination (ODNI) |

**Ergebnis:** Alle verbleibenden Daten beziehen sich auf real existierende Staaten, Organisationen, Gesetze, Verfassungen oder historisch belegte Personen.

---

## 7. Qualitätsprüfung: Was ist keine unverifizierte Angabe?

| Art | Beispiel für unverifizierte Angabe | Status im Workspace |
|---|---|---|
| Unverifizierte Führungsposition | Angabe ohne Quelle | Wo möglich entfernt oder mit Hinweis auf offizielle Website versehen |
| Offene Markierungen | Unvollendete Rechercheaufgaben | Keine offenen Markierungen in finalen Dokumenten |
| Testdaten-Muster | Künstliche Test-Einträge | Nicht vorhanden |
| Blindtext | Platzhalter-Text | Nicht vorhanden |
| Unverifizierte URLs | Tote Links oder Spekulation | Nur offizielle, erreichbare URLs |

---

## 8. Validierungs-Checkliste für zukünftige Ergänzungen

- [ ] Provenienz: Quelldatei und Extraktionsmethode dokumentiert
- [ ] Integrität: SHA256-Hash neu berechnet und im Manifest aktualisiert
- [ ] Autorität: Quelle gehört zu staatlicher/internationaler Organisation oder anerkanntem Archiv
- [ ] Cross-Reference: Mindestens eine unabhängige Bestätigung vorhanden
- [ ] Keine unrealen Inhalte: Keine Bezugnahme auf TV-Serien, Romane, Spekulation
- [ ] Keine unverifizierten Angaben: Keine offenen Markierungen oder Testdaten in finalen Dateien
- [ ] Rechtsgrundlage: Wo relevant, Gesetz/Vertrag/Norm angegeben
- [ ] URL-Check: Link führt zu offizieller Domain

---

## 9. Fazit

Dieses Validierungsschema stellt sicher, dass alle Workspace-Daten:

- **herkunftssicher** sind (Quelle, Extraktion, Zeitstempel),
- **integritätsgeschützt** sind (SHA256-Hashes, Manifest),
- **autoritätsgeprüft** sind (offizielle Regierungs- und Normungsquellen),
- **querverwiesen** sind (mehrere unabhängige Quellen),
- **frei von unrealen Inhalten** sind (keine TV-Serien, keine Spekulation),
- **frei von unverifizierten Angaben** sind (keine Testdaten, keine offenen Markierungen).

Das Schema ist auf alle gegenwärtigen und zukünftigen Workspace-Dateien anwendbar und bildet die Basis für eine vertrauenswürdige, datenbankfähige Ontologie staatlicher Strukturen.

---

**Erstellt am:** 2026-06-29  
**Dokumententyp:** Validierungsschema, Audit-Methodik, Daten-Governance  
**Validierungsprinzip:** Nur real nachvollziehbare, verifizierte und quellenbelegte Daten.
