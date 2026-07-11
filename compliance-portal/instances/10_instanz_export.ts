/**
 * Instanz 10 — Datenexport (DSGVO Art. 15 & 20)
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Stellt einer betroffenen Person auf Antrag alle über
 *             sie gespeicherten Daten als strukturierten, gängigen
 *             und maschinenlesbaren Export (JSON) bereit.
 *
 * Recht:      DSGVO Art. 15 (Auskunft) + Art. 20 (Portabilität).
 *             Frist Art. 12 Abs. 3: unverzüglich, spätestens 1 Monat.
 */
export interface ExportBundle {
  format: "json";
  generatedAt: string;
  subject: { email: string; requestId: string };
  data: {
    accessRequest:      Record<string, unknown> | null;
    questionResponses:  Array<Record<string, unknown>>;
    auditEntries:       Array<Record<string, unknown>>;
  };
}

/** Zeile 20 — Erzeugt das Export-Objekt. */
export function buildExport(
  subject: { email: string; requestId: string },
  accessRequest: Record<string, unknown> | null,
  questionResponses: Array<Record<string, unknown>>,
  auditEntries: Array<Record<string, unknown>>,
): ExportBundle {
  return {
    format: "json",
    generatedAt: new Date().toISOString(),
    subject,
    data: { accessRequest, questionResponses, auditEntries },
  };
}
