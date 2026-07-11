/**
 * Instanz 03 — Verify-Token + Bestätigungs-Mail
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Generiert kryptografisch starken Verify-Token,
 *             speichert nur den SHA-256-Hash (One-Way),
 *             versendet Bestätigungslink mit TTL 24 h.
 *
 * Recht:      DSGVO Art. 32 (Verschlüsselung + Integrität),
 *             AI Act Art. 26 (Nutzerauthentifizierung).
 *
 * STRIDE:     Information Disclosure: nur Hash in DB → Diebstahl
 *             der Datenbank offenbart keine gültigen Tokens.
 *             Replay: One-Time-Use durch verify_token_expires_at
 *             + Statuswechsel `pending_email → pending_admin`.
 */
import { randomBytes, createHash } from "node:crypto";

export interface VerifyToken {
  raw: string;         // sichtbar für den User (Link)
  hash: string;        // gespeichert in DB
  expiresAt: Date;     // TTL
}

/** Zeile 22 — Erzeugt Token + Hash + TTL. */
export function issueVerifyToken(ttlHours = 24): VerifyToken {
  const raw = randomBytes(32).toString("base64url");
  const hash = createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + ttlHours * 3600 * 1000);
  return { raw, hash, expiresAt };
}

/** Zeile 30 — Prüft eingehenden Token gegen gespeicherten Hash. */
export function verifyToken(raw: string, expectedHash: string,
                            expiresAt: Date): boolean {
  if (expiresAt.getTime() < Date.now()) return false;
  const hash = createHash("sha256").update(raw).digest("hex");
  return hash === expectedHash;
}

/** Zeile 38 — Baut den User-facing Confirm-URL. */
export function buildConfirmUrl(baseUrl: string, raw: string): string {
  const u = new URL("/confirm/" + encodeURIComponent(raw), baseUrl);
  return u.toString();
}
