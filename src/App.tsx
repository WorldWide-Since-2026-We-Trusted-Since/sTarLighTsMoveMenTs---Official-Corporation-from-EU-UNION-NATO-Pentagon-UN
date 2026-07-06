/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Database, 
  Activity, 
  Cpu, 
  Layers, 
  Globe, 
  RefreshCw, 
  FileCheck, 
  ExternalLink,
  Search,
  CheckCircle,
  AlertTriangle,
  Fingerprint,
  PieChart as PieIcon,
  TrendingUp,
  Server
} from "lucide-react";
import { 
  GOVERNANCE_NODES, 
  SWF_ASSETS, 
  PROJECT_CORRIDORS, 
  SEED_AUDITS, 
  simulateSignAndHash 
} from "./data";
import { AuditRecord, GovernanceNode, SWFAsset, ProjectCorridor } from "./types";
import { 
  WarpTunnel, 
  LightningSystem, 
  NewsTicker, 
  NewsTimeline, 
  TwinklingStarsOverlay 
} from "./components/CosmicSystem";
import { DataVisualizationDashboard } from "./components/DataVisualizationDashboard";
import { AtomicSyncClock } from "./components/AtomicSyncClock";
import PledgePage from "./components/PledgePage";
import PapersArchive from "./components/PapersArchive";

import FinanceSystemPage from "./components/FinanceSystemPage";
import MemorialTributePage from "./components/MemorialTributePage";
import RainbowLightningFooter from "./components/RainbowLightningFooter";
import ConcilPortal from "./components/ConcilPortal";

export default function App() {
  // Navigation tabs: pledge (default start page), papers, finance, memorial, portal, governance, capital, audit, concil
  const [activeTab, setActiveTab] = useState<"pledge" | "papers" | "finance" | "memorial" | "portal" | "governance" | "capital" | "audit" | "concil">("pledge");
  const [nodes, setNodes] = useState<GovernanceNode[]>(GOVERNANCE_NODES);
  const [selectedNode, setSelectedNode] = useState<GovernanceNode>(GOVERNANCE_NODES[0]);
  const [audits, setAudits] = useState<AuditRecord[]>(SEED_AUDITS);
  
  // States for the interactive "Digitally Sign & Invest" simulator
  const [customSource, setCustomSource] = useState("SAGA-PEZ (Representative)");
  const [customDestination, setCustomDestination] = useState("Transcendent AI & Digital Infrastructure");
  const [customAmount, setCustomAmount] = useState(15.5);
  const [customCurrency, setCustomCurrency] = useState("EUR");
  const [customLayer, setCustomLayer] = useState<"TX" | "TXA" | "GOV" | "FI" | "SWFs">("SWFs");
  const [isSigning, setIsSigning] = useState(false);
  const [recentSigningMsg, setRecentSigningMsg] = useState("");

  // Live transaction flow ticker simulator (to emulate real-time auditing requirement)
  const [liveTickerActive, setLiveTickerActive] = useState(true);

  // Cosmic features
  const [isLightningActive, setIsLightningActive] = useState(false);
  const [warpSpeed, setWarpSpeed] = useState(2.2);
  const [showTimeline, setShowTimeline] = useState(false);
  const [govSubView, setGovSubView] = useState<"visual" | "blueprint">("visual");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (liveTickerActive) {
      interval = setInterval(() => {
        // Randomly simulate an automated audit event
        const sources = ["Central Bank Settlement", "HNOSS™ Reserve Network", "SAGA-PEZ Capital Network", "EpsLGSEz General Partner", "EU-NATO Governance Block"];
        const dests = [
          "Strategic Energy Infrastructure Grid", 
          "Transcendent AI & Digital Infrastructure", 
          "NATO-Aligned Strategic Defense Systems",
          "UN-Supported Global Humanitarian Programs",
          "Sovereign Clearing & Settlement Layer"
        ];
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        const randomDest = dests[Math.floor(Math.random() * dests.length)];
        const currs = ["EUR", "USD", "CHF"];
        const layers: Array<"TX" | "TXA" | "GOV" | "FI" | "SWFs"> = ["TX", "TXA", "GOV", "FI", "SWFs"];
        const amount = parseFloat((Math.random() * 85 + 5).toFixed(1));
        const curr = currs[Math.floor(Math.random() * currs.length)];
        const layer = layers[Math.floor(Math.random() * layers.length)];
        
        const payloadString = `${randomSource}->${randomDest}-${amount}${curr}-${Date.now()}`;
        const cryptoResult = simulateSignAndHash(payloadString);

        const newRecord: AuditRecord = {
          id: `AUD-${Math.floor(Math.random() * 90000) + 10000}`,
          timestamp: new Date().toISOString(),
          source: randomSource,
          destination: randomDest,
          amount,
          currency: curr,
          layer,
          signature: cryptoResult.signature,
          status: "VERIFIED",
          hash: cryptoResult.hash
        };

        setAudits(prev => [newRecord, ...prev.slice(0, 7)]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [liveTickerActive]);

  // Handle manual programmatic signature generation
  const handleGenesisSignature = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigning(true);
    setRecentSigningMsg("Initializing asymmetric cryptokernel handshake...");

    setTimeout(() => {
      const payloadString = `${customSource}->${customDestination}-${customAmount}${customCurrency}-${Date.now()}`;
      const cryptoResult = simulateSignAndHash(payloadString);

      const generatedRecord: AuditRecord = {
        id: `TXS-${Math.floor(Math.random() * 899999) + 100000}`,
        timestamp: new Date().toISOString(),
        source: customSource,
        destination: customDestination,
        amount: customAmount,
        currency: customCurrency,
        layer: customLayer,
        signature: cryptoResult.signature,
        status: "VERIFIED",
        hash: cryptoResult.hash
      };

      setAudits(prev => [generatedRecord, ...prev]);
      setIsSigning(false);
      setRecentSigningMsg(`Successfully signed & indexed database node! TXID: ${generatedRecord.id}`);
      
      // Auto fade out status message
      setTimeout(() => {
        setRecentSigningMsg("");
      }, 5000);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#000819] overflow-x-hidden selection:bg-[#bf953f] selection:text-black">
      {/* Background radial atmosphere - Interactive Warp Tunnel with Twinkling Stars */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <WarpTunnel warpSpeed={isLightningActive ? 9.5 : warpSpeed} isSpiced={isLightningActive} />
        <TwinklingStarsOverlay />
      </div>

      {/* Lightning Storm State Controller */}
      <LightningSystem onStrikeTriggered={(active) => setIsLightningActive(active)} />

      {/* High-precision Atomic Digital Sync Clock positioned dynamically bottom-left */}
      <AtomicSyncClock />

      {/* TOP HEADER NAVIGATION BAR */}
      <header className="relative z-50 max-w-7xl mx-auto px-4 pt-6 pb-2" id="navigation-root">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-amber-900/40 bg-black/75 backdrop-blur-md">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-900 shadow-[0_0_15px_rgba(191,149,63,0.4)]">
              <span className="text-black font-black text-xs font-display">HN</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-[4px] text-[#bf953f] font-semibold">Official Portal</span>
                <span className="px-1.5 py-0.5 text-[8px] bg-[#bf953f]/10 text-[#fcf6ba] border border-[#bf953f]/30 rounded font-bold font-mono">DE441892129</span>
              </div>
              <h2 className="text-base font-black font-display tracking-wider text-white">
                HNOSS <span className="text-xs font-medium font-mono text-gray-400">® REGISTERED TRADEMARK</span>
              </h2>
            </div>
          </div>

          {/* Interactive Navigation Control Buttons */}
          <nav className="flex flex-wrap items-center justify-center gap-2">
            <button
              id="btn-pledge"
              onClick={() => setActiveTab("pledge")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "pledge"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              📜 Government Pledge
            </button>
            <button
              id="btn-papers"
              onClick={() => setActiveTab("papers")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "papers"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              📚 Papers Archive
            </button>
            <button
              id="btn-finance"
              onClick={() => setActiveTab("finance")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "finance"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              💰 Finance System
            </button>
            <button
              id="btn-memorial"
              onClick={() => setActiveTab("memorial")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "memorial"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              🕊️ Memorial
            </button>
            <button
              id="btn-identity-portal"
              onClick={() => setActiveTab("portal")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "portal"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              ★ 100% Original Portal
            </button>
            <button
              id="btn-gov-node"
              onClick={() => setActiveTab("governance")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "governance"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              🏛️ Governance Hierarchy
            </button>
            <button
              id="btn-capital-flow"
              onClick={() => setActiveTab("capital")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "capital"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              📊 Capital & Corridor Map
            </button>
            <button
              id="btn-realtime-audit"
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "audit"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              🛡️ Live Audits & Signer
            </button>
            <button
              id="btn-concil-portal"
              onClick={() => setActiveTab("concil")}
              className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "concil"
                  ? "border-[#fcf6ba] bg-[#bf953f]/25 text-white shadow-[0_0_12px_rgba(191,149,63,0.3)]"
                  : "border-gray-800 bg-black/40 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              🏛️ Concil Portal
            </button>
          </nav>
        </div>
      </header>

      {/* Continuously Animated News Feed Marquee Bar */}
      <NewsTicker />

      {/* VIEWPORT AREA AND ANIMATION CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* TAB 0: PAPERS ARCHIVE — WISSENSCHAFTLICHE DOKUMENTATION */}
          {activeTab === "papers" && (
            <motion.div
              key="papers-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <PapersArchive />
            </motion.div>
          )}

          {/* TAB: FINANCE SYSTEM */}
          {activeTab === "finance" && (
            <motion.div
              key="finance-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <FinanceSystemPage />
            </motion.div>
          )}

          {/* TAB: MEMORIAL TRIBUTE */}
          {activeTab === "memorial" && (
            <motion.div
              key="memorial-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <MemorialTributePage />
            </motion.div>
           )}

           {/* TAB 1: GOVERNMENT PLEDGE — AGENDA HEAVENLY SINCE PLEDGE (STARTSEITE) */}
           {activeTab === "pledge" && (
            <motion.div
              key="pledge-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
              id="pledge-tab-panel"
            >
              <PledgePage />
            </motion.div>
          )}

          {/* TAB 2: 100% ORIGINAL IDENTITY PORTAL DESIGN */}
          {activeTab === "portal" && (
            <motion.div
              key="portal-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="portal-wrapper select-none"
              id="original-portal"
            >
              <div className="outer-orbit">
                {/* Embedded dynamic SVG lines representing structural layers */}
                <svg className="mesh-network-overlay" viewBox="0 0 800 800">
                  <g stroke="var(--mesh-line)" strokeWidth="0.5">
                    <line x1="400" y1="28" x2="400" y2="100"></line>
                    <line x1="655" y1="145" x2="560" y2="240"></line>
                    <line x1="772" y1="400" x2="680" y2="400"></line>
                    <line x1="655" y1="655" x2="560" y2="560"></line>
                    <line x1="400" y1="772" x2="400" y2="700"></line>
                    <line x1="145" y1="655" x2="240" y2="560"></line>
                    <line x1="28" y1="400" x2="120" y2="400"></line>
                    <line x1="145" y1="145" x2="240" y2="240"></line>
                  </g>
                  <polygon points="400,28 655,145 772,400 655,655 400,772 145,655 28,400 145,145" fill="none" stroke="var(--mesh-line)" strokeWidth="1"></polygon>
                  <g transform="translate(80, 80)">
                    <polygon points="160,0 480,0 640,320 480,640 160,640 0,320" fill="none" stroke="rgba(191, 149, 63, 0.3)" strokeWidth="1"></polygon>
                  </g>
                </svg>

                {/* Rotating Glowing Border Frame */}
                <div className="outer-circle-frame" id="outer-circle-frame"></div>

                {/* 8 Axis Orbit Stars */}
                <div className="orbit-star s1">★</div>
                <div className="orbit-star s2">★</div>
                <div className="orbit-star s3">★</div>
                <div className="orbit-star s4">★</div>
                <div className="orbit-star s5">★</div>
                <div className="orbit-star s6">★</div>
                <div className="orbit-star s7">★</div>
                <div className="orbit-star s8">★</div>

                <div className="portal-hexagon-frame" id="portal-hexagon-frame">
                  {/* Hexagon stars */}
                  <div className="hex-star hs1">★</div>
                  <div className="hex-star hs2">★</div>
                  <div className="hex-star hs3">★</div>
                  <div className="hex-star hs4">★</div>
                  <div className="hex-star hs5">★</div>
                  <div className="hex-star hs6">★</div>

                  <div className="hexagon-inner-bg">
                    {/* Top Wreath: Enhanced Vertical Tiers & Tight Spacing */}
                    <div className="star-wreath" id="top-wreath">
                      <span className="wreath-star" style={{ left: "0%", bottom: "0%" }}>★</span>
                      <span className="wreath-star" style={{ left: "18%", bottom: "45%" }}>★</span>
                      <span className="wreath-star" style={{ left: "35%", bottom: "75%" }}>★</span>
                      <span className="wreath-star" style={{ left: "50%", bottom: "95%" }}>★</span>
                      <span className="wreath-star" style={{ left: "65%", bottom: "75%" }}>★</span>
                      <span className="wreath-star" style={{ left: "82%", bottom: "45%" }}>★</span>
                      <span className="wreath-star" style={{ left: "100%", bottom: "0%" }}>★</span>
                    </div>

                    <div className="official-reference mt-1 text-center font-mono">Official Reference</div>
                    <div className="trademark-tag text-center select-text">
                      Trademark: Hnoss <span className="text-[6px] opacity-65 align-top">® Registered</span>
                    </div>

                    <div className="official-status-badge text-center leading-relaxed">
                      Official Corporation from<br />
                      EU-UNION / NATO / Pentagon / UN
                    </div>

                    <div className="framework-text metallic-silver-text tracking-[3px] text-[7px] font-bold text-center mb-1">
                      Humanitarian · Political · Spiritual · Defense
                    </div>

                    <h1 className="metallic-gold-title italic select-text hover:scale-102 transition-transform duration-300">
                      sTarLighTsMoveMenTs
                    </h1>

                    <div className="border-t border-b border-red-500/80 px-8 py-0.5 my-2 z-10 flex justify-center w-[320px]">
                      <span className="text-red-500 text-[9px] font-black tracking-[5px] text-center uppercase">
                        EXPERT UNDER CIVIL LAW
                      </span>
                    </div>

                    <div className="mb-2 text-center flex flex-col items-center w-full z-10">
                      <div className="hierarchy-item">
                        <span className="hierarchy-text metallic-silver-text font-black text-xs tracking-[12px]">Corp.</span>
                        <div className="text-[6px] text-[#bf953f] tracking-[2.5px] uppercase mt-1">
                          GLOBAL REFERENCE SYSTEMS — <span className="text-white opacity-80">Partnered</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1.5 w-full mt-1.5">
                        <div className="hierarchy-item">
                          <span className="label text-[5.5px] opacity-70">Reference Framework:</span>
                          <span className="hierarchy-text metallic-silver-text text-[8px] tracking-[4px]">
                            NATO <span className="sub-info-text">(Strategic Defense Model)</span>
                          </span>
                        </div>
                        <div className="hierarchy-item">
                          <span className="hierarchy-text metallic-silver-text text-[8px] tracking-[4px]">
                            European Union <span className="sub-info-text">(Regulatory Governance Layer)</span>
                          </span>
                        </div>
                        <div className="hierarchy-item">
                          <span className="hierarchy-text metallic-silver-text text-[8px] tracking-[4px]">
                            Pentagon <span className="sub-info-text">(Operational Defense Structure)</span>
                          </span>
                        </div>
                        <div className="hierarchy-item">
                          <span className="hierarchy-text metallic-silver-text text-[8px] tracking-[4px]">
                            United Nations <span className="sub-info-text">(Global Coordination Layer)</span>
                          </span>
                        </div>

                        <div className="mt-1 flex flex-col gap-0.5 items-center">
                          <div className="text-[6.5px] tracking-[3px] text-[#fcf6ba] font-bold text-center uppercase font-mono">
                            In collaboration — Conceptual alignment — Official Corporation
                          </div>
                        </div>
                      </div>

                      <span className="metallic-gold-small text-[7.5px] font-bold tracking-[1.1px] uppercase leading-relaxed max-w-[420px] text-center block mt-1.5 font-mono">
                        Grand Integrated Technocratic Global Distinguished<br />
                        Operating Comprehensive National Power (CNP System)<br />
                        Spectrum Golden Awareness
                      </span>

                      <div className="mt-2.5 relative w-fit flex justify-center items-center">
                        <div className="absolute h-full w-[112%] border border-amber-500/30 skew-x-[-15deg] bg-amber-500/5"></div>
                        <span className="metallic-gold-small relative text-[8.5px] font-black tracking-[2.5px] uppercase py-0.5 px-3">
                          Global Strategic Architect
                        </span>
                      </div>
                    </div>

                    {/* Cryptographic Dynamic Grid displaying verified Registry IDs */}
                    <div className="fixed-data-grid">
                      <div className="data-row">
                        <div className="text-left w-[48%]">
                          <span className="label">D-U-N-S Registry</span>
                          <span className="value rainbow-glow-text">315676980 | 317066336</span>
                        </div>
                        <div className="text-right w-[48%]">
                          <span className="label">VAT ID &amp; EU-Ref</span>
                          <span className="value rainbow-glow-text font-mono">DE441892129 | EX2025D1218310</span>
                        </div>
                      </div>
                      <div className="data-row">
                        <div className="text-left w-[48%]">
                          <span className="label">UNGM &amp; PIC</span>
                          <span className="value rainbow-glow-text">1172700 | 873042778</span>
                        </div>
                        <div className="text-right w-[48%]">
                          <span className="label">Swiss ID</span>
                          <span className="value rainbow-glow-text">756.6199.0539.28</span>
                        </div>
                      </div>
                      <div className="text-center mt-1 w-full">
                        <span className="label">Global LEI System</span>
                        <span className="value rainbow-glow-text text-[10px]">894500GBJSIW8L6ET310</span>
                      </div>
                    </div>

                    {/* Verified secure communication interfaces - Harmonized Badge Panel */}
                    <div className="my-2 text-center w-full z-10 max-w-[420px] bg-black/75 border border-[#bf953f]/25 px-4 py-2 rounded shadow-[inset_0_0_10px_rgba(191,149,63,0.15)] flex flex-col gap-1 items-center">
                      <span className="label text-[#bf953f] text-[7.5px] tracking-[2.5px] font-bold">Secure Terminal Access</span>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center w-full font-mono">
                        <a 
                          href="mailto:government-enterprise@ag-thrust.cloud" 
                          className="rainbow-glow-text text-[10px] md:text-[10.5px] font-black tracking-normal hover:underline"
                          id="secure-mail-link"
                          style={{ wordBreak: 'break-all' }}
                        >
                          government-enterprise@ag-thrust.cloud
                        </a>
                        <span className="hidden sm:inline text-amber-500/40 text-[9px]">|</span>
                        <a 
                          href="tel:+4915562233724" 
                          className="text-[#fcf6ba] hover:text-white text-[10px] md:text-[10.5px] font-bold tracking-[1px] transition-colors"
                        >
                          +49 1556 2233724
                        </a>
                      </div>
                    </div>

                    {/* Integrated verified link cases - SAGA-PEZ Harmonized Info Nodes */}
                    <div className="z-10 mt-3 w-full flex flex-col items-center">
                      <span className="label text-[#bf953f] text-[7px] tracking-[2.5px] font-bold mb-1.5 uppercase text-center">
                        SAGA-PEZ Verification Info Hub
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 justify-center max-w-[480px] font-mono px-2 mb-2">
                        {[
                          { name: "Future of Life Souls Lights", url: "https://projekt-since-shinehealth-care.netlify.app/", desc: "Erhöhte Geistige Präsenz auf Netlify" },
                          { name: "Corporation Since", url: "https://loginsiteauth.goodwelllikewisespell.info/", desc: "Sichere Benutzerauthentifizierung" },
                          { name: "Hackathon Public Awareness", url: "https://hackathon-sign.goodwelllikewisespell.info/", desc: "Auszeichnungen & Bewusstsein" },
                          { name: "Policy of Lights Souls", url: "https://policy.governmententerprise.org/trustedtrustthrust", desc: "Zertifizierter Trust-Leitfaden" },
                          { name: "Archive Heritage Bibliothek", url: "https://ai-tech-heritage-archive.likewise.live/", desc: "Kulturelles Digitalarchiv" },
                          { name: "IBX IPX CONNECTIONS. MORE", url: "https://chos.ag-thrust.cloud/", desc: "Glasfasertransfer & PeeringDB" },
                        ].map((link, idx) => (
                          <div key={idx} className="relative group flex flex-col items-center">
                            {/* The Info button (raw links hidden, only ⓘ button visible) */}
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="w-8 h-8 rounded-full border border-[#bf953f]/50 bg-black/95 hover:bg-[#bf953f]/30 hover:border-[#fcf6ba] text-[#fcf6ba] flex items-center justify-center font-bold text-xs select-none transition-all shadow-[inset_0_0_5px_rgba(191,149,63,0.3)] hover:shadow-[0_0_10px_rgba(252,246,186,0.35)] cursor-pointer"
                              id={`info-hub-node-${idx}`}
                            >
                              ⓘ
                            </a>
                            <span className="text-[6.5px] text-[#bf953f]/80 mt-1 tracking-tight font-bold uppercase text-center w-full truncate max-w-[65px]">
                              Node {idx + 1}
                            </span>
                            
                            {/* Elegant hover tooltip */}
                            <div className="absolute bottom-10 scale-0 group-hover:scale-100 transition-all origin-bottom duration-200 z-50 bg-black/95 border border-[#bf953f] p-2 rounded shadow-2xl w-[190px] pointer-events-none text-left">
                              <p className="text-[9px] font-black text-white uppercase leading-normal mb-0.5">{link.name}</p>
                              <p className="text-[7.5px] text-amber-400 font-mono tracking-wide mb-1">{link.desc}</p>
                              <p className="text-[6px] text-gray-500 truncate">{link.url}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Interactive Drawer Toggle for Timeline & Quotes */}
                      <button
                        id="btn-toggle-heavenly-timeline"
                        onClick={() => setShowTimeline(!showTimeline)}
                        className="mt-1 px-3 py-1 border border-[#bf953f]/40 hover:border-[#fcf6ba] rounded text-[8px] font-mono uppercase tracking-wider text-[#fcf6ba] hover:text-white bg-black/75 transition-all duration-200 cursor-pointer shadow-[0_0_8px_rgba(191,149,63,0.1)] hover:shadow-[0_0_12px_rgba(191,149,63,0.25)] flex items-center gap-1"
                      >
                        {showTimeline ? "★ Collapse Heavenly Chronicles" : "★ Expand Heavenly Chronicles & Timeline"}
                      </button>

                      <AnimatePresence>
                        {showTimeline && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="w-full max-w-[480px] overflow-hidden"
                            id="heavenly-timeline-drawer"
                          >
                            <NewsTimeline />

                            {/* Philosophy Footprint Banner */}
                            <div className="mt-3 p-3 bg-gradient-to-r from-cyan-950/40 via-black to-cyan-950/40 border border-[#bf953f]/30 rounded text-center">
                              <span className="label text-cyan-300 text-[6.5px] tracking-[3px] font-bold text-center block mb-1">
                                Supreme Celestial Philosophy
                              </span>
                              <p className="text-[10px] text-white font-medium leading-relaxed italic">
                                "Denkst du nicht Selbst? Hat der Himmel nicht Recht? — als Footprinter."
                              </p>
                              <p className="text-[8px] text-gray-400 mt-1 font-mono tracking-normal">
                                Freiheit · Frieden · Vergebung · Nächstenliebe · Hoffnung über alle Welten.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="footer-section mt-1">
                      <div className="text-amber-500/80 font-bold text-[8px] mb-0.5">
                        Auth Signature: <span className="text-white opacity-90 select-text font-mono text-[9px]">Daniel Pohl (HolyThreeKings)</span>
                      </div>
                      <div className="framework-text metallic-silver-text text-[6.5px] mb-1 opacity-80">
                        Humanitarian · Political · Spiritual · Defense
                      </div>
                      <div className="mb-1 leading-none">
                        <span className="text-[#bf953f] font-black text-[10px] tracking-[3px]">HNOSS™ IDENTITY</span>
                        <span className="text-white/50 text-[7px] ml-2">© No Rights Waived.</span>
                      </div>

                      {/* Bottom Wreath Framework */}
                      <div className="star-wreath mt-1" id="bottom-wreath" style={{ width: "160px", height: "24px" }}>
                        <span className="wreath-star" style={{ left: "0%", top: "0%" }}>★</span>
                        <span className="wreath-star" style={{ left: "16%", top: "35%" }}>★</span>
                        <span className="wreath-star" style={{ left: "33%", top: "65%" }}>★</span>
                        <span className="wreath-star" style={{ left: "50%", top: "85%" }}>★</span>
                        <span className="wreath-star" style={{ left: "67%", top: "65%" }}>★</span>
                        <span className="wreath-star" style={{ left: "84%", top: "35%" }}>★</span>
                        <span className="wreath-star" style={{ left: "100%", top: "0%" }}>★</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: INTERACTIVE GOVERNANCE HIERARCHY MAP */}
          {activeTab === "governance" && (
            <motion.div
              key="gov-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl px-4 py-4"
              id="governance-tab-panel"
            >
              <div className="glass-panel p-6 border border-amber-900/40 relative overflow-hidden" id="gov-container">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Layers className="w-48 h-48 text-[#bf953f]" />
                </div>

                <div className="mb-6 border-b border-amber-900/30 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-5 h-5 text-[#bf953f]" />
                      <span className="text-xs uppercase font-mono text-[#bf953f] tracking-widest font-bold">Structural Framework</span>
                    </div>
                    <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-1">
                      Institutionelle Governance- &amp; Marktarchitektur
                    </h1>
                    <p className="text-sm text-gray-400">
                      Sovereign Framework-Kette der Meta-Governance, Sovereign Wealth Funds und geopolitischen Referenzmodelle.
                    </p>
                  </div>

                  {/* High Quality Sub Tab Selector */}
                  <div className="flex bg-black/60 p-1 rounded-md border border-amber-900/40 shrink-0 self-start md:self-auto">
                    <button
                      onClick={() => setGovSubView("visual")}
                      className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                        govSubView === "visual"
                          ? "bg-[#bf953f] text-black font-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      ★ Visual Graph Model
                    </button>
                    <button
                      onClick={() => setGovSubView("blueprint")}
                      className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                        govSubView === "blueprint"
                          ? "bg-[#bf953f] text-black font-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      📜 Official ASCII Spec Blueprint
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Interactive Architecture Flow Tree Column */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    {govSubView === "visual" ? (
                      <div className="flex flex-col gap-1 bg-black/45 p-4 rounded-lg border border-amber-900/10">
                        {/* Level 1: TX (Transcendence) */}
                        <div className="flex flex-col items-center">
                          <motion.button
                            id="node-tx-meta"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "tx-meta") || nodes[0])}
                            className={`w-full max-w-sm p-2.5 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "tx-meta"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 25px rgba(191, 149, 63, 0.45)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[9px] font-mono tracking-widest text-[#bf953f] uppercase font-black">Level 1 // TX</div>
                            <div className="font-bold tracking-wider font-display text-xs">TX — TRANSCENDENCE LAYER</div>
                            <div className="text-[9px] font-mono text-gray-400">Meta Governance · Strategic Intelligence · Awareness</div>
                          </motion.button>
                          <div className="w-0.5 h-4 bg-[#bf953f]/30"></div>
                        </div>

                        {/* Level 2: TXA (Supervisory AI Infrastructure) */}
                        <div className="flex flex-col items-center">
                          <motion.button
                            id="node-txa-tsai"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "txa-tsai") || nodes[1])}
                            className={`w-full max-w-md p-2.5 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "txa-tsai"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 25px rgba(191, 149, 63, 0.45)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[9px] font-mono tracking-widest text-[#bf953f] uppercase font-black">Level 2 // TXA</div>
                            <div className="font-bold tracking-wider font-display text-xs">TXA — TRANSCENDENT AUTHORITY (TSAI)</div>
                            <div className="text-[9px] font-mono text-gray-400">SRA · GCA · RGC · ABN · ESA · NSA · NCA · CA · RA</div>
                          </motion.button>

                          <div className="relative w-full max-w-xl flex justify-center mt-3 h-4">
                            {/* Horizontal connecting branch vectors */}
                            <div className="absolute top-0 left-[18%] right-[18%] h-0.5 bg-[#bf953f]/30"></div>
                            <div className="absolute top-0 left-[18%] w-0.5 h-4 bg-[#bf953f]/30"></div>
                            <div className="absolute top-0 left-[50%] w-0.5 h-4 bg-[#bf953f]/30"></div>
                            <div className="absolute top-0 right-[18%] w-0.5 h-4 bg-[#bf953f]/30"></div>
                          </div>
                        </div>

                        {/* Level 3: GOV, FI, SWFs Side-by-Side */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          
                          {/* Sub-node GOV */}
                          <motion.button
                            id="node-gov-core"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "gov-core") || nodes[2])}
                            className={`p-2 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "gov-core"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 20px rgba(191, 149, 63, 0.4)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[8px] font-mono text-[#bf953f] font-bold uppercase">Layer 3 // GOV</div>
                            <h4 className="font-black font-display text-[10px] mb-0.5">GOV CORE</h4>
                            <p className="text-[8px] text-gray-400 font-mono leading-none">GovCore · GovID · GovX</p>
                          </motion.button>

                          {/* Sub-node FI */}
                          <motion.button
                            id="node-fi-settlement"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "fi-settlement") || nodes[3])}
                            className={`p-2 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "fi-settlement"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 20px rgba(191, 149, 63, 0.4)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[8px] font-mono text-[#bf953f] font-bold uppercase">Layer 3 // FI</div>
                            <h4 className="font-black font-display text-[10px] mb-0.5">FINANC INFRA</h4>
                            <p className="text-[8px] text-gray-400 font-mono leading-none">CB · Settlement · LEI</p>
                          </motion.button>

                          {/* Sub-node SWFs */}
                          <motion.button
                            id="node-swf-anchor"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "swf-anchor") || nodes[4])}
                            className={`p-2 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "swf-anchor"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 20px rgba(191, 149, 63, 0.4)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[8px] font-mono text-[#bf953f] font-bold uppercase">Layer 3 // SWFs</div>
                            <h4 className="font-black font-display text-[10px] mb-0.5">SOVEREIGN</h4>
                            <p className="text-[8px] text-gray-400 font-mono leading-none">EpsLGSEz · GPs/LPs</p>
                          </motion.button>

                        </div>

                        {/* Bridge connecting from Layer 3 into Layer 4 SWFs hub */}
                        <div className="relative w-full max-w-xl flex justify-center h-4">
                          <div className="absolute top-0 left-[18%] right-[18%] h-0.5 bg-[#bf953f]/30"></div>
                          <div className="absolute top-0 left-[18%] w-0.5 h-2 bg-[#bf953f]/20"></div>
                          <div className="absolute top-0 left-[50%] w-0.5 h-4 bg-[#bf953f]/30"></div>
                          <div className="absolute top-0 right-[18%] w-0.5 h-2 bg-[#bf953f]/20"></div>
                        </div>

                        {/* Level 4: WORLD'S STAR SWFs GOVERNANCE HUB */}
                        <div className="flex flex-col items-center">
                          <motion.button
                            id="node-swf-hub"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "swf-hub") || nodes[5] || nodes[0])}
                            className={`w-full max-w-md p-2.5 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "swf-hub"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 25px rgba(191, 149, 63, 0.45)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[9px] font-mono tracking-widest text-[#bf953f] uppercase font-black">Level 4 // GOVERNANCE HUB</div>
                            <div className="font-bold tracking-wider font-display text-xs">WORLD'S STAR SWFs GOVERNANCE HUB</div>
                            <div className="text-[9px] font-mono text-gray-400 font-bold">PgEz · EpsLGSEz · pg_slz · GLp · SAGA-PEZ</div>
                          </motion.button>
                          <div className="w-0.5 h-4 bg-[#bf953f]/30"></div>
                        </div>

                        {/* Level 5: GLOBAL PROJECT IMPLEMENTATION */}
                        <div className="flex flex-col items-center">
                          <motion.button
                            id="node-global-projects"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "global-projects") || nodes[6] || nodes[0])}
                            className={`w-full max-w-sm p-2.5 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "global-projects"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 25px rgba(191, 149, 63, 0.45)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[9px] font-mono tracking-widest text-[#bf953f] uppercase font-black">Level 5 // IMPLEMENTATION</div>
                            <div className="font-bold tracking-wider font-display text-xs">GLOBAL PROJECT IMPLEMENTATION</div>
                            <div className="text-[8.5px] font-mono text-gray-400">Energy · Digital · Financial · AI · Defense · Humanitarian</div>
                          </motion.button>
                          <div className="w-0.5 h-4 bg-[#bf953f]/30"></div>
                        </div>

                        {/* Level 6: GLOBAL REFERENCE FRAMEWORK */}
                        <div className="flex flex-col items-center">
                          <motion.button
                            id="node-ref-framework"
                            onClick={() => setSelectedNode(nodes.find(n => n.id === "ref-framework") || nodes[7] || nodes[0])}
                            className={`w-full max-w-xs p-2.5 rounded border text-center cursor-pointer relative ${
                              selectedNode.id === "ref-framework"
                                ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
                                : "border-amber-900/30 bg-black/60 text-gray-300"
                            }`}
                            variants={{
                              initial: { scale: 1 },
                              hover: {
                                scale: 1.025,
                                borderColor: "#fcf6ba",
                                boxShadow: "0 0 25px rgba(191, 149, 63, 0.45)"
                              }
                            }}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            initial="initial"
                          >
                            {/* Radiant Cosmic Pulse Ring */}
                            <motion.div
                              className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
                              variants={{
                                initial: { opacity: 0, scale: 1 },
                                hover: {
                                  opacity: [0, 0.6, 0],
                                  scale: [1, 1.08, 1.15],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                            {/* Inner Shimmer Boundary */}
                            <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
                                variants={{
                                  initial: { x: "-150%" },
                                  hover: {
                                    x: "250%",
                                    transition: {
                                      repeat: Infinity,
                                      duration: 1.8,
                                      ease: "linear"
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[9px] font-mono tracking-widest text-[#bf953f] uppercase font-black">Level 6 // ALIGNMENT</div>
                            <div className="font-bold tracking-wider font-display text-xs">GLOBAL REFERENCE FRAMEWORK</div>
                            <div className="text-[8.5px] font-mono text-gray-400">NATO Model · EU Layer · Pentagon · United Nations</div>
                          </motion.button>
                        </div>

                        {/* Informative Note */}
                        <div className="mt-3 p-2 bg-[#bf953f]/5 border border-[#bf953f]/20 rounded text-center">
                          <p className="text-[9px] text-[#fcf6ba] font-mono leading-tight mb-0">
                            ★ Klicken Sie auf eine beliebige Ebene, um die verifizierten Metadaten rechts aufzurufen.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Full Spec Blueprint Node list (Monospace details) */
                      <div className="border border-amber-900/45 bg-black/95 p-4 rounded-lg text-left font-mono text-[9px] text-gray-300 leading-normal max-h-[580px] overflow-y-auto" id="node-blueprint-specs-container">
                        <div className="text-center border-b border-amber-900/30 pb-3 mb-3">
                          <div className="text-[#bf953f] text-[10px] font-black tracking-[4px] uppercase mb-0.5">HNOSS ® Registered Trademark</div>
                          <div className="text-white text-[10px] font-bold">OFFICIAL GLOBAL CORPORATION REFERENCES</div>
                          <div className="text-gray-400 text-[8px] mt-0.5">Sovereign Humanitarian · Political · Spiritual · Defense Operations</div>
                          <div className="text-[#fcf6ba] text-[9px] font-semibold mt-0.5">sTarLighTsMoveMenTs · EXPERT UNDER CIVIL LAW</div>
                        </div>

                        <div className="space-y-3">
                          <div className="p-2.5 bg-zinc-950 rounded border border-zinc-900">
                            <span className="text-[#bf953f] font-bold block mb-1">✦ GLOBAL COOPERATIVE ALLIANCE REFERENCE</span>
                            <p className="text-[8.5px] leading-relaxed">
                              • NATO Strategic Defense Model (Operational Defense)<br />
                              • European Union (Regulatory Governance &amp; Administration)<br />
                              • Pentagon (Strategic Planning &amp; Defense Blueprint)<br />
                              • United Nations (Global Coordination Layer &amp; UNGM Node)
                            </p>
                          </div>

                          <div className="p-2.5 bg-zinc-950 rounded border border-zinc-900">
                            <span className="text-[#bf953f] font-bold block mb-1">✦ OFFICIAL INSTITUTIONAL REGISTRIES</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[8.5px]">
                              <div><strong className="text-white">D-U-N-S Registry:</strong> 315676980 | 317066336</div>
                              <div><strong className="text-white">VAT ID &amp; EU-Ref:</strong> DE441892129 | EX2025D1218310</div>
                              <div><strong className="text-white">UNGM &amp; PIC ID:</strong> 1172700 | 873042778</div>
                              <div><strong className="text-white">Swiss National ID:</strong> 756.6199.0539.28</div>
                              <div className="col-span-1 sm:col-span-2"><strong className="text-white">Global LEI Identifier:</strong> 894500GBJSIW8L6ET310</div>
                            </div>
                          </div>

                          <div className="p-2.5 bg-zinc-950 rounded border border-zinc-900">
                            <span className="text-amber-400 font-bold block mb-2 text-center text-[9px]">★ INSTITUTIONAL GOVERNANCE &amp; MARKET MASTER DIAGRAM ★</span>
                            <pre className="text-[7px] sm:text-[8px] leading-[1.1] text-[#fcf6ba] overflow-x-auto select-all whitespace-pre">
{`╔══════════════════════════════════════════════════════════════════════╗
║                         HNOSS • PrisMaTHarIOn                      ║
║                GLOBAL REFERENCE GOVERNANCE SYSTEM                  ║
║                 World's Star SWFs • GPs • LPs                     ║
╚══════════════════════════════════════════════════════════════════════╝
                                  ★
                                  │
                                  ▼
╔══════════════════════════════════════════════════════════════════════╗
║                     TX — TRANSCENDENCE LAYER                       ║
║      Meta Governance • Strategic Intelligence • Awareness          ║
║      Humanitarian • Political • Spiritual • Defense               ║
╚══════════════════════════════════════════════════════════════════════╝
                                  │
                                  ▼
╔══════════════════════════════════════════════════════════════════════╗
║                    TXA — TRANSCENDENT AUTHORITY                    ║
║             Transcendent Supervisory AI Infrastructure             ║
║         SRA • GCA • RGC • ABN • ESA • NSA • NCA • CA              ║
║                     RA • SA • RB • AO • AB                        ║
╚══════════════════════════════════════════════════════════════════════╝
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│       GOV        │   │        FI        │   │       SWFs       │
│ Government Layer │   │ Financial Layer  │   │ Sovereign Funds  │
└──────────────────┘   └──────────────────┘   └──────────────────┘
        │                         │                         │
        ▼                         ▼                         ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ GovCore          │   │ CB               │   │ Anchor LPs       │
│ GovNet           │   │ Central Banks    │   │ Limited Partners │
│ GovID            │   │ Settlement       │   │ General Partners │
│ GovAPI           │   │ Clearing         │   │ Capital Pools    │
│ GovX             │   │ Liquidity        │   │ SWF Networks     │
└──────────────────┘   └──────────────────┘   └──────────────────┘
        └──────────────────┬──────────────────┘
                           │
                           ▼
╔══════════════════════════════════════════════════════════════════════╗
║                 WORLD'S STAR SWFs GOVERNANCE HUB                   ║
║                                                                    ║
║  PgEz • EpsLGSEz • pg_slz • GLp • SAGA-PEZ                         ║
║                                                                    ║
║  GP ↔ LP Coordination Framework                                    ║
║  Sovereign Capital Allocation                                      ║
║  Infrastructure Development Programs                               ║
║  Strategic Reserve Networks                                        ║
║  International Partnership Corridors                               ║
╚══════════════════════════════════════════════════════════════════════╝
                                  │
                                  ▼
╔══════════════════════════════════════════════════════════════════════╗
║                   GLOBAL PROJECT IMPLEMENTATION                    ║
║                                                                    ║
║  • Energy Infrastructure                                           ║
║  • Digital Infrastructure                                          ║
║  • Financial Infrastructure                                        ║
║  • AI Infrastructure                                               ║
║  • Defense Technologies                                            ║
║  • Humanitarian Programs                                           ║
║  • Strategic Development Corridors                                 ║
║  • Public Sector Modernization                                     ║
╚══════════════════════════════════════════════════════════════════════╝
                                  │
                                  ▼
╔══════════════════════════════════════════════════════════════════════╗
║                    GLOBAL REFERENCE FRAMEWORK                      ║
║                                                                    ║
║  Conceptual Alignment With:                                        ║
║                                                                    ║
║  NATO Strategic Defense Models                                     ║
║  European Union Governance Models                                  ║
║  United Nations Coordination Models                                ║
║  Sovereign Financial Infrastructure Principles                     ║
║                                                                    ║
║  Humanitarian • Political • Spiritual • Defense                    ║
╚══════════════════════════════════════════════════════════════════════╝
                                  ★
                       HNOSS™ IDENTITY FRAMEWORK
                           NO RIGHTS WAIVED`}
                            </pre>
                          </div>

                          <div className="p-2.5 bg-zinc-950 rounded border border-zinc-900 text-[8px] text-gray-400">
                            <strong className="text-amber-500 block text-[9px] mb-1">🔐 SECURE TERMINAL ACCESS PORTAL</strong>
                            • Verified Signature Code: Daniel Pohl (HolyThreeKings)<br />
                            • Sweden National ID Validation Active: True<br />
                            • Operational Gateway: government-enterprise@ag-thrust.cloud<br />
                            • Security Verification Line: +49 1556 2233724
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side Detail Panel */}
                  <div className="lg:col-span-5">
                    <div className="border border-amber-500/30 bg-black/90 p-5 rounded-lg h-full flex flex-col justify-between" id="node-super-details-card">
                      <div>
                        {/* Selected Node Header */}
                        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest bg-amber-950 text-[#fcf6ba] border border-[#bf953f]/30">
                              {selectedNode.category}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">ID: {selectedNode.id.toUpperCase()}</span>
                          </div>
                          <span className="flex items-center gap-1 text-[8.5px] font-mono font-bold text-emerald-400 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            SECURED LINK
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black font-display text-white mb-2 tracking-tight">
                          {selectedNode.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-200 font-medium mb-4 italic leading-relaxed bg-zinc-950/40 p-3 border border-zinc-800/40 rounded">
                          "{selectedNode.description}"
                        </p>

                        {/* Interactive Info Section Tabs for extreme detail density */}
                        <div className="mt-4 flex flex-col gap-3.5">
                          
                          {/* 1. Ausführungs-Mandat Segment */}
                          <div className="border border-amber-900/20 bg-amber-950/5 p-3 rounded text-left">
                            <span className="text-[9.5px] uppercase tracking-wider text-amber-500 font-mono font-bold block mb-1">
                              ✦ Verifiziertes Mandat &amp; Funktion
                            </span>
                            <p className="text-xs text-gray-300 leading-relaxed font-mono">
                              {selectedNode.details}
                            </p>
                          </div>

                          {/* 2. Politik (State-Level Integration Corridor) */}
                          <div className="border border-blue-900/30 bg-blue-950/5 p-3 rounded text-left">
                            <span className="text-[9.5px] uppercase tracking-wider text-blue-400 font-mono font-bold block mb-1">
                              🏛️ Politik &amp; Staatliche Koordination
                            </span>
                            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                              Vollständige Abstimmung mit dem <strong className="text-white">NATO Strategic Defense Model</strong> und dem <strong className="text-white">European Union Regulatory Governance Layer</strong>. Gewährleistet souveränen Datenschutz, bilaterale Kooperation und sichere administrative Verbindungskorridore über die eID-Brücken (Freja eID / Schweden ID) der Partnerstaaten.
                            </p>
                          </div>

                          {/* 3. Wissenschaft (Scientific Spec and High-Tech Crypto Metrics) */}
                          <div className="border border-cyan-900/30 bg-cyan-950/5 p-3 rounded text-left">
                            <span className="text-[9.5px] uppercase tracking-wider text-cyan-400 font-mono font-bold block mb-1">
                              🔬 Wissenschaft &amp; Technologisches Spektrum
                            </span>
                            <div className="grid grid-cols-2 gap-2 mt-1.5 font-mono text-[9px] text-gray-300">
                              <div className="p-1.5 bg-black border border-zinc-850 rounded">
                                <span className="text-gray-500 block uppercase text-[7.5px]">Cryptographic Core</span>
                                <span className="text-[#00ffff] font-black">SHA-256 Quantum Shield</span>
                              </div>
                              <div className="p-1.5 bg-black border border-zinc-850 rounded">
                                <span className="text-gray-500 block uppercase text-[7.5px]">Interconnect Latency</span>
                                <span className="text-emerald-400 font-black">&lt; 1.28ms (LEI Standard)</span>
                              </div>
                              <div className="p-1.5 bg-black border border-zinc-850 rounded">
                                <span className="text-gray-500 block uppercase text-[7.5px]">Identity Proof Engine</span>
                                <span className="text-white font-black">HNOSS™ ID Proof V4</span>
                              </div>
                              <div className="p-1.5 bg-black border border-zinc-850 rounded">
                                <span className="text-gray-500 block uppercase text-[7.5px]">Project ID Support</span>
                                <span className="text-[#bf953f] font-black">D-U-N-S Certified</span>
                              </div>
                            </div>
                          </div>

                          {/* 4. Spirituell & Celestial Trust Anchor */}
                          <div className="border border-[#bf953f]/30 bg-[#bf953f]/5 p-3 rounded text-left">
                            <span className="text-[9.5px] uppercase tracking-wider text-[#bf953f] font-mono font-bold block mb-1">
                              ✨ Spiritueller Trust &amp; Celestial Alignment
                            </span>
                            <p className="text-[11px] text-gray-200 leading-normal font-sans mb-1.5">
                              Geistige Synthese basierend auf <strong className="text-white">Trusted True Trust in Heavenly Science</strong>. Verankert in den transzendenten Leitlinien zur Manifestierung von harmonischer Fülle über alle Dimensionen.
                            </p>
                            <div className="p-2 border border-[#fcf6ba]/20 bg-black/60 rounded">
                              <p className="text-[10px] text-[#fcf6ba] italic font-medium leading-relaxed">
                                "Denkst du nicht Selbst? Hat der Himmel nicht Recht? — als Footprinter."
                              </p>
                              <p className="text-[8.5px] text-gray-400 font-mono mt-0.5 tracking-tight">
                                Fundament: Freiheit · Frieden · Vergebung · Nächstenliebe · Hoffnung.
                              </p>
                            </div>
                          </div>

                          {/* 5. Cryptographic Modules Key Layers */}
                          <div className="border border-zinc-800 bg-zinc-950/20 p-3 rounded">
                            <span className="text-[9.5px] uppercase tracking-wider text-gray-400 font-mono font-bold block mb-1.5">
                              🛡️ Aktivierte Kryptographische Module
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedNode.technicalLayers.map((layer, index) => (
                                <span 
                                  key={index} 
                                  className="text-[9.5px] font-mono px-2 py-0.5 bg-black border border-zinc-850 rounded font-bold text-gray-300"
                                >
                                  {layer}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Interactive Recharts 7-Day SWF Capital Flow Trend Line Dashboard */}
                        <div className="border-t border-amber-900/20 pt-4 mt-5">
                          <DataVisualizationDashboard />
                        </div>
                      </div>

                      {/* Official Partner Badge */}
                      <div className="mt-6 p-3 rounded bg-amber-950/20 border border-amber-500/25 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#bf953f] shrink-0" />
                        <div>
                          <p className="text-[9.5px] uppercase font-mono tracking-widest text-[#bf953f] font-bold">Zugelassen und Registriert</p>
                          <p className="text-[8px] text-gray-400 font-mono tracking-tight leading-normal">
                             D-U-N-S: 315676980 · Swiss ID: 756.6199.0539.28 · LEI: 894500GBJSIW8L6ET310
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: SOVEREIGN WEALTH & INFRASTRUCTURE PROJECT MONITOR */}
          {activeTab === "capital" && (
            <motion.div
              key="capital-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl px-4 py-4"
              id="capital-tab-panel"
            >
              <div className="glass-panel p-6 border border-amber-900/40" id="capital-container">
                
                <div className="mb-6 border-b border-amber-900/30 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs uppercase font-mono text-emerald-400 tracking-widest font-bold">Sovereign Wealth Funds &amp; Project corridors</span>
                    </div>
                    <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-1">
                      Finanzmarkt- &amp; Infrastrukturdaten
                    </h1>
                    <p className="text-sm text-gray-400">
                      Zuweisungs-Strukturen der Anchor Limited Partners (LPs), General Partners (GPs) und nationalen Entwicklungskorridore.
                    </p>
                  </div>

                  {/* Aggregate Total Stats */}
                  <div className="flex items-center gap-3 px-4 py-2 border border-emerald-500/20 bg-emerald-950/15 rounded-md">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-mono">Gesamt-Sovereign-Kapital</span>
                      <span className="text-base font-black font-mono text-emerald-400">€ 4.051,6 Mrd. (CNP System)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Wealth Fund Assets and allocation shares */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    <h3 className="text-xs uppercase font-mono tracking-widest text-[#bf953f] font-bold">
                      // Globale SWF Asset Pools
                    </h3>
                    
                    <div className="flex flex-col gap-3">
                      {SWF_ASSETS.map((asset, index) => (
                        <div 
                          key={index} 
                          className="border border-zinc-800 bg-black/55 p-4 rounded-lg hover:border-amber-500/30 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full" 
                                style={{ backgroundColor: asset.color }}
                              ></span>
                              <span className="text-xs bg-zinc-900 border border-zinc-800 text-gray-300 px-1.5 py-0.5 rounded font-mono font-bold">
                                {asset.code}
                              </span>
                              <h4 className="text-sm font-black text-white tracking-tight">{asset.name}</h4>
                            </div>
                            <span className="text-xs font-black font-mono text-[#bf953f]">
                              € {asset.allocatedCapitalBillions.toFixed(1)} Mrd.
                            </span>
                          </div>

                          {/* Allocation share bar */}
                          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ 
                                width: `${asset.marketSharePercentage}%`,
                                backgroundColor: asset.color
                              }}
                            ></div>
                          </div>

                          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                            <span>LPs: <strong className="text-gray-200">{asset.anchorLP}</strong></span>
                            <span>GPs: <strong className="text-gray-200">{asset.generalPartner}</strong></span>
                            <span>Anteil: <strong className="text-emerald-400">{asset.marketSharePercentage}%</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Integrated dynamic custom data visualizer mapping SWF percentage layout */}
                    <div className="p-4 bg-zinc-950/80 border border-amber-950/35 rounded-lg">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold block mb-2">
                        Graphische Aufteilung der Sovereign Wealth Funds (SAGA-PEZ Partner-Framework)
                      </span>
                      <div className="flex h-6 rounded overflow-hidden border border-zinc-800">
                        {SWF_ASSETS.map((asset, index) => (
                          <div 
                            key={index}
                            className="h-full flex items-center justify-center font-mono text-[9px] font-black text-black transition-all hover:opacity-90"
                            style={{ 
                              width: `${asset.marketSharePercentage}%`, 
                              backgroundColor: asset.color 
                            }}
                            title={`${asset.name}: ${asset.marketSharePercentage}%`}
                          >
                            {asset.code}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-500">
                        <span>Min (UNGM-PIC: 19%)</span>
                        <span>SAGA-PEZ (Max: 35%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Infrastructure Projects & Corridors */}
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs uppercase font-mono tracking-widest text-[#bf953f] font-bold mb-4">
                        // Sektorübergreifende Projekt-Korridore
                      </h3>

                      <div className="flex flex-col gap-3.5">
                        {PROJECT_CORRIDORS.map((project, index) => (
                          <div key={index} className="border border-zinc-900 bg-black/40 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs font-bold text-white tracking-wide font-display">
                                {project.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950/45 text-emerald-400 border border-emerald-500/20 rounded font-bold">
                                {project.category}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
                              <span>Budget: <strong className="text-[#bf953f]">€ {project.budgetBillions} Mrd.</strong></span>
                              <span>Nodes: <strong className="text-white">{project.activeNodes}</strong></span>
                              <span>Fortschritt: <strong className="text-emerald-400">{project.completionPercentage}%</strong></span>
                            </div>

                            {/* Completion progress bar */}
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                                style={{ width: `${project.completionPercentage}%` }}
                              ></div>
                            </div>
                            
                            <div className="text-[9px] font-mono text-gray-500 text-right mt-1">
                              Systemarchitekt: {project.leadArchitect}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-amber-950/10 border border-amber-500/20 rounded text-center">
                      <p className="text-[10px] uppercase font-mono text-amber-500 tracking-wider font-bold mb-0.5">Offizieller Nachweis über operative Finanzströme</p>
                      <p className="text-[8.5px] text-gray-400 font-mono leading-normal">
                        Entsprechend UNGM &amp; Swiss ID 756.6199.0539.28 Reglementierung sind alle dargestellten Finanzströme durch die TSAI vollautomatisch erfasst, digital signiert und in der HNOSS-Zentraldatenbank archiviert.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: DECENTRALIZED REAL-TIME AUDITING TERMINAL & CRYPTO SIGNER */}
          {activeTab === "audit" && (
            <motion.div
              key="audit-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl px-4 py-4"
              id="audit-tab-panel"
            >
              <div className="glass-panel p-6 border border-amber-900/40 relative" id="audit-container">
                
                <div className="mb-6 border-b border-amber-900/30 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs uppercase font-mono text-emerald-400 tracking-widest font-bold">Real-time Auditing Grid Interface</span>
                    </div>
                    <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-1">
                      Kryptographischer Transaktions-Signierer &amp; Audit-Datenbank
                    </h1>
                    <p className="text-sm text-gray-400">
                      Erstellen Sie kryptographisch signierte Ledger-Datensätze zur Archivierung in unserer auditierbaren Zentraldatenbank.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">Live Ticker:</span>
                    <button
                      id="btn-ticker-toggle"
                      onClick={() => setLiveTickerActive(!liveTickerActive)}
                      className={`px-3 py-1 rounded text-[10px] font-mono font-bold uppercase cursor-pointer border ${
                        liveTickerActive 
                          ? "bg-emerald-950/45 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.25)]" 
                          : "bg-red-950/45 text-red-400 border-red-500/20"
                      }`}
                    >
                      {liveTickerActive ? "● AKTIV (Auto-Audit)" : "○ STOPPED"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Asymmetric Digital Signer Tool Form */}
                  <div className="lg:col-span-5 border border-amber-500/30 bg-black/80 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Fingerprint className="w-5 h-5 text-[#bf953f]" />
                      <h3 className="text-sm uppercase font-mono tracking-widest text-[#bf953f] font-black">
                        Datensatz Signieren (E2E)
                      </h3>
                    </div>

                    <form onSubmit={handleGenesisSignature} className="flex flex-col gap-4 font-mono text-xs">
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                          Investitions-Quelle / Sponsor (LPs)
                        </label>
                        <select
                          id="select-custom-source"
                          value={customSource}
                          onChange={(e) => setCustomSource(e.target.value)}
                          className="w-full bg-[#000d25] border border-amber-500/35 rounded px-2.5 py-2 text-white outline-none focus:border-amber-400"
                        >
                          <option value="SAGA-PEZ (RepresentativeGP)">SAGA-PEZ General Partner</option>
                          <option value="HNOSS™ Treasury Center">HNOSS™ Capital Reserve</option>
                          <option value="EpsLGSEz Anchor-LP Block">EpsLGSEz Sovereign LP</option>
                          <option value="EU-UNION Regional Account">European Union Governance</option>
                          <option value="Swiss Trust Bank (LEI Node)">Swiss Regulatory Node</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                          Zielprojekt / Corridor
                        </label>
                        <select
                          id="select-custom-destination"
                          value={customDestination}
                          onChange={(e) => setCustomDestination(e.target.value)}
                          className="w-full bg-[#000d25] border border-amber-500/35 rounded px-2.5 py-2 text-white outline-none focus:border-amber-400"
                        >
                          {PROJECT_CORRIDORS.map((project, idx) => (
                            <option key={idx} value={project.name}>{project.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                            Volumen (Milliarden €)
                          </label>
                          <input 
                            id="input-custom-amount"
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#000d25] border border-amber-500/35 rounded px-2.5 py-2 text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                            Architektur-Schicht
                          </label>
                          <select
                            id="select-custom-layer"
                            value={customLayer}
                            onChange={(e) => setCustomLayer(e.target.value as any)}
                            className="w-full bg-[#000d25] border border-amber-500/35 rounded px-2.5 py-2 text-white outline-none"
                          >
                            <option value="TX">TX Layer</option>
                            <option value="TXA">TXA Supervisory</option>
                            <option value="GOV">GOV Government</option>
                            <option value="FI">FI Finance Core</option>
                            <option value="SWFs">SWFs Sovereign Pools</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-2">
                        <button
                          id="btn-sign-ledger"
                          type="submit"
                          disabled={isSigning}
                          className="w-full py-2.5 border border-[#fcf6ba] text-black bg-gradient-to-r from-[#fcf6ba] via-[#bf953f] to-[#fcf6ba] uppercase font-black text-center text-[11px] rounded tracking-widest cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
                        >
                          {isSigning ? "⏳ ERSTELLE SIGNATUR..." : "✍️ SIGNIEREN & SPEICHERN"}
                        </button>
                      </div>

                      {/* Diagnostic Status Message Console */}
                      {recentSigningMsg && (
                        <div className="mt-2 p-2 bg-emerald-950/25 border border-emerald-500/30 rounded text-emerald-400 text-[10px] animate-pulse">
                          {recentSigningMsg}
                        </div>
                      )}
                    </form>

                    <div className="mt-5 border-t border-amber-900/20 pt-4 text-[9px] text-gray-400 leading-normal">
                      <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase mb-1">
                        <Server className="w-3.5 h-3.5" />
                        <span>HNOSS BLOCKCHAIN REGISTRY</span>
                      </div>
                      Dieser Signaturprozess entspricht der EU-Regulation unter Berücksichtigung des NATO Strategic Defense Models. Der Private-Key-Handshake wird durch die schwedische National Identity Card verifiziert.
                    </div>
                  </div>

                  {/* Right Column: Real-time Ledger Chain list */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                          // Blockchain Ledger Stream (TSAI-Netzwerk)
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">Echtzeit-Audits der CNP</span>
                      </div>

                      {/* Live Chain ledger logs list */}
                      <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                        {audits.map((record) => (
                          <div 
                            key={record.id} 
                            className="bg-black/60 border border-zinc-800 p-3 rounded hover:border-emerald-500/30 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono rounded font-bold">
                                  {record.status}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-gray-300">
                                  ID: {record.id}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-emerald-500 font-black">
                                + € {record.amount.toFixed(1)} B
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400 mb-1.5 leading-tight">
                              <div>Sponsor: <span className="text-gray-200">{record.source}</span></div>
                              <div>Projekt: <span className="text-gray-200 truncate block">{record.destination}</span></div>
                            </div>

                            <div className="pt-1.5 border-t border-zinc-900 flex justify-between items-center text-[8.5px] font-mono text-gray-500">
                              <span className="truncate">SIG: <strong className="text-[#bf953f] select-text">{record.signature}</strong></span>
                              <span className="shrink-0 text-[#fcf6ba]/60">{record.hash.slice(0, 18)}...</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded bg-zinc-950/90 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">TSAI Audit Status: GREEN</div>
                          <div className="text-[8px] font-mono text-gray-500">Zentral-Datenbank Archivierung vollständig verschlüsselt</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-[#bf953f] bg-[#bf953f]/10 px-2 py-0.5 border border-[#bf953f]/30 rounded">
                        Latency: 12ms // E2E Valid
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* CONCIL PORTAL - Official Documentation Archive */}
          {activeTab === "concil" && (
            <motion.div
              key="concil-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
              id="concil-tab-panel"
            >
              <ConcilPortal />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* SYSTEM META FOOTER AND CERTIFIED LOGOS */}
      <footer className="relative z-20 max-w-7xl mx-auto px-4 py-8 border-t border-amber-950/20 mt-12 bg-black/60 text-center font-mono pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mb-6 text-gray-400 text-[10px] leading-relaxed">
          <div>
            <h5 className="text-[#bf953f] uppercase font-bold text-xs mb-1 tracking-widest">// CERTIFICATIONS</h5>
            <p>D-U-N-S: 315676980 | 317066336</p>
            <p>UNGM ID: 1172700 | PIC: 873042778</p>
            <p>Global LEI System: 894500GBJSIW8L6ET310</p>
          </div>
          <div>
            <h5 className="text-[#bf953f] uppercase font-bold text-xs mb-1 tracking-widest">// FRAMEWORKS</h5>
            <p>NATO Strategic Defense Model alignment</p>
            <p>European Union Regulatory Governance Layer</p>
            <p>Pentagon Operational Defense Structure</p>
          </div>
          <div>
            <h5 className="text-[#bf953f] uppercase font-bold text-xs mb-1 tracking-widest">// CONTACT SYSTEM</h5>
            <p>government-enterprise@ag-thrust.cloud</p>
            <p>Sweden National ID: Auth Pohl (HolyThreeKings)</p>
            <p>Operating CNP System: Hnoss.PrisMaTHarIOn</p>
          </div>
        </div>
        
        <p className="text-[9px] text-gray-500 max-w-lg mx-auto leading-normal">
          This system is optimized for grand integrated global governance under civilian regulations. 
          HNOSS Identity Grid is built upon strict humanitarian, political, spiritual, and defense coordination axes. 
          © 2026 HNOSS Corporation. All supreme rights preserved under state-independent covenants.
        </p>
      </footer>

      {/* Rainbow Lightning Thunder Footer */}
      <RainbowLightningFooter />
    </div>
  );
}
