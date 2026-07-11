/**
 * Instanz 05 — Admin Review (State-Machine)
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Definiert die zulässigen Zustandsübergänge einer
 *             Access-Anfrage. Nur legale Übergänge sind erlaubt;
 *             illegale Übergänge werfen und werden im Audit-Log
 *             als Sicherheitsvorfall vermerkt.
 *
 * Recht:      AI Act Art. 14 (menschliche Aufsicht + Eingriff),
 *             DSA Art. 16 (Beschwerdefähige Entscheidungen),
 *             DSGVO Art. 22 (keine rein automatisierte Entscheidung
 *             mit rechtlicher Wirkung — Admin entscheidet manuell).
 *
 * STRIDE:     Tampering + Repudiation: jede Transition landet
 *             im Audit-Log inkl. actor, subject, prev_hash.
 */
export type RequestStatus =
  | "pending_email" | "pending_admin" | "approved"
  | "rejected"      | "revoked";

const TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  pending_email: ["pending_admin"],
  pending_admin: ["approved", "rejected"],
  approved:      ["revoked"],
  rejected:      [],
  revoked:       [],
};

/** Zeile 24 — Wirft, wenn Übergang unzulässig. */
export function assertTransition(from: RequestStatus, to: RequestStatus): void {
  const allowed = TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new Error(`illegal_transition:${from}->${to}`);
  }
}

/** Zeile 32 — Endzustände (keine weiteren Übergänge). */
export function isTerminal(s: RequestStatus): boolean {
  return TRANSITIONS[s]?.length === 0;
}
