import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function RainbowLightningFooter() {
  const [isHovered, setIsHovered] = useState(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Lightning flash overlay */}
      {lightningActive && (
        <motion.div
          className="fixed inset-0 bg-white pointer-events-none z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.1 }}
        />
      )}

      {/* Circular/Diamond shaped footer with rainbow glow */}
      <motion.div
        animate={{
          scale: isHovered ? 1 : 0.95,
          opacity: isHovered ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
        className="mx-auto mt-2 w-fit"
      >
        {/* Diamond/Rhombus shape with rainbow border */}
        <div 
          className="p-1 rotate-45"
          style={{
            background: rainbowGradient,
            backgroundSize: "400% 400%",
            boxShadow: `0 0 30px ${rainbowGradient}, 0 0 60px ${rainbowGradient}, inset 0 0 30px ${rainbowGradient}`,
            animation: "rainbowFlow 3s ease infinite"
          }}
        >
          <div 
            className="bg-black rotate-[-45deg] p-8 relative z-10"
            style={{
              minWidth: "350px",
              minHeight: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Crystal clear rainbow text with strong visibility */}
            <motion.div
              className="text-center relative z-20"
              animate={{
                textShadow: lightningActive 
                  ? "0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00ff, 0 0 50px #ff00ff, 0 0 60px #00ffff"
                  : "0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ffff00, 0 0 40px #00ff00"
              }}
              transition={{ duration: 0.1 }}
              style={{
              position: "relative",
              zIndex: 20
            }}>
              <motion.h3
                className="text-2xl font-black mb-3"
                style={{
                  background: rainbowGradient,
                  backgroundSize: "400% 400%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "rainbowFlow 2s linear infinite",
                  filter: "drop-shadow(0 0 3px rgba(0,0,0,0.8))",
                  position: "relative",
                  zIndex: 20
                }}
              >
                ⚖️ EIGENTUMSRECHTLICHE LIZENZ
              </motion.h3>
              <motion.p
                className="text-xl font-black"
                style={{
                  background: rainbowGradient,
                  backgroundSize: "400% 400%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "rainbowFlow 2.5s linear infinite",
                  filter: "drop-shadow(0 0 3px rgba(0,0,0,0.8))",
                  position: "relative",
                  zIndex: 20
                }}
              >
                ALLE RECHTE VORBEHALTEN
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

        {/* Expandable content - Kristallklares Lizenzdisplay mit Karo-Design */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? "auto" : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {/* Karo/Checkerboard Style License Container */}
          <div className="border-2 rounded-lg p-6 mb-4 bg-black/90 relative max-w-5xl mx-auto">
            {/* Karo Background Pattern - Caro style grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(45deg, #bf953f 25%, transparent 25%),
                  linear-gradient(-45deg, #bf953f 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #bf953f 75%),
                  linear-gradient(-45deg, transparent 75%, #bf953f 75%)
                `,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
              }}></div>
            </div>
            
            {/* Rainbow border glow */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: rainbowGradient,
                backgroundSize: "400% 400%",
                borderRadius: "inherit",
                animation: "rainbowFlow 3s ease infinite"
              }}
            />
            
            <div className="text-center space-y-3 relative z-10">
              {/* Crystal Clear License Header */}
              <div className="border-2 border-[#bf953f]/50 rounded-lg p-4 bg-black/80">
                <h4 className="text-lg font-black text-white mb-2 tracking-wider">
                  ⚖️ EIGENTUMSRECHTLICHE LIZENZ
                </h4>
                <p className="text-xl font-black" style={{
                  background: rainbowGradient,
                  backgroundSize: "400% 400%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "rainbowFlow 2s linear infinite"
                }}>
                  ALLE RECHTE VORBEHALTEN
                </p>
              </div>
              
              <p className="text-sm font-bold text-[#bf953f]">
                HCOS – HNOSS CONTROL OPERATING SYSTEM
              </p>

              <div className="text-xs text-gray-200 space-y-2 bg-black/60 p-4 rounded-lg border border-[#bf953f]/30">
                <p className="font-bold text-white">⚠️ URHEBERRECHTSHINWEIS:</p>
                <p className="text-white font-medium">Copyright © 2024–2026 Daniel Pohl. Alle Rechte weltweit vorbehalten.</p>
                
                <p className="font-bold text-white pt-2">EIGENTUMS- UND SCHUTZRECHTE:</p>
                <p className="text-gray-300">
                  Diese Software, einschließlich, aber nicht beschränkt auf Quellcode, Objektcode, Dokumentation, Algorithmen, 
                  Architekturdesigns und alle damit verborgen geistigen Eigentumsrechte (zusammenfassend „Das Werk"), ist das 
                  exklusive Eigentum von Daniel Pohl sowie der folgenden autorisierten Unternehmen:
                </p>
                <p className="text-[#bf953f] font-black text-sm py-1">
                  HNOSS Enterprises | PRISMANTHARION Corporation | SHINEHEALTHCARE GmbH | STARLIGHTMOVEMENTS AG
                </p>
                
                <p className="font-bold text-red-400 pt-2">KEINE RECHTEÜBERTRAGUNG:</p>
                <p className="text-gray-300 text-[10px]">
                  DURCH DIE VERÖFFENTLICHUNG, VERFÜGBARKEIT ODER EXISTENZ DIESES CODES WERDEN KEINERLEI RECHTE GEWÄHRT, 
                  ÜBERTRAGEN ODER ABGETRETEN.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-left">
                <div className="bg-black/50 p-3 rounded border border-red-900/30">
                  <p className="text-red-400 font-bold text-xs mb-2">NUTZUNGSBESCHRÄNKUNGEN:</p>
                  <ul className="text-[10px] text-gray-400 space-y-1">
                    <li>• KEINE NUTZUNG ohne ausdrückliche Genehmigung</li>
                    <li>• KEINE KOPIEN oder Duplizierung</li>
                    <li>• KEINE ÄNDERUNG oder abgeleitete Werke</li>
                    <li>• KEINE VERBREITUNG oder Weitergabe</li>
                    <li>• KEIN KLONEN von Repositories</li>
                    <li>• KEINE REVERSE-ENGINEERING</li>
                  </ul>
                </div>
                
                <div className="bg-black/50 p-3 rounded border border-yellow-900/30">
                  <p className="text-yellow-400 font-bold text-xs mb-2">RECHTSSTATUS:</p>
                  <ul className="text-[10px] text-gray-400 space-y-1">
                    <li>• Institutionen der Europäischen Union</li>
                    <li>• NATO (North Atlantic Treaty Organization)</li>
                    <li>• The Pentagon / U.S. Department of Defense</li>
                    <li>• Vereinte Nationen (UN)</li>
                    <li>• Deutsche Börse AG</li>
                    <li>• Weitere klassifizierte Partner</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
