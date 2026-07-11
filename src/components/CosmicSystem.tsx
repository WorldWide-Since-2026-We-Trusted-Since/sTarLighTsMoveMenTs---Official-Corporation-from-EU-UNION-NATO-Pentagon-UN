import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Flame, Heart, Compass } from "lucide-react";

// ==========================================
// 1. STARFIELD / 3D WARP TUNNEL CANVAS
// ==========================================
export interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  color: string;
  size: number;
}

const COLORS = [
  "#fcf6ba", // Gold
  "#bf953f", // Deep Gold
  "#00ffff", // Cyan
  "#ff00ff", // Magenta
  "#00ffcc", // Mint
  "#ffaa00", // Amber
  "#ffffff", // Crystal White
  "#5588ff", // Sapphire Blue
];

export function WarpTunnel({ warpSpeed = 2.5, isSpiced = false }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize star list
  const initStars = (width: number, height: number) => {
    const starCount = 380;
    const list: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      list.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        px: 0,
        py: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 2 + 0.5,
      });
    }
    starsRef.current = list;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Dark blue cosmic backdrop representing deep space warp with minor trails
      ctx.fillStyle = isSpiced ? "rgba(0, 8, 28, 0.15)" : "rgba(0, 5, 20, 0.22)";
      ctx.fillRect(0, 0, w, h);

      // Draw active stars
      starsRef.current.forEach((star) => {
        // Move towards viewer
        star.z -= warpSpeed * (isSpiced ? 4.5 : 1);

        // Reset stars passing the viewer
        if (star.z <= 0) {
          star.z = w;
          star.x = (Math.random() - 0.5) * w * 2;
          star.y = (Math.random() - 0.5) * h * 2;
          star.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          star.px = 0;
          star.py = 0;
        }

        // 3D Perspective projection
        const k = 120 / star.z;
        const sx = star.x * k + cx;
        const sy = star.y * k + cy;

        // Draw star streak/trail if previous position is valid
        if (star.px !== 0 && star.py !== 0 && sx > 0 && sx < w && sy > 0 && sy < h) {
          ctx.beginPath();
          ctx.strokeStyle = star.color;
          // Thicker lines during lightning discharge/spice mode
          ctx.lineWidth = isSpiced ? star.size * 2.2 : star.size;
          ctx.moveTo(star.px, star.py);
          ctx.lineTo(sx, sy);
          ctx.stroke();

          // Twinkle center glowing cores
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(sx - 0.5, sy - 0.5, 1.2, 1.2);
        }

        star.px = sx;
        star.py = sy;
      });

      // Subtle center warp gravity aura
      const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.max(cx, cy) * 0.95);
      gradient.addColorStop(0, "rgba(0, 50, 150, 0.15)");
      gradient.addColorStop(0.35, "rgba(10, 15, 45, 0.05)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [warpSpeed, isSpiced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// ==========================================
// 2. LIGHTNING THUNDER STORM OVERLAY & TEXTS
// ==========================================
interface LightningSystemProps {
  onStrikeTriggered?: (active: boolean) => void;
}

const THUNDER_PHRASES = [
  {
    title: "POLITIK, WISSENSCHAFT, SPIRITUELL TRUST",
    subtitle: "Trusted True Trust in HeavenLy Since",
    desc: "Freiheit, Frieden, Vergebung, Nächstenliebe und Hoffnung über alle Welten."
  },
  {
    title: "DENKST DU NICHT SELBST?",
    subtitle: "Hat der Himmel nicht Recht? — als Footprinter",
    desc: "Die ewige Signatur des Lichts webt das Gewebe der Harmonie über alle Ebenen."
  },
  {
    title: "FUTURE OF LIFE SOULS LIGHTS",
    subtitle: "Verbindung zur kosmischen Wahrheit",
    desc: "Eine unteilbare Kette des Glaubens, der Wissenschaft und des technologischen Fortschritts."
  }
];

export function LightningSystem({ onStrikeTriggered }: LightningSystemProps) {
  const [strike, setStrike] = useState(false);
  const [boltPath, setBoltPath] = useState<string[]>([]);
  const [thunderPhraseIndex, setThunderPhraseIndex] = useState(0);

  // Helper to generate a random zigzag lightning path
  const generateBolt = () => {
    const segments = [];
    const startX = Math.random() * window.innerWidth;
    segments.push(`M ${startX} 0`);
    
    let currentX = startX;
    let currentY = 0;
    const destY = window.innerHeight * 0.85;

    while (currentY < destY) {
      const stepY = Math.random() * 80 + 30;
      const stepX = (Math.random() - 0.5) * 160;
      currentX += stepX;
      currentY += stepY;
      segments.push(`L ${currentX} ${currentY}`);
    }
    return segments.join(" ");
  };

  // Keep the latest onStrikeTriggered callback in a ref so the effect deps stay stable.
  const onStrikeRef = useRef(onStrikeTriggered);
  onStrikeRef.current = onStrikeTriggered;

  const triggerLightningStrike = useCallback(() => {
    // Pick phrase
    setThunderPhraseIndex((prev) => (prev + 1) % THUNDER_PHRASES.length);

    // Generate bolt line
    const pathList = [generateBolt(), generateBolt()];
    setBoltPath(pathList);

    setStrike(true);
    if (onStrikeRef.current) onStrikeRef.current(true);

    // Dynamic flashing intervals
    setTimeout(() => {
      setStrike(false);
      if (onStrikeRef.current) onStrikeRef.current(false);
    }, 180);

    setTimeout(() => {
      setStrike(true);
      if (onStrikeRef.current) onStrikeRef.current(true);
    }, 250);

    setTimeout(() => {
      setStrike(false);
      if (onStrikeRef.current) onStrikeRef.current(false);
    }, 450);
  }, []);

  // Run random lightning bolts every 24 seconds, and add a click event listener for background interaction
  useEffect(() => {
    const handleBackgroundClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if target is interactive or nested inside interactive boundaries
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest(".case-link") ||
        target.closest("#navigation-root") ||
        target.closest("nav") ||
        target.closest("form") ||
        target.closest("[role='button']") ||
        target.closest(".interactive-panel") ||
        target.closest("iframe");

      if (!isInteractive) {
        triggerLightningStrike();
      }
    };

    window.addEventListener("click", handleBackgroundClick);

    const timer = setInterval(() => {
      triggerLightningStrike();
    }, 24000);

    return () => {
      window.removeEventListener("click", handleBackgroundClick);
      clearInterval(timer);
    };
  }, [triggerLightningStrike]);

  return (
    <>
      {/* Absolute floating triggering button embedded harmoniously in the corner */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1 font-mono">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Avoid double triggers
            triggerLightningStrike();
          }}
          id="btn-flash-lightning"
          title="Manuelle Himmels-Signatur auslösen (Oder direkt auf den Hintergrund klicken!)"
          className="p-3.5 bg-zinc-950/90 hover:bg-[#bf953f]/30 border border-[#bf953f] rounded-full text-[#fcf6ba] hover:text-white transition-all shadow-[0_0_15px_rgba(191,149,63,0.3)] hover:scale-105 group active:scale-95 cursor-pointer"
        >
          <Zap className="w-5 h-5 animate-pulse group-hover:rotate-12" />
        </button>
        <span className="text-[7.5px] uppercase text-[#bf953f]/80 tracking-[2px] pr-1">Click BG or Zap</span>
      </div>

      {/* Screen flash light overlay */}
      <AnimatePresence>
        {strike && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 pointer-events-none mix-blend-color-dodge bg-gradient-to-b from-blue-400/50 via-cyan-400/25 to-amber-300/10"
            id="lightning-flash-overlay"
          />
        )}
      </AnimatePresence>

      {/* Lightning physical SVG bolts */}
      {strike && (
        <svg className="fixed inset-0 w-full h-full z-40 pointer-events-none stroke-cyan-200 fill-none filter drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
          {boltPath.map((path, index) => (
            <path
              key={index}
              d={path}
              strokeWidth={index === 0 ? "3" : "1.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      )}

      {/* Flashing Revelation Lyrics Overlay Panel */}
      <AnimatePresence>
        {strike && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-24 z-50 mx-auto max-w-xl p-5 bg-black/95 border-2 border-cyan-400/90 rounded-lg text-center shadow-[0_0_40px_rgba(0,240,255,0.45)] pointer-events-none text-white font-display"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
              <span className="text-[9px] uppercase tracking-[6px] text-cyan-400 font-bold font-mono">
                ✦ Cosmic Spiritual Revelation ✦
              </span>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            </div>

            <h3 className="text-base font-black tracking-wider text-[#fcf6ba] uppercase mb-1">
              {THUNDER_PHRASES[thunderPhraseIndex].title}
            </h3>
            <h4 className="text-[11px] font-bold text-gray-300 tracking-[1.5px] uppercase mb-2 font-mono italic">
              {THUNDER_PHRASES[thunderPhraseIndex].subtitle}
            </h4>

            <div className="p-2.5 bg-cyan-950/25 border border-cyan-500/20 rounded">
              <p className="text-xs text-cyan-200 leading-relaxed font-semibold">
                "{THUNDER_PHRASES[thunderPhraseIndex].desc}"
              </p>
            </div>

            <div className="mt-2 text-[7.5px] font-mono text-cyan-400 uppercase tracking-widest">
              ★ Active Footprint of Lights and Souls ★
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==========================================
// 3. CONTINUOUS SCROLLING NEWS TICKER
// ==========================================
export function NewsTicker() {
  const newsItems = [
    "★ SYSTEM CONNECTED: projekt-since-shinehealth-care.netlify.app — Future of Life Souls Lights verified with highest trust",
    "✦ CORE ENVELOPE: loginsiteauth.goodwelllikewisespell.info — Corporation Since Authentication layer active",
    "★ HACKATHON: hackathon-sign.goodwelllikewisespell.info — Hackathon Public Awareness Awards online",
    "✦ SOUL POLICY: policy.governmententerprise.org/trustedtrustthrust — Policy of Lights Souls verified",
    "★ HERITAGE DIGITIZE: ai-tech-heritage-archive.likewise.live — Archive Heritage Bibliothek active & cataloged",
    "✦ TELECOM INTERCONNECT: chos.ag-thrust.cloud — IBX PEERINGDB IPX CONNECTIONS operating continuously",
    "★ COSMIC TRUTH: Politik, Wissenschaft, Spirituell Thrust. Freiheit, Frieden, Vergebung, Nächstenliebe",
    "✦ FOOTPRINT ACCENT: Denkst du nicht Selbst? Hat der Himmel nicht Recht? — als Footprinter",
    "★ TRANSITION GRID: Multi-layered regulatory integration across European Union and Swiss nodes",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black/85 border-y border-[#bf953f]/50 py-1.5 z-40 shadow-[0_0_15px_rgba(191,149,63,0.15)]">
      <div className="flex whitespace-nowrap gap-12 animate-[marquee_26s_linear_infinite] hover:[animation-play-state:paused] font-mono text-[9px] text-[#fcf6ba] font-bold uppercase tracking-[1.5px]">
        {/* Double list to loop perfectly */}
        {newsItems.concat(newsItems).map((text, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <span className="text-[#bf953f]">•</span>
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// 4. EMBEDDED DYNAMIC REVELATION TIMELINE
// ==========================================
export function NewsTimeline() {
  const steps = [
    {
      date: "PHASE I: COGNITIVE DAWN",
      title: "Future of Life Souls Lights",
      url: "https://projekt-since-shinehealth-care.netlify.app/",
      theme: "Spirituell",
      icon: Heart,
      color: "border-pink-500 text-pink-400",
      descr: "Optimierung der menschlichen Potentiale und Erforschung der feinstofflichen Verbindungen."
    },
    {
      date: "PHASE II: STATE REGULATION",
      title: "Corporation Since Portal",
      url: "https://loginsiteauth.goodwelllikewisespell.info/",
      theme: "Wissenschaft",
      icon: Compass,
      color: "border-cyan-500 text-cyan-400",
      descr: "Archivierung staatlicher Berechtigungsnachweise und digitaler Ausweiskarten (Freja eID)."
    },
    {
      date: "PHASE III: GLOBAL EVENT",
      title: "Hackathon Public Awareness Awards",
      url: "https://hackathon-sign.goodwelllikewisespell.info/",
      theme: "Politik",
      icon: Flame,
      color: "border-amber-500 text-amber-500",
      descr: "Interdisziplinärer Wettbewerb für innovative humanitäre Lösungen und weltweite Bewusstseinsbildung."
    },
    {
      date: "PHASE IV: DIVINE DEBT-FREE POLICY",
      title: "Policy of Lights Souls",
      url: "https://policy.governmententerprise.org/trustedtrustthrust",
      theme: "Spiritual Trust",
      icon: Sparkles,
      color: "border-purple-500 text-purple-400",
      descr: "Vertrauens- und Clearing-Rahmenwerk für globale Harmonie, Frieden, Vergebung und Nächstenliebe."
    },
    {
      date: "PHASE V: HERITAGE ARCHIVE",
      title: "Archive Heritage Bibliothek",
      url: "https://ai-tech-heritage-archive.likewise.live/",
      theme: "Kulturelle Bewahrung",
      icon: Compass,
      color: "border-emerald-500 text-emerald-400",
      descr: "Katalogsammlung des transzendenten Wissens, geschichtlicher Errungenschaften der geistigen Sphäre."
    },
    {
      date: "PHASE VI: IPX PEERING CONNECTIONS",
      title: "IBX PEERINGDB IPX CONNECTIONS. MORE",
      url: "https://chos.ag-thrust.cloud/",
      theme: "Konnektivität",
      icon: Zap,
      color: "border-blue-500 text-blue-400",
      descr: "Hochgeschwindigkeitsnetze und verifizierte Verbindungsknotenpuffer für souveränen Datenverkehr."
    }
  ];

  return (
    <div className="w-full bg-black/70 border border-[#bf953f]/30 rounded-lg p-5 font-mono text-xs text-gray-300">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#bf953f]" />
        <h4 className="text-sm font-bold tracking-widest text-[#fcf6ba] uppercase">
          HEAVENLY TRUST &amp; PLATFORM CHRONOLOGY
        </h4>
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
        Die chronologische Entfaltung der globalen HNOSS-Zwillingsnetzwerke zur Wahrung von Frieden, Vergebung und Kooperation.
      </p>

      <div className="relative pl-4 border-l border-zinc-800 flex flex-col gap-6">
        {steps.map((step, idx) => {
          return (
            <div key={idx} className="relative group">
              {/* Dot indicator */}
              <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-black border-2 ${step.color} group-hover:scale-110 transition-transform`} />
              
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="text-[8.5px] text-[#bf953f] font-bold block tracking-wider">{step.date}</span>
                  <h5 className="font-bold text-white text-xs tracking-tight group-hover:text-amber-300 transition-colors">
                    {step.title}
                  </h5>
                </div>
                <span className="text-[8px] uppercase tracking-widest py-0.5 px-2 bg-zinc-900 border border-zinc-800 rounded text-gray-400 font-bold">
                  {step.theme}
                </span>
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
                {step.descr}
              </p>

              {/* Harmonious Info Button styled matching user specification */}
              <a
                href={step.url}
                target="_blank"
                rel="noreferrer"
                id={`timeline-info-node-${idx}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-[#bf953f]/50 hover:border-[#fcf6ba] text-[#fcf6ba] hover:text-white rounded-[2px] text-[8.5px] uppercase font-bold transition-all hover:bg-[#bf953f]/10 cursor-pointer"
              >
                <span>ⓘ Info &amp; Access Launch</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 5. COLORFUL BLINKING COSMIC STARS OVERLAY
// ==========================================
export function TwinklingStarsOverlay() {
  const [stars, setStars] = useState<Array<{ id: number; top: number; left: number; color: string; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate static nodes with different colors and twinkling speeds
    const starList = [];
    const colors = ["#fcf6ba", "#ffffff", "#00ffff", "#ffbbee", "#66ccff", "#ffd700", "#bf953f"];
    for (let i = 0; i < 45; i++) {
      starList.push({
        id: i,
        top: Math.random() * 95,
        left: Math.random() * 95,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5 + 0.1,
      });
    }
    setStars(starList);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-pulse"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            animationDuration: `${s.delay + 1.5}s`,
            opacity: 0.65,
          }}
        />
      ))}
    </div>
  );
}
