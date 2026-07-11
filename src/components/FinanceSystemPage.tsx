import { useState } from "react";

const FINANCE_PAGES = [
  {
    id: "projektuebersicht",
    title: "Projektübersicht",
    description: "Blockchain-Ökosystem in drei Säulen",
    url: "/finance-system/Projektuebersicht.html",
    icon: "📊"
  },
  {
    id: "gesamtkonzept",
    title: "Finance System Gesamtkonzept",
    description: "Enterprise-grade System für digitale Zahlungen",
    url: "/finance-system/FINANCE_SYSTEM_GESAMTKONZEPT_26.06.2026.html",
    icon: "🏦"
  },
  {
    id: "komplettes-konzept",
    title: "Komplettes Projekt-Konzept",
    description: "Vollständiges Gesamtkonzept von Daniel Pohl",
    url: "/finance-system/Komplett-Concept-26-06-2026-Daniel-Pohl.html",
    icon: "📋"
  },
  {
    id: "projekt-komplett",
    title: "Projekt Komplett",
    description: "Gesamtdokumentation 26.06.2026",
    url: "/finance-system/Projekt_Komplett_26062026_Daniel_Pohl.html",
    icon: "📁"
  },
  {
    id: "twin-taxi-asset",
    title: "Twin Taxi Asset",
    description: "Digitales Vermögensverwaltungssystem",
    url: "/finance-system/TWIN_TAXI_ASSET_KOMPLETTES_KONZEPT_26062026.html",
    icon: "🚕"
  },
  {
    id: "hnoss-website",
    title: "HNOSS Website",
    description: "Offizielle HNOSS-Korporationsseite",
    url: "/finance-system/HNOSS_WEBSITE.html",
    icon: "🌐"
  }
];

export default function FinanceSystemPage() {
  const [selectedPage, setSelectedPage] = useState(FINANCE_PAGES[0].id);

  const currentPage = FINANCE_PAGES.find(page => page.id === selectedPage) || FINANCE_PAGES[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Finance System <span className="text-cyan-400">Dokumentation</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Umfassende Dokumentation des Blockchain-Ökosystems und der digitalen Finanzinfrastruktur
        </p>
      </div>

      {/* Page Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {FINANCE_PAGES.map((page) => (
          <div
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
              selectedPage === page.id
                ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "border-gray-800 bg-black/50 hover:border-gray-600 hover:bg-black/70"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{page.icon}</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-1">{page.title}</h3>
                <p className="text-xs text-gray-400">{page.description}</p>
              </div>
              {selectedPage === page.id && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="border border-gray-800 bg-black/50 rounded-lg overflow-hidden">
        {/* Active Page Indicator */}
        <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-lg">{currentPage.icon}</span>
            <div>
              <h2 className="text-sm font-bold text-white">{currentPage.title}</h2>
              <p className="text-xs text-gray-400">{currentPage.description}</p>
            </div>
          </div>
          <a
            href={currentPage.url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-950/30 transition-all"
          >
            In neuem Tab öffnen ↗
          </a>
        </div>

        {/* Iframe Container */}
        <div className="w-full" style={{ height: "calc(100vh - 400px)", minHeight: "600px" }}>
          <iframe
            src={currentPage.url}
            className="w-full h-full border-0"
            title={currentPage.title}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 border border-gray-800 bg-black/30 rounded text-center">
        <p className="text-xs text-gray-500 font-mono">
          Finance System · Version 1.0 · 26.06.2026 · Autor: Daniel Pohl
          <br />
          Alle Rechte vorbehalten · HNOSS™ Identity · © 2026
        </p>
      </div>
    </div>
  );
}