/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * 
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * @author Daniel Pohl - HNOSS Enterprises | PRISMANTHARION Corporation | SHINEHEALTHCARE GmbH | STARLIGHTMOVEMENTS AG
 * 
 * This software is proprietary and confidential. Unauthorized use, copying, modification,
 * distribution, or reverse engineering is strictly prohibited. Protected by international
 * copyright law, EU directives, US Copyright Act, German UrhG, and patent law.
 * 
 * Pilot project in collaboration with: EU Institutions, NATO, Pentagon/US DoD, United Nations
 * 
 * Status: CLASSIFIED – PILOT PROJECT – NOT FOR PUBLIC DISTRIBUTION
 */
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ExternalLink, Shield, Lock } from "lucide-react";

// Verstorbene Key-Personen Daten (aus den Markdown-Dateien)
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
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Rainbow animation - continual flow
  useEffect(() => {
    const interval = setInterval(() => {
      setRainbowOffset((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Mouse enter/leave for auto-expand/collapse
  const handleMouseEnter = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 3000); // Auto-collapse after 3 seconds
    setHoverTimer(timer);
  };

  const rainbowGradient = `linear-gradient(${rainbowOffset}deg, 
    #ff69b4, #da70d6, #9370db, #8a2be2, #9932cc, #ba55d3, #dda0dd, #ff69b4)`;

  const pinkPurpleShimmer = `linear-gradient(${rainbowOffset}deg, 
    rgba(255, 105, 180, 0.8), 
    rgba(218, 112, 214, 0.6), 
    rgba(147, 112, 219, 0.4), 
    rgba(138, 43, 226, 0.6), 
    rgba(153, 50, 204, 0.8), 
    rgba(218, 112, 214, 0.6), 
    rgba(255, 105, 180, 0.8))`;

  return (
    <>
      {/* Footer Trigger Line - visible when collapsed */}
      {!isExpanded && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-1 cursor-pointer z-40"
          style={{
            background: `linear-gradient(90deg, transparent, #ff69b4, #9370db, #ff69b4, transparent)`,
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* Main Collapsible Footer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.footer
            ref={footerRef}
            className="fixed bottom-0 left-0 right-0 z-50"
            initial={{ opacity: 0, height: 0, y: 50 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.6 
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Transparent Background with Pink-Purple Shimmer */}
            <div 
              className="w-full backdrop-blur-md"
              style={{
                background: 'rgba(15, 5, 35, 0.25)',
                borderTop: '1px solid rgba(255, 182, 193, 0.3)',
              }}
            >
              {/* Shimmer Overlay Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: pinkPurpleShimmer,
                  backgroundSize: '200% 200%',
                  opacity: 0.15,
                  mixBlendMode: 'screen',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              <div className="max-w-7xl mx-auto px-4 py-6 relative">
                {/* Header - In Memory of Great Minds */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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

                {/* Memorial Tribute - Pixel Crystal Water Drops with Rainbow Lights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Verstorbene Key-Personen - Crystal Droplets */}
                  <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
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
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ 
                            scale: 1.02,
                            borderColor: 'rgba(255, 105, 180, 0.5)',
                            boxShadow: '0 0 20px rgba(255, 105, 180, 0.3)'
                          }}
                        >
                          {/* Crystal Water Drop Shimmer Effect */}
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                            style={{
                              background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8), transparent 70%)',
                            }}
                            animate={{
                              background: [
                                'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8), transparent 70%)',
                                'radial-gradient(circle at 50% 100%, rgba(255, 105, 180, 0.6), transparent 70%)',
                                'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8), transparent 70%)',
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-[10px] uppercase tracking-wider text-pink-300/60 font-mono">
                                {person.country}
                              </span>
                              <span className="text-xs">{person.dates.includes('†') ? '🕊️' : '👤'}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{person.name}</h4>
                            <p className="text-xs text-purple-300/80 mb-2">{person.role}</p>
                            <p className="text-[10px] text-pink-200/50 italic">{person.grave}</p>
                          </div>

                          {/* Rainbow Light Glow on Hover */}
                          <motion.div
                            className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-30 blur-lg"
                            style={{
                              background: 'linear-gradient(45deg, #ff69b4, #9370db, #8a2be2, #9932cc)',
                            }}
                            animate={{
                              background: [
                                'linear-gradient(45deg, #ff69b4, #9370db, #8a2be2, #9932cc)',
                                'linear-gradient(45deg, #9932cc, #8a2be2, #9370db, #ff69b4)',
                                'linear-gradient(45deg, #ff69b4, #9370db, #8a2be2, #9932cc)',
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Institutional URLs - Crystal Nodes */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                      🔗 Offizielle Institutionen
                    </h3>
                    <div className="space-y-4">
                      {["Europäische", "Internationale", "Deutsche", "US-Regierung", "Organisationen"].map((category, catIdx) => {
                        const urls = INSTITUTIONAL_URLS.filter(u => u.category === category);
                        if (urls.length === 0) return null;
                        
                        return (
                          <div key={category}>
                            <p className="text-[10px] uppercase tracking-wider text-purple-300/60 mb-2 font-mono">
                              {category}
                            </p>
                            <div className="space-y-1">
                              {urls.map((inst, idx) => (
                                <motion.a
                                  key={inst.label}
                                  href={inst.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs text-pink-200/80 hover:text-white transition-all group"
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: (catIdx * 0.1) + (idx * 0.05) }}
                                  whileHover={{ x: 5 }}
                                >
                                  <span className="text-sm">{inst.icon}</span>
                                  <span className="flex-1">{inst.label}</span>
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* Footer Info - Transparent with Shimmer */}
                <motion.div
                  className="pt-4 border-t border-pink-300/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
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

      {/* Enhanced Crystal Water Drop Styles */}
      <style>{`
        @keyframes rainbowFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Crystal droplet shimmer animation */
        @keyframes crystalPulse {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 105, 180, 0.3); }
          50% { box-shadow: 0 0 20px rgba(147, 112, 219, 0.5), 0 0 30px rgba(255, 105, 180, 0.3); }
        }
        
        /* Text lighthouse effect */
        .text-lighthouse {
          background: linear-gradient(90deg, #ff69b4, #9370db, #8a2be2, #ff69b4);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rainbowFlow 3s linear infinite;
          text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
        }
      `}</style>
    </>
  );
}