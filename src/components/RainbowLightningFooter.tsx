import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function RainbowLightningFooter() {
  const [lightningActive, setLightningActive] = useState(false);
  const [rainbowOffset, setRainbowOffset] = useState(0);

  // Rainbow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRainbowOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Random lightning effect
  useEffect(() => {
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLightningActive(true);
        setTimeout(() => setLightningActive(false), 100);
      }
    }, 2000);
    return () => clearInterval(lightningInterval);
  }, []);

  const rainbowGradient = `linear-gradient(${rainbowOffset}deg, 
    #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)`;

  return (
    <motion.footer
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Lightning flash overlay */}
      {lightningActive && (
        <motion.div
          className="fixed inset-0 bg-white pointer-events-none z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.1 }}
        />
      )}

      {/* Main footer content */}
      <div className="bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Rainbow Lightning Thunder text */}
          <motion.div
            className="text-center mb-4"
            animate={{
              textShadow: lightningActive 
                ? "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff"
                : "0 0 5px #ff00ff, 0 0 10px #00ffff, 0 0 15px #00ff00"
            }}
            transition={{ duration: 0.1 }}
          >
            <motion.h3
              className="text-2xl font-bold"
              style={{
                background: rainbowGradient,
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "rainbowFlow 2s linear infinite"
              }}
            >
              ⚡ RAINBOW LIGHTNING THUNDER ⚡
            </motion.h3>
            
            {/* Lightning bolt animation */}
            <motion.div
              className="text-3xl"
              animate={lightningActive ? {
                scale: [1, 1.5, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.2 }}
            >
              🌩️
            </motion.div>
          </motion.div>

          {/* License Information */}
          <div className="text-center text-gray-300 text-xs space-y-2 mb-4">
            <div className="text-[#bf953f] font-bold text-sm mb-2">⚖️ EIGENTUMSRECHTLICHE LIZENZ - ALLE RECHTE VORBEHALTEN</div>
            
            <div className="text-left max-w-4xl mx-auto space-y-1 text-[10px] leading-relaxed">
              <p><strong>HCOS – HNOSS CONTROL OPERATING SYSTEM</strong></p>
              <p><strong>URHEBERRECHTSHINWEIS:</strong> Copyright © 2024–2026 Daniel Pohl. Alle Rechte weltweit vorbehalten.</p>
              
              <p className="mt-2"><strong>EIGENTUMS- UND SCHUTZRECHTE:</strong></p>
              <p>Diese Software ist das exklusive Eigentum von Daniel Pohl sowie der folgenden autorisierten Unternehmen:</p>
              <p className="text-[#bf953f]">HNOSS Enterprises | PRISMANTHARION Corporation | SHINEHEALTHCARE GmbH | STARLIGHTMOVEMENTS AG</p>
              
              <p className="mt-2"><strong>RECHTSSTATUS:</strong></p>
              <p>Pilotprojekt in Zusammenarbeit mit: EU Institutionen, NATO, Pentagon/US DoD, Vereinte Nationen (UN), Deutsche Börse AG</p>
              
              <p className="mt-2"><strong>Status:</strong> KLASSIFIZIERT – PILOTPROJEKT – NICHT FÜR DIE ÖFFENTLICHE VERBREITUNG</p>
              <p className="text-gray-500">Version: PILOT-2026-EU-NATO-CLASSIFIED</p>
            </div>
          </div>

          {/* Institutional URLs */}
          <div className="text-center text-gray-400 text-[9px] space-y-1">
            <p className="text-[#bf953f] font-bold text-xs mb-2">CORP. BY. PLEDGE - OFFIZIELLE INSTITUTIONEN</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 max-w-6xl mx-auto">
              <div className="space-y-0.5">
                <p className="text-[#bf953f] font-bold">Europäische & Internationale</p>
                <a href="https://ec.europa.eu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">EU Kommission</a>
                <a href="https://www.consilium.europa.eu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">EU Rat</a>
                <a href="https://www.europol.europa.eu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Europol</a>
                <a href="https://www.interpol.int" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">INTERPOL</a>
                <a href="https://www.nato.int" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">NATO</a>
                <a href="https://www.un.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Vereinte Nationen</a>
              </div>
              <div className="space-y-0.5">
                <p className="text-[#bf953f] font-bold">Deutsche Behörden</p>
                <a href="https://www.bundestag.de" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Bundestag</a>
                <a href="https://www.verfassungsschutz.de" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">BfV</a>
                <a href="https://www.bafin.de" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">BaFin</a>
                <a href="https://www.deutsche-boerse.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Deutsche Börse</a>
                <a href="https://www.bundesregierung.de" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Bundesregierung</a>
                <a href="https://www.bsi.bund.de" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">BSI</a>
              </div>
              <div className="space-y-0.5">
                <p className="text-[#bf953f] font-bold">US-Regierung</p>
                <a href="https://www.whitehouse.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">White House</a>
                <a href="https://www.defense.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">DoD</a>
                <a href="https://www.darpa.mil" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">DARPA</a>
                <a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Federal Reserve</a>
                <a href="https://www.va.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Veterans Affairs</a>
                <a href="https://www.usa.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">USA.gov</a>
              </div>
              <div className="space-y-0.5">
                <p className="text-[#bf953f] font-bold">Organisationen</p>
                <a href="https://www.oecd.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">OECD</a>
                <a href="https://www.wto.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">WTO</a>
                <a href="https://www.imf.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">IWF</a>
                <a href="https://www.worldbank.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">Weltbank</a>
                <a href="https://www.w3.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">W3C</a>
                <a href="https://www.iso.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block">ISO</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animation keyframes */}
      <style>{`
        @keyframes rainbowFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.footer>
  );
}
