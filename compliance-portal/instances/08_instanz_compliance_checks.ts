/**
 * Instanz 08 — Compliance Rule-Engine
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Wendet eine Sammlung deklarativer Regeln auf einen
 *             Antrag + Antworten an und erzeugt einen strukturierten
 *             Report für den Admin, bevor entschieden wird.
 *
 * Recht:      AI Act Art. 5 (verbotene Praktiken) + Art. 9 (Risikom.-System),
 *             AI Act Art. 26 (Deployer-Pflichten), DSGVO Art. 25.
 */
import type { RequestStatus } from "./05_instanz_admin_review.js";

export type Severity = "info" | "warn" | "block";
export interface RuleResult { code: string; severity: Severity; msg: string; }
export interface RuleContext {
  request: {
    businessEmail: string; company: string; role: string;
    purpose: string; consentAiAct: boolean; consentDsa: boolean;
    consentEthics: boolean; status: RequestStatus;
  };
  answers: Record<string, unknown>;
}

/** Zeile 21 — AI Act Art. 5: verbotene Praktiken (Screening-Text). */
const AI_ACT_ART5_KEYWORDS = [
  "social scoring", "behavioural manipulation", "biometric categorisation",
  "real-time remote biometric", "predictive policing based solely on profiling",
  "emotion recognition at work", "emotion recognition in educational",
];

/** Zeile 28 — Regel-Definitionen. */
export const RULES = [
  {
    code: "CONSENT_MISSING",
    check: (c: RuleContext): RuleResult | null =>
      (!c.request.consentAiAct || !c.request.consentDsa || !c.request.consentEthics)
        ? { code: "CONSENT_MISSING", severity: "block",
            msg: "Antragsteller hat nicht allen Compliance-Bedingungen zugestimmt." }
        : null,
  },
  {
    code: "AI_ACT_ART5_KEYWORD",
    check: (c: RuleContext): RuleResult | null => {
      const t = c.request.purpose.toLowerCase();
      const hit = AI_ACT_ART5_KEYWORDS.find(k => t.includes(k));
      return hit
        ? { code: "AI_ACT_ART5_KEYWORD", severity: "block",
            msg: `Zweck enthält Hinweis auf verbotene Praxis (Art. 5): "${hit}"` }
        : null;
    },
  },
  {
    code: "PURPOSE_TOO_SHORT",
    check: (c: RuleContext): RuleResult | null =>
      c.request.purpose.trim().length < 40
        ? { code: "PURPOSE_TOO_SHORT", severity: "warn",
            msg: "Beschreibung des Anwendungszwecks ist sehr kurz." }
        : null,
  },
];

/** Zeile 60 — Führt alle Regeln aus. */
export function runCompliance(c: RuleContext): {
  ok: boolean; results: RuleResult[];
} {
  const results = RULES.map(r => r.check(c)).filter(Boolean) as RuleResult[];
  const ok = !results.some(r => r.severity === "block");
  return { ok, results };
}
