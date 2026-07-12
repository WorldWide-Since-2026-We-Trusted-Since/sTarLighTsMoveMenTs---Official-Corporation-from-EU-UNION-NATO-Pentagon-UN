/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * 
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * @author Daniel Pohl - HNOSS Enterprises | PRISMANTHARION Corporation | SHINEHEALTHCARE GmbH | STARLIGHTMOVEMENTS AG
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ExternalLink, Shield, Lock, ChevronUp, ChevronDown } from "lucide-react";

// Verstorbene Key-Personen Daten
const MEMORIAL_PERSONS = [
  { country: "Deutschland", name: "Konrad Adenauer", role: "1. Bundeskanzler", dates: "† 19. April 1967", grave: "Waldfriedhof Rhöndorf, Bad Honnef" },
  { country: "Deutschland", name: "Theodor Heuss", role: "1. Bundespräsident", dates: "† 12. Dezember 1963", grave: "Waldfriedhof Stuttgart" },
  { country: "Frankreich", name: "Charles de Gaulle", role: "Begründer der V. Republik", dates: "† 9. November 1970", grave: "Friedhof von Colombey-les-Deux-Églises" },
  { country: "Dominikanische Republik", name: "Juan Pablo Duarte", role: "Gründer", dates: "† 15. Juli 1877", grave: "Altar de la Patria, Santo Domingo" },
  { country: "USA", name: "George Washington", role: "1. Präsident", dates: "† 14. Dezember 1799", grave: "Mount Vernon, Virginia" },
  { country: "USA", name: "Benjamin Franklin", role: "Gründervater", dates: "† 17. April 1790", grave: "Christ Church Burial Ground, Philadelphia" },
  { country: "Indien", name: "Mahatma Gandhi", role: "Unabhängigkeitsführer", dates: "† 30. Januar 1948", grave: "Raj Ghat, Neu-Delhi" },
  { country: "Vereinigtes Königreich", name: "Winston Churchill", role: "Kriegspremierminister", dates: "† 24. Januar 1965", grave: "St. Martin's Churchyard, Bladon" },
  { country: "Südafrika", name: "Nelson Mandela", role: "Präsident, Friedensnobelpreis", dates: "† 5. Dezember 2013", grave: "Qunu, Eastern Cape" },
  { country: "Türkei", name: "Mustafa Kemal Atatürk", role: "Gründer und erster Präsident", dates: "† 10. November 1938", grave: "Anıtkabir, Ankara" },
  { country: "Israel", name: "Theodor Herzl", role: "Begründer des modernen Zionismus", dates: "† 3. Juli 1904", grave: "Mount Herzl, Jerusalem" },
  { country: "Pakistan", name: "Muhammad Ali Jinnah", role: "Gründervater", dates: "† 11. September 1948", grave: "Mazar-e-Quaid, Karachi" },
];

// Offizielle Institutionen URLs
const INSTITUTIONAL_URLS = [
  { category: "Europäische", label: "EU Kommission", url: "https://ec.europa.eu", icon: "🏛️" },
  { category: "Europäische", label: "EU Rat", url: "https://www.consilium.europa.eu", icon: "🏛️" },
  { category: "Europäische", label: "Europol", url: "https://www.europol.europa.eu", icon: "🔍" },
  { category: "Europäische", label: "NATO", url: "https://www.nato.int", icon: "🛡️" },
  { category: "Internationale", label: "Vereinte Nationen", url: "https://www.un.org", icon: "🌐" },
  { category: "Deutsche", label: "Bundestag", url: "https://www.bundestag.de", icon: "🇩🇪" },
  { category: "Deutsche", label: "BfV", url: "https://www.verfassungsschutz.de", icon: "🛡️" },
  { category: "Deutsche", label: "Deutsche Börse", url: "https://www.deutsche-boerse.com", icon: "💶" },
  { category: "US-Regierung", label: "White House", url: "https://www.whitehouse.gov", icon: "🇺🇸" },
  { category: "US-Regierung", label: "DoD", url: "https://www.defense.gov", icon: "🛡️" },
  { category: "Organisationen", label: "OECD", url: "https://www.oecd.org", icon: "🏢" },
  { category: "Organisationen", label: "W3C", url: "https://www.w3.org", icon: "💻" },
];

export default function RainbowLightningFooter() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rainbowOffset, setRainbowOffset] = useState(0);

  // Rainbow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRainbowOffset((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const rainbowGradient = `linear-gradient(${rainbowOffset}deg, 
    #ff69b4, #da70d6, #9370db, #8a2be2, #9932cc, #ba55d3, #dda0dd, #ff69b4)`;

  const toggleFooter = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Floating Toggle Button - visible at bottom center */}
      <motion.button
        onClick={toggleFooter}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-[#bf953f]/40 bg-[#0a0f1f]/90 text-[#fcf6ba] transition-colors hover:bg-[#bf953f]/20"
        style={{
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 20px rgba(191, 149, 63, 0.3)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        <span className="text-sm font-mono">In Memory of Great Minds 🕊️</span>
      </motion.button>

      {/* Main Collapsible Footer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.footer
            className="fixed bottom-0 left-0 right-0 z-40"
            initial={{ opacity: 0, height: 0, y: 50 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
          >
            {/* Transparent Background with Pink-Purple Shimmer */}
            <div 
              className="w-full backdrop-blur-md"
              style={{
                background: 'rgba(15, 5, 35, 0.25)',
                borderTop: '1px solid rgba(255, 182, 193, 0.3)',
              }}
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className="flex items-center justify-center gap-3 mb-4"
                    animate={{
                      textShadow: "0 0 10px rgba(255, 105, 180, 0.5), 0 0 20px rgba(147, 112, 219, 0.5), 0 0 30px rgba(255, 105, 180, 0.3)"
                    }}
                  >
                    <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
                    <h2 
                      className="text-3xl md:text-4xl font-bold"
                      style={{
                        background: rainbowGradient,
                        backgroundSize: "400% 400%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "rainbowFlow 3s linear infinite",
                      }}
                    >
                      In Memory of Great Minds 🕊️
                    </h2>
                    <Heart className="w-8 h-8 text-purple-400 animate-pulse" />
                  </motion.div>
                  
                  <p className="text-pink-200/70 text-sm max-w-3xl mx-auto leading-relaxed">
                    Würdevolle Erinnerung an die Architekten staatlicher Grundwerte und Gründerväter
                  </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Memorial Persons */}
                  <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
                      ✨ Verstorbene Schlüsselpersonen
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                      {MEMORIAL_PERSONS.map((person, index) => (
                        <motion.div
                          key={`${person.country}-${person.name}`}
                          className="relative p-4 rounded-lg overflow-hidden group cursor-pointer"
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 182, 193, 0.2)',
                            backdropFilter: 'blur(5px)',
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{ scale: 1.02, borderColor: 'rgba(255, 105, 180, 0.5)', boxShadow: '0 0 20px rgba(255, 105, 180, 0.3)' }}
                        >
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-[10px] uppercase tracking-wider text-pink-300/60 font-mono">{person.country}</span>
                              <span className="text-xs">{person.dates.includes('†') ? '🕊️' : '👤'}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{person.name}</h4>
                            <p className="text-xs text-purple-300/80 mb-2">{person.role}</p>
                            <p className="text-[10px] text-pink-200/50 italic">{person.grave}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Institutional URLs */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                      🔗 Offizielle Institutionen
                    </h3>
                    <div className="space-y-4">
                      {["Europäische", "Internationale", "Deutsche", "US-Regierung", "Organisationen"].map((category, catIdx) => {
                        const urls = INSTITUTIONAL_URLS.filter(u => u.category === category);
                        return urls.length > 0 ? (
                          <div key={category}>
                            <p className="text-[10px] uppercase tracking-wider text-purple-300/60 mb-2 font-mono">{category}</p>
                            <div className="space-y-1">
                              {urls.map((inst, idx) => (
                                <motion.a key={inst.label} href={inst.url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs text-pink-200/80 hover:text-white transition-all group"
                                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (catIdx * 0.05) + (idx * 0.03) }}
                                  whileHover={{ x: 5 }}
                                >
                                  <span className="text-sm">{inst.icon}</span>
                                  <span className="flex-1">{inst.label}</span>
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.a>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* Footer Info */}
                <motion.div className="pt-4 border-t border-pink-300/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2 text-pink-300/70">
                      <Shield className="w-4 h-4" />
                      <span>HCOS – HNOSS CONTROL OPERATING SYSTEM</span>
                    </div>
                    <div className="flex items-center gap-4 text-pink-200/60">
                      <span className="font-mono">© 2024–2026 Daniel Pohl</span>
                      <Lock className="w-4 h-4" />
                      <span className="text-[10px]">KLASSIFIZIERT – PILOTPROJEKT</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes rainbowFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}