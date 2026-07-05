import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Download, Share2, Copy, FileText, Lightbulb, BookOpen, Cpu, Info, FileCheck, Scale, Zap } from "lucide-react";

// Paper categories matching the required types
const CATEGORIES = [
  { id: "all", label: "Alle Papers", icon: FileText },
  { id: "architect", label: "Architect Paper", icon: BookOpen },
  { id: "white", label: "White Paper", icon: Lightbulb },
  { id: "concept", label: "Concept Paper", icon: Zap },
  { id: "technical", label: "Technical Paper", icon: Cpu },
  { id: "informations", label: "Informations Paper", icon: Info },
  { id: "one", label: "One Paper", icon: FileCheck },
  { id: "executive", label: "Executive Paper", icon: Scale },
  { id: "protocol", label: "Protocol Paper", icon: FileCheck }
];

// All papers classified by category
const PAPERS = [
  {
    id: "paper-01",
    title: "Vergebung, Freiheit, Frieden, Nächstenliebe, Hoffnung und Zuversicht",
    author: "Daniel Pohl (State Flow Wish)",
    date: "19. März 2026",
    source: "analysis/01-vergebung-freiheit-frieden.md",
    type: "White Paper",
    category: "white",
    abstract: "Philosophische Grundlagen der Genesis-Protokoll-Architektur. Eine umfassende Analyse der anthropologischen und spirituellen Grundlagen, die die ethische Grundlage für infrastrukturelle Menschenrechte bilden.",
    icon: "💖"
  },
  {
    id: "paper-02",
    title: "One Peace 4 World – Internationale Botschaft von Frieden, Liebe und Hoffnung",
    author: "Daniel Pohl (State Flow Wish)",
    date: "17. Januar 2026",
    source: "analysis/03-one-peace-4-world.md",
    type: "One Paper",
    category: "one",
    abstract: "Eine weltweite Botschaft an alle Zivilisationen, Glaubensrichtungen und Wesen. Eine umfassende Friedensmission, die PNIA als Instrument für globale Versöhnung und regenerativen Frieden vorschlägt.",
    icon: "☮️"
  },
  {
    id: "paper-03",
    title: "Gründungscharta: WorldBanks EyesAether – Der Peace-Cycle",
    author: "Daniel Pohl",
    date: "21. Januar 2026",
    source: "analysis/02-gruendungscharta-worldbanks-eyesaether.md",
    type: "Concept Paper",
    category: "concept",
    abstract: "Systemische Architektur-Konzepte für die Transformation von Infrastruktur, Governance und sozialen Systemen. Der Peace-Cycle als zentrales Betriebssystem für die WorldBanks EyesAether-Infrastruktur.",
    icon: "📜"
  },
  {
    id: "paper-04",
    title: "Menschenleben vor Linien auf der Karte – Ein Plädoyer für eine humane Lösung",
    author: "Daniel Pohl",
    date: "27. Dezember 2025",
    source: "analysis/04-menschenleben-vor-linien.md",
    type: "White Paper",
    category: "white",
    abstract: "Technische Policy-Grundlagen für humane Infrastruktur-Entscheidungen. Definition des Menschen als primäre Einheit aller Berechnungen und Etablierung von gegenkritischen Schutzmechanismen für zivilisatorische Systeme.",
    icon: "🕊️"
  },
  {
    id: "paper-05",
    title: "Manifest der Synchronen Transformation – Strategische Entscheidungsgrundlage",
    author: "🌌Orbit's Tunes🪄 (Daniel Pohl)",
    date: "26. Oktober 2025",
    source: "analysis/07-manifest-synchrone-transformation.md",
    type: "Executive Paper",
    category: "executive",
    abstract: "Strategische Entscheidungsgrundlage für Regierungen und Institutionen. Ein systemischer Wandel, der nicht an Kampfworten sondern an zeitbewussten, synchronisierten Übergängen orientiert ist.",
    icon: "📜"
  },
  {
    id: "paper-06",
    title: "Von Buße und Heilung begleitet – Heilige Pferde und Pferdeheilige",
    author: "Daniel Pohl",
    date: "2. November 2025",
    source: "analysis/05-von-busse-und-heilung.md",
    type: "Protocol Paper",
    category: "protocol",
    abstract: "Formelle Protokolle und Verfahrensregeln für spirituelle Traditionen und symbolische Handlungen. Eine umfassende Zusammenstellung von über 160+ heiligen Pferden und Pferdeheiligen mit historischen und mythologischen Bezügen.",
    icon: "🐴"
  },
  {
    id: "paper-07",
    title: "World Social Nature Way – Weltweite Sozial-Natur-Architektur",
    author: "Daniel Pohl",
    date: "27. Dezember 2025",
    source: "analysis/06-world-social-nature-way.md",
    type: "Informations Paper",
    category: "informations",
    abstract: "Öffentlichkeitswirksame Darstellung der sozialen und natürlichen Dimensionen der Genesis-Protokoll-Architektur. Verbindet ökologische Nachhaltigkeit mit sozialer Gerechtigkeit für technische Systeme im Einklang mit natürlichen Systemen.",
    icon: "🌍"
  },
  {
    id: "paper-08",
    title: "Protokoll Infrastruktur-Implementierung – Genesis-Protokoll Spezifikation",
    author: "Daniel Pohl (Strategic Infrastructure Architect)",
    date: "4. Juli 2026",
    source: "public/documents/protocol-implementation.txt",
    type: "Technical Paper",
    category: "technical",
    abstract: "Technische Spezifikation des Genesis-Protokolls und der Production Network ID Architecture (PNIA). Enthält Schnittstellen-Definitionen, kryptographische Algorithmen, Datenmodelle und Integrations-Richtlinien für NATO, EU und UN-Systeme.",
    icon: "⚙️"
  },
  {
    id: "paper-09",
    title: "NATO PAPER – Community of Interest (COI) Registrierung",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "public/documents/nato-paper.txt",
    type: "Registrierungs-Papier",
    category: "architect",
    abstract: "Formelle Registrierung für NATO-MILMED-COE-Communities. Etablierung der D-U-N-S-Registry, VAT-ID, UNGM/PIC und Global-LEI-Identifikationssysteme für militärische und humanitäre Portale.",
    icon: "🏛️"
  },
  {
    id: "paper-10",
    title: "WorldWide Structur – Globale Governance-Architektur",
    author: "Daniel Pohl (Copyright Daniel Pohl by. Hnoss - ShineHealthCare from EU-UNION)",
    date: "2026",
    source: "public/documents/worldwide-structur.txt",
    type: "Architektur-Papier",
    category: "architect",
    abstract: "Globale Referenzsysteme und Governance-Architektur für das HNOSS Identity Grid. Definition der CNP-System-Spektren und registry-integrierten Identifikationsstandards für NATO, EU, Pentagon und UN.",
    icon: "🌐"
  }
];

// Papers Archive Component
export default function PapersArchive() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const filteredPapers = PAPERS.filter(paper => {
    const matchesCategory = selectedCategory === "all" || paper.category === selectedCategory;
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          📚 Papers <span className="text-[#bf953f]">Archive</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-3xl mx-auto mb-8">
          Wissenschaftliche Dokumentation, Konzepte und Architektur-Papiere des HNOSS Systems
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="🔍 Papers durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#bf953f] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 border rounded text-xs font-mono uppercase tracking-wider transition-all ${
                    selectedCategory === category.id
                      ? "border-[#bf953f] bg-[#bf953f]/25 text-white"
                      : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
                  }`}
                >
                  <Icon className="inline-block w-4 h-4 mr-1" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-xs text-gray-500 font-mono mb-6">
          {filteredPapers.length} {filteredPapers.length === 1 ? "Paper" : "Papers"} gefunden
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="border border-gray-800 bg-black/50 rounded-lg p-6 hover:border-[#bf953f]/50 transition-all duration-300 cursor-pointer"
            onClick={() => setExpandedPaper(expandedPaper === paper.id ? null : paper.id)}
          >
            {/* Paper Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{paper.icon}</div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-[#bf953f] uppercase tracking-wider">
                  {paper.type}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-tight">
                  {paper.title}
                </h3>
              </div>
            </div>

            {/* Paper Meta */}
            <div className="space-y-1.5 mb-4">
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">Autor:</span> {paper.author}
              </p>
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">Datum:</span> {paper.date}
              </p>
            </div>

            {/* Abstract */}
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {paper.abstract}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`/documents/analysis/${paper.id.split('-')[1]}.md`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-center px-3 py-2 border border-[#bf953f]/30 text-[#bf953f] text-xs rounded hover:bg-[#bf953f]/10 transition-all"
              >
                📄 Lesen
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Download-Funktion kommt bald!');
                }}
                className="px-3 py-2 border border-gray-700 text-gray-400 text-xs rounded hover:border-gray-600 hover:text-white transition-all"
              >
                ⬇️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredPapers.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Keine Papers gefunden</h3>
          <p className="text-sm text-gray-400">
            Versuche andere Suchbegriffe oder Filter
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500 font-mono">
          Papers Archive · Version 1.0 · 2026 · Autor: Daniel Pohl
          <br />
          Alle Rechte vorbehalten · HNOSS™ Identity · © 2026
        </p>
      </div>
    </div>
  );
}