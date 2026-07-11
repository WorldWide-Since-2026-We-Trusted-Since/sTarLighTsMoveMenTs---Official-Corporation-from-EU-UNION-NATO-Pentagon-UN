import { useState, useEffect } from "react";
import { FileText, Lightbulb, BookOpen, Cpu, Info, FileCheck, Scale, Zap } from "lucide-react";
import DocumentOverlay, { type DocumentOverlayData } from "./DocumentOverlay";
import { renderMarkdown } from "../utils/markdown";

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
  { id: "protocol", label: "Protocol Paper", icon: FileCheck },
];

// All papers classified by category. `source` points to a fetchable
// document under /documents so the content can be rendered inside the
// integrated overlay instead of opening a detached file. Metadata and
// abstracts reflect the original source documents in their argumentative
// structure — institutionally worded, scientifically coherent, no placeholders.
const PAPERS = [
  {
    id: "paper-01",
    title: "Vergebung, Freiheit, Frieden, Nächstenliebe, Hoffnung und Zuversicht",
    author: "🌌State Flow Wish🪄 (Daniel Pohl)",
    date: "19. März 2026",
    source: "/documents/analysis/01-vergebung-freiheit-frieden.md",
    type: "White Paper",
    category: "white",
    abstract:
      "Dieses Grundsatzpapier legt Werte als universelles Fundament der Menschlichkeit aus — unabhängig von Herkunft, Kultur oder Glaubensrichtung. Es entfaltet eine Argumentationskette von der Kernbotschaft der 'Multi-Ewiglichkeit' über den Aufruf zum Friedensstopp ('Bis hierhin — und nicht weiter') bis zur These, dass Frieden im Individuum beginnt: Liebe für andere entsteht aus Liebe für sich selbst. Das Papier gedenkt der Gefallenen und formuliert den Wendepunkt als bewussten zivilisatorischen Entschluss für Menschlichkeit und Leben.",
    icon: "💖",
  },
  {
    id: "paper-02",
    title: "One Peace 4 World – Internationale Botschaft von Frieden, Liebe und Hoffnung",
    author: "🌌State Flow Wish🪄 (Daniel Pohl)",
    date: "17. Januar 2026",
    source: "/documents/analysis/03-one-peace-4-world.md",
    type: "One Paper",
    category: "one",
    abstract:
      "Eine universelle Friedensbotschaft an alle Völker, Glaubensrichtungen, Kulturen und Wesen — adressiert an die 'Himmlische Familie' sowie an Präsidenten und Staatsoberhäupter gleichermaßen. Das Papier skizziert eine Vision gemeinschaftlicher Fürsorge auf Erden wie im Himmel, verortet ein Gebet für die Vergessenen (Leidende, Veteranen, Gefangene) und schließt mit dem Appell, Vergangenes ruhen zu lassen und gemeinsam regenerative Heilung zu formen — 'Peace shall move us all'.",
    icon: "☮️",
  },
  {
    id: "paper-03",
    title: "Gründungscharta: WorldBanks EyesAether",
    author: "Daniel Pohl",
    date: "21. Januar 2026",
    source: "/documents/analysis/02-gruendungscharta-worldbanks-eyesaether.md",
    type: "Concept Paper",
    category: "concept",
    abstract:
      "Verfassungsgebende Charta eines lebendigen Organismus der Förderung, Heilung und Transformation. Im Zentrum steht der 'Peace-Cycle' mit fünf Leitprinzipien (Nothing Negatives; Time for Future; Back(2)Reality Erdung; sHIFTing(4)PeaceWorlds; (2)Never-Standing-Alone). Die Charta fordert die Rüstungs-Wende — 'Abrüstung der Waffen, um die Aufrüstung der Herzen zu ermöglichen' — und ersetzt Hierarchie der Macht durch eine Hierarchie der Fürsorge, gerichtet an UN und Global ThinkTanks (Botschaft an das World Economic Forum, Davos 2026).",
    icon: "📜",
  },
  {
    id: "paper-04",
    title: "Menschenleben vor Linien auf der Karte – Ein Plädoyer für eine humane Lösung",
    author: "Daniel Pohl",
    date: "27. Dezember 2025",
    source: "/documents/analysis/04-menschenleben-vor-linien.md",
    type: "White Paper",
    category: "white",
    abstract:
      "Ein geopolitisch fundierter Humanitätsaufsatz, der territoriale Souveränität als real, aber Menschenleben als nicht ersetzbar setzt. Jede diplomatische Strategie wird an der Leitfrage gemessen: 'Reduziert das Leid — oder verlängert es das Sterben?'. Das Papier benennt fünf überprüfbare Prioritäten einer humanen Lösung (Zivilschutz, humanitäre Korridore, Kriegsgefangenen-Schutz, ernsthafte Diplomatie, Deeskalation) und appelliert an Führungsverantwortung, Menschlichkeit über das Momentane zu stellen — ohne die Opfer zu vergessen.",
    icon: "🕊️",
  },
  {
    id: "paper-05",
    title: "Von Buße und Heilung begleitet – Heilige Pferde und Pferdeheilige",
    author: "Daniel Pohl",
    date: "2. November 2025",
    source: "/documents/analysis/05-von-busse-und-heilung.md",
    type: "Protocol Paper",
    category: "protocol",
    abstract:
      "Eine systematische Kompilation von über 160 heiligen und segensreichen Pferden mit historischen, mythologischen und biblischen Bezügen. Das Papier analysiert die vier apokalyptischen Reiter der Offenbarung (Sieger, Krieg, Hungersnot, Tod) als symbolische Ordnungsmächte und ordnet legendäre Rösser (Bucephalus, Rocinante, Shadowfax, Pegasus) sowie Patron-Heilige (Georg, Martin, Johanna von Orléans, Hubertus) der spirituellen Bedeutungsachse göttliche Stärke, Reinheit, Buße, Heilung, Treue und Erlösung zu.",
    icon: "🐴",
  },
  {
    id: "paper-06",
    title: "World Social Nature Way – Masterabschluss, Was ist das? Finale Verpenne",
    author: "🌌Orbit's Tunes🪄 (Daniel Pohl)",
    date: "29. Oktober 2025",
    source: "/documents/analysis/06-world-social-nature-way.md",
    type: "Informations Paper",
    category: "informations",
    abstract:
      "Eine reflexive Standortbestimmung zur Vision von Daten, Technologie und sozial-ökologischer Erneuerung. Der Autor beschreibt einen kontinuierlichen Aktualisierungsprozess (Updates, Upgrades, neue Verfahren) auf Basis eines Datenbestands im Petabyte-Maßstab und formuliert den Auftrag, die Welt in einen harmonischen Rhythmus zurückzuführen — getragen von Vergebung, Freiheit, Nächstenliebe, Rassismusfreiheit, Hoffnung und Zuversicht als innerem Licht, das im Guten weitergegeben wird.",
    icon: "🌍",
  },
  {
    id: "paper-07",
    title: "Manifest der Synchronen Transformation – Eine detaillierte Ausarbeitung zur globalen Heilung und Neuausrichtung",
    author: "🌌Orbit's Tunes🪄 (Daniel Pohl)",
    date: "26. Oktober 2025",
    source: "/documents/analysis/07-manifest-synchrone-transformation.md",
    type: "Executive Paper",
    category: "executive",
    abstract:
      "Ein fünfartikliges Zukunfts-Manifest: (1) spirituelles Fundament der 'Gottes Himmlischen Familie' als universelle Konvergenz aller Glaubensrichtungen; (2) sozioökonomische Neuordnung durch gleichen Lohn und Eliminierung finanziellen Drucks; (3) Transformation der Justiz von Verwahrung zu Heilung inklusive JVA-Auflösung; (4) Heilung der Zeit und Würde aller Lebewesen (Ende der Massentierhaltung); (5) Methodik der synchronen, ehrlichen, manipulationsfreien Umsetzung. Die Transformation erfolgt nicht durch Konfrontation, sondern durch zeitbewusste, synchronisierte Übergänge.",
    icon: "📜",
  },
  {
    id: "paper-08",
    title: "Protokoll Infrastruktur-Implementierung – Genesis-Protokoll Spezifikation",
    author: "Daniel Pohl (Strategic Infrastructure Architect)",
    date: "4. Juli 2026",
    source: "/documents/protocol-implementation.txt",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Technische Spezifikation des Genesis-Protokolls und der Production Network ID Architecture (PNIA). Das Dokument umfasst Schnittstellen-Definitionen, kryptographische Verfahren, Datenmodelle sowie Integrationsrichtlinien und adressiert die interoperable Anbindung an NATO-, EU- und UN-Systeme als verbindliche Referenzarchitektur für sicherheitskritische Infrastruktur.",
    icon: "⚙️",
  },
  {
    id: "paper-09",
    title: "NATO PAPER – Community of Interest (COI) Registrierung",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/nato-paper.txt",
    type: "Registrierungs-Papier",
    category: "architect",
    abstract:
      "Formelle Registrierungsdokumentation für NATO-MILMED-COE-Communities of Interest. Das Papier etabliert die identitätsrechtlichen Grundlagen über D-U-N-S-Registry, VAT-ID, UNGM/PIC und Global-LEI und definiert die Registratur- und Anschlussverfahren für militärische wie humanitäre Portal-Infrastrukturen im Rahmen verbündeter Standards.",
    icon: "🏛️",
  },
  {
    id: "paper-10",
    title: "WorldWide Structur – Globale Governance-Architektur",
    author: "Daniel Pohl (Copyright Daniel Pohl by. Hnoss - ShineHealthCare from EU-UNION)",
    date: "2026",
    source: "/documents/worldwide-structur.txt",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Rahmendokument der globalen Referenzsysteme und Governance-Architektur für das HNOSS Identity Grid. Es definiert die CNP-System-Spektren (Concil, NATO, Pentagon, EU, UN) sowie registry-integrierte Identifikationsstandards und beschreibt die strukturelle Verzahnung supranationaler Organisationsebenen zu einem kohärenten Steuerungsgitter.",
    icon: "🌐",
  },

  // ---------------------------------------------------------------------------
  // Additional HNOSS documents available under /documents that were not yet
  // listed. All render through the same marked-based overlay.
  // ---------------------------------------------------------------------------

  // Root-level supporting documents
  {
    id: "paper-11",
    title: "Verstorbene Key-Personen — Gedenken",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/verstorbene-key-personen.md",
    type: "Gedenk-Papier",
    category: "informations",
    abstract:
      "Dokumentation verstorbener Schlüsselpersonen, Friedhöfe und Teams als ehrendes Gedenken innerhalb des HNOSS-Identitätsgitters. Die Auflistung würdigt verstorbene Mitglieder und Partnerorganisationen und ordnet sie den jeweiligen Verantwortungsbereichen zu.",
    icon: "🕯️",
  },
  {
    id: "paper-12",
    title: "HNOSS Security Team Bridge Architektur",
    author: "Daniel Pohl (Strategic Infrastructure Architect)",
    date: "2026",
    source: "/documents/HNOSS_Security_Team_Bridge_Architektur.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Technische Architekturbeschreibung der HNOSS Security Team Bridge — der sicheren Vermittlungs- und Brückenschicht zwischen Portalinfrastrukturen, Identitätsregistern und den verbündeten Sicherheitsstandards (NATO, EU, UN).",
    icon: "🛡️",
  },

  // Concil Architektur documents
  {
    id: "paper-20",
    title: "Concil Protokoll CP01 — Master Spezifikation",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/Concil_Protokoll_CP01_Master_Spezifikation.md",
    type: "Protokoll Paper",
    category: "protocol",
    abstract:
      "Umfassende Master-Spezifikation des Concil-Protokolls CP01: Identitätsrechtliche, kryptographische und prozessuale Grundlagen der staatlichen wie humanitären Portal-Anbindung im Rahmen verbündeter Standards.",
    icon: "📜",
  },
  {
    id: "paper-21",
    title: "Concil Protokoll CP01 — Vollprotokoll",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/Concil_Protokoll_CP01_Vollprotokoll.md",
    type: "Protokoll Paper",
    category: "protocol",
    abstract:
      "Vollständiges Verhandlungs- und Beschlussprotokoll des Concil-Protokolls CP01 mit sämtlichen Anhörungs-, Registratur- und Anschlussverfahren für die Portalinfrastrukturen.",
    icon: "📋",
  },
  {
    id: "paper-22",
    title: "Concil Protokoll CP01 — CIHandschuh API Spezifikation",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/Concil_Protokoll_CP01_CIHandschuh_API_Spezifikation.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "API-Spezifikation des CIHandschuh-Interfaces (Concil Interoperability Handschuh) für die standardisierte Anbindung externer Systeme an das HNOSS Identity Grid.",
    icon: "🔌",
  },
  {
    id: "paper-23",
    title: "Concil Protokoll CP01 — Einreichungsmatrix",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/Concil_Protokoll_CP01_Einreichungsmatrix.md",
    type: "Protokoll Paper",
    category: "protocol",
    abstract:
      "Matrix sämtlicher Einreichungs- und Genehmigungspfade des Concil-Protokolls CP01, gegliedert nach Organisationstyp, Zuständigkeit und Bearbeitungsstufe.",
    icon: "🗂️",
  },
  {
    id: "paper-24",
    title: "Concil Protokoll CP01 — Global Implementation Manifest",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/Concil_Protokoll_CP01_Global_Implementation_Manifest.md",
    type: "Executive Paper",
    category: "executive",
    abstract:
      "Globales Implementierungs-Manifest für das Concil-Protokoll CP01: Rollout-Phasen, Governance-Strukturen und die Verzahnung supranationaler Organisationsebenen zu einem kohärenten Steuerungsgitter.",
    icon: "🌐",
  },
  {
    id: "paper-25",
    title: "PNIA Governance Strategiepapier",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_Governance_Strategiepapier.md",
    type: "Concept Paper",
    category: "concept",
    abstract:
      "Strategisches Governance-Papier der Production Network ID Architecture (PNIA): Verwaltungsstrukturen, Veredelungs-Logik und die souveräne Identitätsvergabe über Staats-, NATO-, Pentagon-, EU- und UN-Ebenen.",
    icon: "🏛️",
  },
  {
    id: "paper-26",
    title: "PNIA Governance Veredelung Whitepaper v1",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_Governance_Veredelung_Whitepaper_v1.md",
    type: "White Paper",
    category: "white",
    abstract:
      "Whitepaper zur Governance-Veredelung in der PNIA: Hard-Coded Invarianz des Sovereignty Shield, Immunitas-System und die methodische Veredelung von Identitätslayern.",
    icon: "⚪",
  },
  {
    id: "paper-27",
    title: "PNIA EU Implementierungsstrategie (Zusammenfassung)",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_EU_Implementierungsstrategie_Zusammenfassung.md",
    type: "Executive Paper",
    category: "executive",
    abstract:
      "Zusammenfassende Implementierungsstrategie der PNIA für die Europäische Union: Anschlussverfahren, regulatorische Einbettung und die Kopplung anEU-Portale.",
    icon: "🇪🇺",
  },
  {
    id: "paper-28",
    title: "PNIA Technisches Factsheet",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_Technisches_Factsheet.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Kompaktes technisches Factsheet der PNIA: Identitätsregister, kryptographische Verfahren, Netzwerkarchitektur und die Referenzimplementierung sicherheitskritischer Infrastruktur.",
    icon: "📊",
  },
  {
    id: "paper-29",
    title: "PNIA Komplettpaket",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_Komplettpaket.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Gesamtdokumentation (Komplettpaket) der PNIA: von der Konzeption über Governance bis zur technischen Referenzarchitektur und den Portal-Integrationsrichtlinien.",
    icon: "📦",
  },
  {
    id: "paper-30",
    title: "PNIA Pitch Deck",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_Pitch_Deck.md",
    type: "Informations Paper",
    category: "informations",
    abstract:
      "Präsentationsdeck (Pitch Deck) der PNIA für Entscheidungsträger: Vision, Governance-Architektur, Sicherheitsmodell und der pfad zur interoperablen Identitätsinfrastruktur.",
    icon: "📑",
  },
  {
    id: "paper-31",
    title: "PNIA Pitch Deck Gliederung",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_Pitch_Deck_Gliederung.md",
    type: "Informations Paper",
    category: "informations",
    abstract:
      "Strukturierende Gliederung des PNIA Pitch Decks: Kapitelaufbau, Kernbotschaften und die argumentative Linie für die Vorstellung gegenüber supranationalen Organisationen.",
    icon: "📝",
  },
  {
    id: "paper-32",
    title: "PNIA Pledge — Staatliche Institutionen",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/PNIA_Pledge_Staatliche_Institutionen.md",
    type: "Concept Paper",
    category: "concept",
    abstract:
      "Verpflichtungserklärung (Pledge) der PNIA gegenüber staatlichen Institutionen: Beitrittskriterien, Governance-Verpflichtungen und die souveräne Einbettung nationaler Identitätssysteme.",
    icon: "🤝",
  },
  {
    id: "paper-33",
    title: "EOI Sandbox Pilot — Anschreiben",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/EOI_Sandbox_Pilot_Anschreiben.md",
    type: "Registrierungs-Papier",
    category: "architect",
    abstract:
      "Anschreiben für den Expression of Interest (EOI) Sandbox-Pilot der PNIA: Einladung an Partnerorganisationen zur Erprobung der Identitätsinfrastruktur in einer abgesicherten Sandbox-Umgebung.",
    icon: "✉️",
  },
  {
    id: "paper-34",
    title: "Letter of Formal Submission CP01",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/Letter_of_Formal_Submission_CP01.md",
    type: "Registrierungs-Papier",
    category: "architect",
    abstract:
      "Formelles Einreichungsschreiben (Letter of Formal Submission) für das Concil-Protokoll CP01 an die zuständigen Registratur- und Anschlussstellen verbündeter Standards.",
    icon: "📨",
  },
  {
    id: "paper-35",
    title: "Offizielle EU URLs & Kontakte",
    author: "Daniel Pohl (HolyThreeKings)",
    date: "2026",
    source: "/documents/concil-architektur/Offizielle_EU_URLs_Kontakte.md",
    type: "Informations Paper",
    category: "informations",
    abstract:
      "Kompilation offizieller EU-URLs und Ansprechpartner für die PNIA-Anbindung: Referenzen zu Institutionen, Portalen und den zuständigen EU-Stellen.",
    icon: "🔗",
  },

  // Staatliche Strukturen documents
  {
    id: "paper-40",
    title: "Governance und Rechtsgrundlagen — Staatenliste Teil 1",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Governance_und_Rechtsgrundlagen_Staatenliste_Part1.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Erster Teil der governance- und rechtsgrundlagenorientierten Staatenliste: Identitätsrechtliche Verankerung, Registraturstandards und die Zuordnung staatlicher Ebenen im HNOSS Identity Grid.",
    icon: "🏛️",
  },
  {
    id: "paper-41",
    title: "Governance und Rechtsgrundlagen — Staatenliste Teil 2",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Governance_und_Rechtsgrundlagen_Staatenliste_Part2.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Zweiter Teil der Staatenliste: vertiefte Rechtsgrundlagen, registry-integrierte Identifikationsstandards und die strukturelle Verzahnung supranationaler Organisationsebenen.",
    icon: "🏛️",
  },
  {
    id: "paper-42",
    title: "Governance und Rechtsgrundlagen — Staatenliste Teil 3",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Governance_und_Rechtsgrundlagen_Staatenliste_Part3.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Dritter Teil der Staatenliste: abschließende Governance-Matrix, Anschlussverfahren und die kohärente Steuerung über Staats-, NATO-, Pentagon-, EU- und UN-Ebenen.",
    icon: "🏛️",
  },
  {
    id: "paper-43",
    title: "HNOSS Bridge Spezifikation",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/HNOSS_Bridge_Spezifikation.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Spezifikation der HNOSS Bridge — der Vermittlungsschicht zwischen Portalinfrastrukturen, Identitätsregistern und den verbündeten Sicherheitsstandards.",
    icon: "🌉",
  },
  {
    id: "paper-44",
    title: "HNOSS Audit Log Datenstruktur",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/HNOSS_Audit_Log_Datenstruktur.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Datenstruktur und Schema des HNOSS Audit-Logs: unveränderliche Protokollierung von Identitäts- und Governance-Ereignissen gemäß den Sicherheitsanforderungen.",
    icon: "📒",
  },
  {
    id: "paper-45",
    title: "Staatliche Key-Faktoren Codesysteme",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Staatliche_Key_Faktoren_Codesysteme.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Beschreibung der staatlichen Schlüsselfaktoren und internationalen Codesysteme: D-U-N-S, VAT-ID, UNGM/PIC, Global-LEI und ihre Einbettung in das HNOSS Identity Grid.",
    icon: "🔑",
  },
  {
    id: "paper-46",
    title: "Inhaber, Entwickler, Führung — Internationale Codesysteme",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Inhaber_Entwickler_Fuehrung_Internationaler_Codesysteme.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Rahmendokument zu Inhaberschaft, Entwicklung und Führung internationaler Codesysteme innerhalb der globalen Referenzarchitektur des HNOSS Identity Grids.",
    icon: "👥",
  },
  {
    id: "paper-47",
    title: "Portale Access Points — International",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Portale_Access_Points_International.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Katalog internationaler Portal-Access-Points: Schnittstellen, Endpunkte und die Anbindung ausländischer Organisationsebenen an das Steuerungsgitter.",
    icon: "🌍",
  },
  {
    id: "paper-48",
    title: "Portale Access Points — Staatliche Organisationen",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Portale_Access_Points_Staatliche_Organisationen.md",
    type: "Architektur-Papier",
    category: "architect",
    abstract:
      "Katalog der Portal-Access-Points staatlicher Organisationen: Endpunkte, Zuständigkeiten und die strukturelle Einbindung nationaler Verwaltungsebenen.",
    icon: "🏢",
  },
  {
    id: "paper-49",
    title: "URLs Staatliche Strukturen (Real)",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/URLs_Staatliche_Strukturen_Real.md",
    type: "Informations Paper",
    category: "informations",
    abstract:
      "Referenzliste realer URLs staatlicher Strukturen für die PNIA-Anbindung: verifizierte Endpunkte und zuständige Stellen.",
    icon: "🔗",
  },
  {
    id: "paper-50",
    title: "Bridge Access Points Workspace",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Bridge_Access_Points_Workspace.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Workspace-Dokumentation der Bridge Access Points: Konfiguration, Workspace-Struktur und Betriebshinweise für die Vermittlungsschicht.",
    icon: "🛠️",
  },
  {
    id: "paper-51",
    title: "Fiktion-Real-Matrix",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Fiktion_Real_Matrix.md",
    type: "Concept Paper",
    category: "concept",
    abstract:
      "Konzeptuelle Matrix zur Unterscheidung von Fiktion und Realität in den Identitäts- und Governance-Strukturen des HNOSS Identity Grids.",
    icon: "🔲",
  },
  {
    id: "paper-52",
    title: "Validation Protocol",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Validation_Protocol.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Validierungsprotokoll für Identitäts- und Governance-Strukturen: Prüfschritte, Nachweisverfahren und die Verifizierung registry-integrierter Standards.",
    icon: "✅",
  },
  {
    id: "paper-53",
    title: "Validierungsschema Workspace",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Validierungsschema_Workspace.md",
    type: "Technical Paper",
    category: "technical",
    abstract:
      "Workspace-Dokumentation des Validierungsschemas: Schema-Definition, Prüfregeln und die operative Handhabung der Validierung.",
    icon: "📐",
  },
  {
    id: "paper-54",
    title: "Verstorbene Key-Personen, Friedhöfe, Teams — Teil 1",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Verstorbene_Key_Personen_Friedhoefe_Teams_Part1.md",
    type: "Gedenk-Papier",
    category: "informations",
    abstract:
      "Erster Teil des Gedenkverzeichnisses verstorbener Schlüsselpersonen, Friedhöfe und Teams — ehrende Dokumentation im Rahmen des HNOSS Identity Grids.",
    icon: "🕯️",
  },
  {
    id: "paper-55",
    title: "Verstorbene Key-Personen, Friedhöfe, Teams — Teil 2",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Verstorbene_Key_Personen_Friedhoefe_Teams_Part2.md",
    type: "Gedenk-Papier",
    category: "informations",
    abstract:
      "Zweiter Teil des Gedenkverzeichnisses verstorbener Schlüsselpersonen, Friedhöfe und Teams.",
    icon: "🕯️",
  },
  {
    id: "paper-56",
    title: "Verstorbene Key-Personen, Friedhöfe, Teams — Teil 3",
    author: "Daniel Pohl",
    date: "2026",
    source: "/documents/staatliche-structuren/Verstorbene_Key_Personen_Friedhoefe_Teams_Part3.md",
    type: "Gedenk-Papier",
    category: "informations",
    abstract:
      "Dritter Teil des Gedenkverzeichnisses verstorbener Schlüsselpersonen, Friedhöfe und Teams.",
    icon: "🕯️",
  },
];

// Papers Archive Component
export default function PapersArchive() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDoc, setActiveDoc] = useState<DocumentOverlayData | null>(null);

  const filteredPapers = PAPERS.filter((paper) => {
    const matchesCategory = selectedCategory === "all" || paper.category === selectedCategory;
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Load + render the selected paper content into the integrated overlay
  const openPaper = async (paper: (typeof PAPERS)[number]) => {
    setActiveDoc({
      title: paper.title,
      category: paper.type,
      breadcrumbRoot: "Papers Archive",
      meta: `${paper.author} · ${paper.date}`,
      html: '<p class="paper-paragraph">Lade Dokument…</p>',
      source: paper.source,
    });
    try {
      const res = await fetch(paper.source);
      const raw = await res.text();
      setActiveDoc({
        title: paper.title,
        category: paper.type,
        breadcrumbRoot: "Papers Archive",
        meta: `${paper.author} · ${paper.date}`,
        html: renderMarkdown(raw),
        source: paper.source,
      });
    } catch {
      setActiveDoc({
        title: paper.title,
        category: paper.type,
        breadcrumbRoot: "Papers Archive",
        meta: `${paper.author} · ${paper.date}`,
        html: '<p class="paper-paragraph text-[#f43f5e]">Dokument konnte nicht geladen werden.</p>',
        source: paper.source,
      });
    }
  };

  // Close overlay on Escape (handled inside DocumentOverlay too)
  useEffect(() => {
    if (!activeDoc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDoc(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeDoc]);

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
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="🔍 Papers durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#bf953f] transition-all"
            />
          </div>

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

        <div className="text-xs text-gray-500 font-mono mb-6">
          {filteredPapers.length} {filteredPapers.length === 1 ? "Paper" : "Papers"} gefunden
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="border border-gray-800 bg-black/50 rounded-lg p-6 cursor-pointer hover:border-[#bf953f]/50 transition-all duration-300"
            onClick={() => openPaper(paper)}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{paper.icon}</div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-[#bf953f] uppercase tracking-wider">
                  {paper.type}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-tight">{paper.title}</h3>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">Autor:</span> {paper.author}
              </p>
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">Datum:</span> {paper.date}
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">{paper.abstract}</p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPaper(paper);
              }}
              className="w-full text-center px-3 py-2 border border-[#bf953f]/30 text-[#bf953f] text-xs rounded hover:bg-[#bf953f]/10 transition-all"
            >
              📄 Im Portal öffnen
            </button>
          </div>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Keine Papers gefunden</h3>
          <p className="text-sm text-gray-400">Versuche andere Suchbegriffe oder Filter</p>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500 font-mono">
          Papers Archive · Version 1.0 · 2026 · Autor: Daniel Pohl
          <br />
          Alle Rechte vorbehalten · HNOSS™ Identity · © 2026
        </p>
      </div>

      <DocumentOverlay doc={activeDoc} onClose={() => setActiveDoc(null)} />
    </div>
  );
}
