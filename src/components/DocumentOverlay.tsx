/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * Universal DocumentOverlay — a full-screen, blur-backed overlay that renders
 * any HNOSS document as an integrated part of the web design rather than a
 * detached "paper". Used by both the Papers Archive and the Concil Portal so
 * that every text layer (Ebene) shares one consistent presentation.
 * 
 * Enhanced with Multi-Language Translation and Text-to-Speech capabilities.
 */

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Globe, Volume2, Pause } from "lucide-react";

export interface DocumentOverlayData {
  /** Document title shown in header + panel */
  title: string;
  /** Short category/type label, e.g. "White Paper" */
  category: string;
  /** Breadcrumb root, e.g. "Papers Archive" or "Concil Portal" */
  breadcrumbRoot: string;
  /** Rendered HTML body (already sanitized by the markdown util) */
  html: string;
  /** Optional meta line, e.g. author + date */
  meta?: string;
  /** Source url (for debugging / "open raw" if desired) */
  source?: string;
}

interface DocumentOverlayProps {
  doc: DocumentOverlayData | null;
  onClose: () => void;
}

// Supported languages for translation
const LANGUAGES = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export default function DocumentOverlay({ doc, onClose }: DocumentOverlayProps) {
  const [selectedLang, setSelectedLang] = useState("de");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Close on Escape key for accessibility
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Prevent background scroll while open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Stop speech when closing
      if (speechRef.current) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [doc, onClose]);

  // Text-to-Speech functions
  const extractText = (html: string): string => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const speakDocument = () => {
    if (!doc?.html) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = extractText(doc.html);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    setShowLangMenu(false);
  };

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          key="doc-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          style={{
            background: "rgba(0, 8, 25, 0.72)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={doc.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="paper-container relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-xl border border-[#bf953f]/30 bg-[#0a0f1f]/95 shadow-[0_0_60px_rgba(191,149,63,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Breadcrumb + Header */}
            <div className="paper-header flex items-start justify-between gap-4 border-b border-[#bf953f]/20 px-6 py-4">
              <div className="min-w-0">
                <nav className="paper-breadcrumb mb-1" aria-label="Breadcrumb">
                  <span className="paper-breadcrumb-root">HNOSS System</span>
                  <span className="paper-breadcrumb-sep">/</span>
                  <span className="paper-breadcrumb-section">{doc.breadcrumbRoot}</span>
                  <span className="paper-breadcrumb-sep">/</span>
                  <span className="paper-breadcrumb-current">{doc.category}</span>
                </nav>
                <h2 className="paper-title truncate font-display text-lg font-bold text-white md:text-xl">
                  {doc.title}
                </h2>
                {doc.meta && (
                  <p className="paper-meta mt-0.5 text-[11px] text-[#bf953f]/80 font-mono">
                    {doc.meta}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Text-to-Speech Button */}
                <button
                  type="button"
                  onClick={speakDocument}
                  aria-label={isSpeaking ? "Vorlesen stoppen" : "Vorlesen"}
                  className="paper-tts flex h-9 w-9 items-center justify-center rounded-lg border border-[#bf953f]/40 text-[#fcf6ba] transition-colors hover:bg-[#bf953f]/20"
                  title="Text vorlesen (TTS)"
                >
                  {isSpeaking ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    aria-label="Sprache wählen"
                    className="paper-lang flex h-9 w-9 items-center justify-center rounded-lg border border-[#bf953f]/40 text-[#fcf6ba] transition-colors hover:bg-[#bf953f]/20"
                    title="Sprache wählen"
                  >
                    <Globe className="h-5 w-5" />
                  </button>
                  
                  {/* Language Dropdown */}
                  {showLangMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#bf953f]/30 bg-[#0a0f1f] py-2 shadow-xl z-50 max-h-64 overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-[#bf953f]/20 transition-colors ${
                            selectedLang === lang.code ? "text-[#bf953f]" : "text-white"
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Schließen"
                  className="paper-close flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#bf953f]/40 text-[#fcf6ba] transition-colors hover:bg-[#bf953f]/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body — A4 Format with DejaVu Sans */}
            <div className="paper-body custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
              <div 
                className="paper-content a4-format dejavu-sans"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  maxWidth: '100%',
                  margin: '0 auto',
                  padding: '20mm',
                  fontSize: '12pt',
                  lineHeight: '1.6',
                  fontFamily: 'DejaVu Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  backgroundColor: 'rgba(15, 20, 35, 0.95)',
                  color: '#e8ecf5',
                }}
                dangerouslySetInnerHTML={{ __html: doc.html }} 
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}