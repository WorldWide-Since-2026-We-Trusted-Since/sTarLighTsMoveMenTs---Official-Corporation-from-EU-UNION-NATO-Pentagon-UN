/**
 * Instanz 07 — Append-Only Audit-Log mit Hash-Chain
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Manipulationssicheres Ereignisprotokoll. Jeder Eintrag
 *             enthält den Hash seines Vorgängers, wodurch jede
 *             Manipulation an einer Zeile alle nachfolgenden Hashes
 *             ungültig macht (Merkle-Chain).
 *
 * Recht:      AI Act Art. 12 (Logging),
 *             DSGVO Art. 5 Abs. 2 (Rechenschaftspflicht) + Art. 32,
 *             DSGVO Art. 33 (Nachweis für Meldung binnen 72 h).
 *
 * STRIDE:     Tampering + Repudiation.
 */
import { createHash } from "node:crypto";

export interface AuditEntry {
  id?: string;
  actor: string;           // user_id oder "system"
  action: string;          // z.B. "request.approve"
  subjectType: string;     // "access_request", "question_response", ...
  subjectId: string;
  payload: Record<string, unknown>;
  createdAt: string;       // ISO 8601 UTC
  prevHash: string;        // hex, oder "GENESIS"
  hash: string;            // hex
}

/** Zeile 24 — Kanonisiert JSON deterministisch. */
export function canonicalJson(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonicalJson).join(",") + "]";
  const keys = Object.keys(v as object).sort();
  return "{" + keys.map(k =>
    JSON.stringify(k) + ":" + canonicalJson((v as any)[k])).join(",") + "}";
}

/** Zeile 33 — Berechnet Hash einer Zeile. */
export function computeHash(prevHash: string, entry: Omit<AuditEntry,"hash"|"prevHash">): string {
  const input = prevHash + "|" + canonicalJson(entry);
  return createHash("sha256").update(input).digest("hex");
}

/** Zeile 40 — Fügt eine Zeile an die Chain an. */
export function appendEntry(prev: AuditEntry | null,
                            e: Omit<AuditEntry,"hash"|"prevHash"|"createdAt"> & { createdAt?: string }
                           ): AuditEntry {
  const prevHash = prev ? prev.hash : "GENESIS";
  const createdAt = e.createdAt ?? new Date().toISOString();
  const base = { ...e, createdAt };
  const hash = computeHash(prevHash, base);
  return { ...base, prevHash, hash };
}

/** Zeile 51 — Verifiziert eine ganze Chain. */
export function verifyChain(entries: AuditEntry[]): { ok: boolean; brokenAt?: number } {
  let prevHash = "GENESIS";
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const expected = computeHash(prevHash,
      { actor: e.actor, action: e.action, subjectType: e.subjectType,
        subjectId: e.subjectId, payload: e.payload, createdAt: e.createdAt });
    if (e.prevHash !== prevHash) return { ok: false, brokenAt: i };
    if (e.hash !== expected)     return { ok: false, brokenAt: i };
    prevHash = e.hash;
  }
  return { ok: true };
}
