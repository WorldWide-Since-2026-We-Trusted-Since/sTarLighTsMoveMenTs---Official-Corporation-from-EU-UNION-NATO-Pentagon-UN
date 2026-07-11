/**
 * Instanz 11 — Löschung (DSGVO Art. 17)
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Löscht alle personenbezogenen Daten einer betroffenen
 *             Person; ersetzt sie im Audit-Log durch Pseudonyme,
 *             sodass die Hash-Chain intakt bleibt (Kollisions- und
 *             Integritätsschutz gemäß Art. 32).
 *
 * Recht:      DSGVO Art. 17 (Recht auf Löschung). Ausnahmen nach
 *             Art. 17 Abs. 3 lit. b (rechtliche Verpflichtung),
 *             lit. e (Rechtsansprüche) sind protokolliert zu prüfen.
 *
 * Wichtig:    Audit-Zeilen werden NICHT physikalisch gelöscht,
 *             sondern pseudonymisiert — sonst bricht die Chain.
 */
export interface DeletionPlan {
  requestId: string;
  pseudonym: string;          // z.B. "DEL_" + hash(email + salt)
  keepAuditLog: true;         // Chain nur pseudonymisieren
}

/** Zeile 20 — Erzeugt einen Löschplan. */
export function planDeletion(requestId: string, emailHash: string): DeletionPlan {
  return { requestId, pseudonym: "DEL_" + emailHash.slice(0, 16), keepAuditLog: true };
}

/** Zeile 24 — SQL-Skizze der Umsetzung (nur zur Referenz). */
export const DELETE_SQL = `
BEGIN;
  DELETE FROM public.question_responses WHERE request_id = $1;
  DELETE FROM public.access_requests    WHERE id         = $1;
  UPDATE public.audit_log
     SET payload = jsonb_set(payload, '{email}', to_jsonb($2::text), true)
   WHERE subject_id = $1;
COMMIT;`.trim();
