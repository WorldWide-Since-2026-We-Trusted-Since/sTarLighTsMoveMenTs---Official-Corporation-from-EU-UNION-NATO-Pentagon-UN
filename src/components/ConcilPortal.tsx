import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, FileText, Scale, BookOpen, Globe, ExternalLink, Shield, Lock } from "lucide-react";

// Categories for the portal
const CATEGORIES = [
  { id: "all", label: "Alle Dokumente", icon: FileText },
  { id: "staatliche", label: "Staatliche Structuren", icon: Scale },
  { id: "concil", label: "Concil Architektur", icon: BookOpen },
  { id: "official", label: "Offizielle URLs & Kontakte", icon: Globe }
];

// Document definitions
const DOCUMENTS = [
  // Staatliche Structuren
  {
    id: "staatliche-1",
    title: "Governance und Rechtsgrundlagen der Staatenliste – Teil 1 (A–F)",
    category: "staatliche",
    type: "Governance Dokument",
    date: "28. Juni 2026",
    icon: "🏛️",
    url: "/documents/staatliche-structuren/Governance_und_Rechtsgrundlagen_Staatenliste_Part1.md",
    preview: "Umfassende Tabelle der Staaten A–F mit ISO-Codes, Hauptstädten, Rechtsformen, Unabhängigkeitsdaten und Verfassungsgeschichte."
  },
  {
    id: "staatliche-2",
    title: "Governance und Rechtsgrundlagen der Staatenliste – Teil 2 (G–M)",
    category: "staatliche",
    type: "Governance Dokument",
    date: "28. Juni 2026",
    icon: "🏛️",
    url: "/documents/staatliche-structuren/Governance_und_Rechtsgrundlagen_Staatenliste_Part2.md",
    preview: "Staaten G–M mit vollständigen Governance-Daten, Rechtsgrundlagen und historischen Kontexten."
  },
  {
    id: "staatliche-3",
    title: "Governance und Rechtsgrundlagen der Staatenliste – Teil 3",
    category: "staatliche",
    type: "Governance Dokument",
    date: "28. Juni 2026",
    icon: "🏛️",
    url: "/documents/staatliche-structuren/Governance_und_Rechtsgrundlagen_Staatenliste_Part3.md",
    preview: "Fortführung der Staatenliste mit vollständigen regulatorischen und historischen Daten."
  },
  {
    id: "staatliche-4",
    title: "Verstorbene Key-Personen – Friedhöfe & Teams – Teil 1",
    category: "staatliche",
    type: "Registry Dokument",
    date: "28. Juni 2026",
    icon: "🕊️",
    url: "/documents/staatliche-structuren/Verstorbene_Key_Personen_Friedhoefe_Teams_Part1.md",
    preview: "Verzeichnis verstorbener Schlüsselpersonen mit Friedhofs- und Team-Zuordnungen."
  },
  {
    id: "staatliche-5",
    title: "Verstorbene Key-Personen – Friedhöfe & Teams – Teil 2",
    category: "staatliche",
    type: "Registry Dokument",
    date: "28. Juni 2026",
    icon: "🕊️",
    url: "/documents/staatliche-structuren/Verstorbene_Key_Personen_Friedhoefe_Teams_Part2.md",
    preview: "Fortführung des Verzeichnisses mit weiteren Schlüsselpersonen und institutionellen Zuordnungen."
  },
  {
    id: "staatliche-6",
    title: "Verstorbene Key-Personen – Friedhöfe & Teams – Teil 3",
    category: "staatliche",
    type: "Registry Dokument",
    date: "28. Juni 2026",
    icon: "🕊️",
    url: "/documents/staatliche-structuren/Verstorbene_Key_Personen_Friedhoefe_Teams_Part3.md",
    preview: "Abschluss des Verzeichnisses mit vollständigen personellen und institutionellen Bezügen."
  },
  {
    id: "staatliche-7",
    title: "Staatliche Key-Faktoren & Codesysteme",
    category: "staatliche",
    type: "Technisches Dokument",
    date: "28. Juni 2026",
    icon: "🔐",
    url: "/documents/staatliche-structuren/Staatliche_Key_Faktoren_Codesysteme.md",
    preview: "Kritische Faktoren und Codesysteme für staatliche Identifikations- und Governance-Rahmen."
  },
  {
    id: "staatliche-8",
    title: "Validation Protocol",
    category: "staatliche",
    type: "Protokoll",
    date: "28. Juni 2026",
    icon: "✅",
    url: "/documents/staatliche-structuren/Validation_Protocol.md",
    preview: "Formelles Validierungsprotokoll für staatliche und institutionelle Prüfprozesse."
  },
  {
    id: "staatliche-9",
    title: "URLs Staatliche Strukturen – Real",
    category: "staatliche",
    type: "Referenz",
    date: "28. Juni 2026",
    icon: "🔗",
    url: "/documents/staatliche-structuren/URLs_Staatliche_Strukturen_Real.md",
    preview: "Verifizierte URLs staatlicher Institutionen, Behörden und internationaler Organisationen."
  },
  {
    id: "staatliche-10",
    title: "Inhaber, Entwickler & Führung Internationaler Codesysteme",
    category: "staatliche",
    type: "Governance Dokument",
    date: "28. Juni 2026",
    icon: "👑",
    url: "/documents/staatliche-structuren/Inhaber_Entwickler_Fuehrung_Internationaler_Codesysteme.md",
    preview: "Verantwortlichkeiten und Führungsstrukturen internationaler Codesysteme und Standards."
  },
  {
    id: "staatliche-11",
    title: "HNOSS Security Team Bridge-Architektur",
    category: "staatliche",
    type: "Security Dokument",
    date: "28. Juni 2026",
    icon: "🛡️",
    url: "/documents/staatliche-structuren/HNOSS_Security_Team_Bridge_Architektur.md",
    preview: "Technische Sicherheitsarchitektur für HNOSS/MCCI mit Whitelisting, Bridge-Komponenten und Audit-Logging."
  },
  {
    id: "staatliche-12",
    title: "HNOSS Bridge-Spezifikation",
    category: "staatliche",
    type: "Technische Spezifikation",
    date: "28. Juni 2026",
    icon: "🌉",
    url: "/documents/staatliche-structuren/HNOSS_Bridge_Spezifikation.md",
    preview: "Detaillierte Spezifikation der Bridge- und Gateway-Komponenten für sichere Domain-Übergänge."
  },
  {
    id: "staatliche-13",
    title: "HNOSS Audit Log Datenstruktur",
    category: "staatliche",
    type: "Security Dokument",
    date: "28. Juni 2026",
    icon: "📊",
    url: "/documents/staatliche-structuren/HNOSS_Audit_Log_Datenstruktur.md",
    preview: "Datenstruktur für Audit-Logs und Sicherheitsprotokolle im HNOSS-System."
  },
  {
    id: "staatliche-14",
    title: "Fiktion ↔ Real Matrix",
    category: "staatliche",
    type: "Referenzdokument",
    date: "28. Juni 2026",
    icon: "🎭",
    url: "/documents/staatliche-structuren/Fiktion_Real_Matrix.md",
    preview: "Mapping zwischen fiktionalen Konzepten (Warehouse 13, Eureka) und realen staatlichen Institutionen."
  },
  {
    id: "staatliche-15",
    title: "Bridge Access Points Workspace",
    category: "staatliche",
    type: "Technisches Dokument",
    date: "28. Juni 2026",
    icon: "🌉",
    url: "/documents/staatliche-structuren/Bridge_Access_Points_Workspace.md",
    preview: "Workspace-Dokumentation für Bridge-Access-Punkte und API-Endpunkte."
  },
  {
    id: "staatliche-16",
    title: "Portale Access Points International",
    category: "staatliche",
    type: "Referenz",
    date: "28. Juni 2026",
    icon: "🌐",
    url: "/documents/staatliche-structuren/Portale_Access_Points_International.md",
    preview: "Internationale Zugriffswege und Portale für institutionelle Dokumentation."
  },
  {
    id: "staatliche-17",
    title: "Portale Access Points Staatliche Organisationen",
    category: "staatliche",
    type: "Referenz",
    date: "28. Juni 2026",
    icon: "🏛️",
    url: "/documents/staatliche-structuren/Portale_Access_Points_Staatliche_Organisationen.md",
    preview: "Staatliche Zugriffswege und Portale für institutionelle Dokumentation."
  },

  // Concil Architektur
  {
    id: "concil-1",
    title: "PNIA Technisches Factsheet",
    category: "concil",
    type: "Technical Paper",
    date: "28. Juni 2026",
    icon: "⚙️",
    url: "/documents/concil-architektur/PNIA_Technisches_Factsheet.md",
    preview: "Referenz-Architektur für Governance-Veredelung und automatisierte Aufsicht. Kernkomponenten: Automated Audit Trail, Operational Resilience, Interoperabilitäts-Layer."
  },
  {
    id: "concil-2",
    title: "PNIA Pitch Deck",
    category: "concil",
    type: "Pitch Deck",
    date: "28. Juni 2026",
    icon: "📊",
    url: "/documents/concil-architektur/PNIA_Pitch_Deck.md",
    preview: "Präsentation: 'Die Immunitäts-Infrastruktur Europas'. 7 Slides zur Governance-Latenz, PNIA-State-0-Compliance und Roadmap."
  },
  {
    id: "concil-3",
    title: "PNIA Governance-Veredelung Whitepaper v1",
    category: "concil",
    type: "Whitepaper",
    date: "28. Juni 2026",
    icon: "📘",
    url: "/documents/concil-architektur/PNIA_Governance_Veredelung_Whitepaper_v1.md",
    preview: "Positionierungspapier für digitale Souveränität und automatisierte Aufsicht. 12 Kapitel zu PNIA-Architektur, regulatorischem Kontext und Implementierungsstrategie."
  },
  {
    id: "concil-4",
    title: "PNIA Komplettpaket",
    category: "concil",
    type: "Master Dokument",
    date: "28. Juni 2026",
    icon: "📦",
    url: "/documents/concil-architektur/PNIA_Komplettpaket.md",
    preview: "Gesamtpaket mit allen Spezifikationen, Implementierungsrichtlinien und Referenzdokumenten für PNIA."
  },
  {
    id: "concil-5",
    title: "PNIA Governance-Strategiepapier",
    category: "concil",
    type: "Strategiepapier",
    date: "28. Juni 2026",
    icon: "🎯",
    url: "/documents/concil-architektur/PNIA_Governance_Strategiepapier.md",
    preview: "Strategische Ausrichtung von PNIA als Infrastruktur-Standard für regulatorische Veredelung."
  },
  {
    id: "concil-6",
    title: "PNIA EU-Implementierungsstrategie – Zusammenfassung",
    category: "concil",
    type: "Strategiedokument",
    date: "28. Juni 2026",
    icon: "🇪🇺",
    url: "/documents/concil-architektur/PNIA_EU_Implementierungsstrategie_Zusammenfassung.md",
    preview: "Zusammenfassung der EU-Strategie: Kooperation mit EU Digital Finance Platform, EBSI, AI Office und INATBA."
  },
  {
    id: "concil-7",
    title: "Offizielle EU-URLs & Kontakte",
    category: "concil",
    type: "Referenz",
    date: "28. Juni 2026",
    icon: "🌐",
    url: "/documents/concil-architektur/Offizielle_EU_URLs_Kontakte.md",
    preview: "Liste offizieller EU-Institutionen, NATO, Pentagon, UN, deutscher Behörden und technischer Standards (W3C, ISO, IEEE)."
  },
  {
    id: "concil-8",
    title: "Concil Protokoll CP01 – Master-Spezifikation",
    category: "concil",
    type: "Master-Spezifikation",
    date: "28. Juni 2026",
    icon: "📜",
    url: "/documents/concil-architektur/Concil_Protokoll_CP01_Master_Spezifikation.md",
    preview: "Master-Spezifikation des Concil-Protokolls: Axiome, Immunitas, Veredelung, Multi-Eternity-Flow."
  },
  {
    id: "concil-9",
    title: "Concil Protokoll CP01 – API-Spezifikation (CIHandschuh)",
    category: "concil",
    type: "API Spezifikation",
    date: "28. Juni 2026",
    icon: "🔌",
    url: "/documents/concil-architektur/Concil_Protokoll_CP01_CIHandschuh_API_Spezifikation.md",
    preview: "Technische API-Spezifikation für die CIHandschuh-Integration und Bridge-Kommunikation."
  },
  {
    id: "concil-10",
    title: "Concil Protokoll CP01 – Einreichungsmatrix",
    category: "concil",
    type: "Protokoll",
    date: "28. Juni 2026",
    icon: "📋",
    url: "/documents/concil-architektur/Concil_Protokoll_CP01_Einreichungsmatrix.md",
    preview: "Matrix für offizielle Einreichungen bei EU, NATO, UN und weiteren Institutionen."
  },
  {
    id: "concil-11",
    title: "Concil Protokoll CP01 – Global Implementation Manifest",
    category: "concil",
    type: "Manifest",
    date: "28. Juni 2026",
    icon: "🌍",
    url: "/documents/concil-architektur/Concil_Protokoll_CP01_Global_Implementation_Manifest.md",
    preview: "Globales Implementierungsmanifest für die Cross-Border-Veredelung und institutionelle Integration."
  },
  {
    id: "concil-12",
    title: "Concil Protokoll CP01 – Vollprotokoll",
    category: "concil",
    type: "Vollprotokoll",
    date: "28. Juni 2026",
    icon: "📖",
    url: "/documents/concil-architektur/Concil_Protokoll_CP01_Vollprotokoll.md",
    preview: "Vollständiges Protokoll mit allen Definitions- und Implementierungsdetails für CP-01."
  },
  {
    id: "concil-13",
    title: "EOI Sandbox Pilot – Anschreiben",
    category: "concil",
    type: "Anschreiben",
    date: "28. Juni 2026",
    icon: "✉️",
    url: "/documents/concil-architektur/EOI_Sandbox_Pilot_Anschreiben.md",
    preview: "Expression of Interest für Sandbox-Pilotprojekte mit EU Digital Finance Platform."
  },
  {
    id: "concil-14",
    title: "Letter of Formal Submission CP01",
    category: "concil",
    type: "Formelles Schreiben",
    date: "28. Juni 2026",
    icon: "✉️",
    url: "/documents/concil-architektur/Letter_of_Formal_Submission_CP01.md",
    preview: "Formelles Einreichungsschreiben für CP01 an offizielle Institutionen."
  }
];

export default function ConcilPortal() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const filteredDocs = DOCUMENTS.filter(doc => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="concil-portal-wrapper w-full max-w-7xl mx-auto px-4 py-8">
      {/* Portal Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block mb-4"
        >
          <div className="text-6xl mb-2">🏛️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Concil <span className="text-[#bf953f]">Portal</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-3xl mx-auto">
            Offizielle Dokumentation, Spezifikationen und Governance-Rahmenwerke des HNOSS Systems
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="🔍 Dokumente durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#bf953f] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 border rounded text-xs font-mono uppercase tracking-wider transition-all ${
                    selectedCategory === cat.id
                      ? "border-[#bf953f] bg-[#bf953f]/25 text-white"
                      : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
                  }`}
                >
                  <Icon className="inline-block w-4 h-4 mr-1" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-xs text-gray-500 font-mono mb-6">
          {filteredDocs.length} {filteredDocs.length === 1 ? "Dokument" : "Dokumente"} gefunden
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border border-gray-800 bg-black/50 rounded-lg overflow-hidden hover:border-[#bf953f]/50 transition-all duration-300"
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
            >
              {/* Document Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl flex-shrink-0">{doc.icon}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-[#bf953f] uppercase tracking-wider">
                    {doc.type}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 leading-tight">
                    {doc.title}
                  </h3>
                </div>
              </div>

              {/* Meta Info */}
              <div className="space-y-1.5 mb-3">
                <p className="text-xs text-gray-400">
                  <span className="text-gray-500">Kategorie:</span>{" "}
                  <span className="text-[#bf953f] capitalize">{doc.category}</span>
                </p>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-500">Datum:</span> {doc.date}
                </p>
              </div>

              {/* Preview */}
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {doc.preview}
              </p>

              {/* Expand/Collapse Indicator */}
              <div className="flex items-center gap-1 text-xs text-[#bf953f] mb-3">
                {expandedDoc === doc.id ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Einklappen</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Details anzeigen</span>
                  </>
                )}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedDoc === doc.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-800">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#bf953f]/10 border border-[#bf953f]/30 rounded-lg hover:bg-[#bf953f]/20 transition-all group"
                      >
                        <FileText className="w-5 h-5 text-[#bf953f] group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-[#bf953f]">
                          Dokument öffnen
                        </span>
                        <ExternalLink className="w-4 h-4 text-[#bf953f] group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredDocs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Keine Dokumente gefunden</h3>
          <p className="text-sm text-gray-400">
            Versuche andere Suchbegriffe oder Filter
          </p>
        </div>
      )}

      {/* Footer with License Info */}
      <div className="mt-16 pt-8 border-t border-gray-800">
        <div className="caro-license-checkerboard p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scale className="w-6 h-6 text-[#bf953f]" />
              <h3 className="text-xl font-bold text-white">
                ⚖️ EIGENTUMSRECHTLICHE LIZENZ
              </h3>
            </div>
            <p className="text-lg font-black text-[#bf953f]">
              ALLE RECHTE VORBEHALTEN
            </p>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div>
              <h4 className="text-[#bf953f] font-bold mb-1">HCOS – HNOSS CONTROL OPERATING SYSTEM</h4>
            </div>

            <div>
              <h5 className="text-gray-400 font-semibold mb-1">URHEBERRECHTSHINWEIS:</h5>
              <p>Copyright © 2024–2026 Daniel Pohl. Alle Rechte weltweit vorbehalten.</p>
            </div>

            <div>
              <h5 className="text-gray-400 font-semibold mb-1">EIGENTUMS- UND SCHUTZRECHTE:</h5>
              <p>
                Diese Software, einschließlich Quellcode, Dokumentation, Algorithmen und Architekturdesigns,
                ist das exklusive Eigentum von Daniel Pohl sowie der folgenden autorisierten Unternehmen:
              </p>
              <p className="text-white font-bold mt-1">
                HNOSS Enterprises | PRISMANTHARION Corporation | SHINEHEALTHCARE GmbH | STARLIGHTMOVEMENTS AG
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-700">
              <div>
                <h5 className="text-red-400 font-semibold mb-2">NUTZUNGSBESCHRÄNKUNGEN:</h5>
                <ul className="space-y-1 text-gray-400">
                  <li>❌ KEINE NUTZUNG ohne ausdrückliche Genehmigung</li>
                  <li>❌ KEINE KOPIEN oder Duplizierung</li>
                  <li>❌ KEINE ÄNDERUNGEN oder abgeleitete Werke</li>
                  <li>❌ KEINE VERBREITUNG oder Weitergabe</li>
                  <li>❌ KEIN KLONEN von Repositories</li>
                  <li>❌ KEINE REVERSE-ENGINEERING</li>
                </ul>
              </div>

              <div>
                <h5 className="text-yellow-400 font-semibold mb-2">RECHTSSTATUS:</h5>
                <p className="text-gray-400 mb-2">
                  Pilotprojekt in Zusammenarbeit mit:
                </p>
                <ul className="space-y-1 text-gray-400">
                  <li>🏛️ Institutionen der Europäischen Union</li>
                  <li>🛡️ NATO (North Atlantic Treaty Organization)</li>
                  <li>🏢 The Pentagon / U.S. Department of Defense</li>
                  <li>🌐 Vereinte Nationen (UN)</li>
                  <li>💰 Deutsche Börse AG</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-700">
              <h5 className="text-cyan-400 font-semibold mb-2">SCHUTZ DES GEISTIGEN EIGENTUMS:</h5>
              <p className="text-gray-400">
                Geschützt durch: Internationales Urheberrecht, EU-Urheberrechtsrichtlinien, US Copyright Act,
                Deutsches Urheberrechtsgesetz (UrhG), Patentrecht, GeschGehG, Vertragsrecht
              </p>
            </div>

            <div className="pt-3 border-t border-red-900/50">
              <h5 className="text-red-400 font-semibold mb-2">⚠️ VERSTÖSSE UND RECHTSVERFOLGUNG:</h5>
              <p className="text-gray-400">
                Unbefugte Nutzung wird mit voller Härte des Gesetzes verfolgt – zivilrechtliche Schadensersatzforderungen,
                einstweilige Verfügungen, strafrechtliche Verfolgung sowie Meldung an INTERPOL.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-700 text-center">
              <p className="text-gray-500 font-mono">
                Kontakt: Rechtsabteilung – HNOSS Enterprises
              </p>
              <p className="text-gray-600 font-mono mt-1">
                Status: KLASSIFIZIERT – PILOTPROJEKT – NICHT FÜR DIE ÖFFENTLICHE VERBREITUNG
              </p>
              <p className="text-gray-600 font-mono text-[10px] mt-2">
                Version: PILOT-2026-EU-NATO-CLASSIFIED | Datum: 1. Januar 2024 | Letzte Änderung: 9. Mai 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
