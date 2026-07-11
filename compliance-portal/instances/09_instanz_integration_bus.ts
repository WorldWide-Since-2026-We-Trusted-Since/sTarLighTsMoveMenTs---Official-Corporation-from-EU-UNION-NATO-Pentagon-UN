/**
 * Instanz 09 — Integration Bus (Orchestrator)
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Verdrahtet die Instanzen 01–08 in einer klaren
 *             Ereigniskette. Andere Systeme koppeln sich per
 *             `EventBus.subscribe(topic, handler)` an, statt sich
 *             direkt auf konkrete Module zu verlassen.
 *
 * Recht:      Loose-coupling erleichtert AI-Act-konforme
 *             Änderungshistorie und Audits (Art. 12, Art. 26).
 */
type Handler<T> = (e: T) => void | Promise<void>;

export class EventBus {
  private map = new Map<string, Handler<any>[]>();
  subscribe<T>(topic: string, h: Handler<T>): () => void {
    const arr = this.map.get(topic) ?? [];
    arr.push(h);
    this.map.set(topic, arr);
    return () => {
      const cur = this.map.get(topic) ?? [];
      this.map.set(topic, cur.filter(x => x !== h));
    };
  }
  async publish<T>(topic: string, e: T): Promise<void> {
    const arr = this.map.get(topic) ?? [];
    for (const h of arr) await h(e);
  }
}

/** Zeile 26 — Kanonische Topics (alle nachgelagerten Consumer). */
export const TOPICS = {
  REQUEST_SUBMITTED:  "request.submitted",
  EMAIL_CONFIRMED:    "request.email_confirmed",
  ADMIN_APPROVED:     "request.approved",
  ADMIN_REJECTED:     "request.rejected",
  ADMIN_REVOKED:      "request.revoked",
  ANSWERS_SUBMITTED:  "answers.submitted",
  AUDIT_APPENDED:     "audit.appended",
} as const;
