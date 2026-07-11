/**
 * Instanz 02 — E-Signature Kürzel + kryptografische Bindung
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Bindet das vom Antragsteller angegebene Kürzel an die
 *             angegebene Business-Email mittels HMAC-SHA-256.
 *             Das Ergebnis fungiert als leichtgewichtige, aber
 *             nachprüfbare E-Signature (eIDAS Art. 3 Abs. 10:
 *             "einfache elektronische Signatur").
 *
 * Recht:      eIDAS VO 910/2014 Art. 3 Abs. 10 + Art. 25,
 *             DSGVO Art. 32 (Integrität).
 *
 * STRIDE:     Tampering: HMAC schützt gegen unbemerkte Änderung.
 *
 * Hinweis:    Keine "qualifizierte" Signatur — für QES ist ein
 *             qualifizierter Vertrauensdiensteanbieter (QTSP)
 *             gemäß Art. 3 Abs. 12 erforderlich. Dieses Modul
 *             stellt die einfache Stufe bereit, siehe Kap. 8 des
 *             Concept Papers für den Upgrade-Pfad.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Zeile 21 — Erzeugt HMAC-Signatur über kanonisiertes Payload. */
export function signInitials(payload: {
  email: string; initials: string; requestId: string; issuedAt: string;
}, secret: string): string {
  const canonical = JSON.stringify(payload, Object.keys(payload).sort());
  return createHmac("sha256", secret).update(canonical).digest("hex");
}

/** Zeile 29 — Verifiziert eine Signatur konstant-zeit-vergleichend. */
export function verifyInitials(payload: {
  email: string; initials: string; requestId: string; issuedAt: string;
}, signature: string, secret: string): boolean {
  const expected = signInitials(payload, secret);
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Zeile 40 — Erzeugt frische Request-ID (kryptografisch zufällig). */
export function newRequestId(): string {
  return randomBytes(16).toString("hex");
}
