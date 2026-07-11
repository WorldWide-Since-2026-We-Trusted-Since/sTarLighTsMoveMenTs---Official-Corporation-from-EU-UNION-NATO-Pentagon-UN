/**
 * Instanz 06 — Fragemodul (Antragskatalog + Antwort-Persistenz)
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Rendert den (statischen, versionierten) Fragenkatalog,
 *             validiert Antworten per Zod-Schema und persistiert
 *             sie in `question_responses` (eine Zeile je Antwort).
 *
 * Recht:      AI Act Art. 13 (Transparenz gegenüber Nutzern),
 *             AI Act Art. 10 (Datenqualität + Data Governance),
 *             DSGVO Art. 13 (Informationspflicht bei Erhebung).
 *
 * STRIDE:     Tampering: Antworten sind append-only in Verbindung
 *             mit Instanz 07 (Audit).
 */
import { z } from "zod";

export const CATALOG_VERSION = "2026-07-10.1";

/** Zeile 18 — Katalog wird zur Laufzeit aus DB geladen; hier Fallback. */
export interface QuestionDef {
  key: string;
  section: string;
  label: string;
  type: "text" | "textarea" | "boolean" | "choice" | "multiselect";
  required: boolean;
  options?: string[];
  helpText?: string;
}

/** Zeile 29 — Zod-Bau: dynamisches Schema aus dem Katalog. */
export function buildAnswerSchema(catalog: QuestionDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const q of catalog) {
    let s: z.ZodTypeAny;
    switch (q.type) {
      case "boolean":     s = z.boolean(); break;
      case "choice":      s = z.enum((q.options ?? ["-"]) as [string, ...string[]]); break;
      case "multiselect": s = z.array(z.enum((q.options ?? ["-"]) as [string, ...string[]])); break;
      default:            s = z.string().trim().min(1).max(4000);
    }
    shape[q.key] = q.required ? s : s.optional();
  }
  return z.object(shape);
}
