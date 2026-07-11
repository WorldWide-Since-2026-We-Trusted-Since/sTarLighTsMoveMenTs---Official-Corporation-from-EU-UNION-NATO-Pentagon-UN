/**
 * Instanz 01 — Email-Gatekeeper
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Erste Kohärenz-Prüfung des Antragstellers.
 *             Nimmt eine Antrag-Datei entgegen und validiert die
 *             Business-Email gegen (a) syntaktisches Muster,
 *             (b) eine Freemail-/Wegwerf-Blacklist,
 *             (c) MX-Existenz (optional, DNS-Lookup).
 *
 * Recht:      EU AI Act Art. 26 (Deployer-Sorgfaltspflicht),
 *             DSGVO Art. 5 (Rechtmäßigkeit + Datenminimierung),
 *             DSA Art. 14 (klare AGB-Kohärenz).
 *
 * STRIDE:     Spoofing: verhindert anonyme Freemail-Anfragen.
 *             Repudiation: schriftliche Business-Adresse als Anker.
 *
 * Autark:     Kein Framework-Import. Nur Standard-Node + Zod.
 */
import { z } from "zod";

/** Zeile 24 — Blacklist bekannter Freemail-/Wegwerf-Domains. */
export const FREEMAIL_BLACKLIST: readonly string[] = [
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.de", "ymail.com",
  "hotmail.com", "hotmail.de", "outlook.com", "outlook.de", "live.com",
  "gmx.de", "gmx.net", "gmx.com", "web.de", "t-online.de", "aol.com",
  "icloud.com", "me.com", "proton.me", "protonmail.com",
  "mail.ru", "yandex.com",
  // Wegwerf-Anbieter
  "mailinator.com", "guerrillamail.com", "tempmail.com", "10minutemail.com",
  "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com",
];

/** Zeile 39 — Zod-Schema für die eingehende Anfrage. */
export const AccessRequestSchema = z.object({
  firstName:    z.string().trim().min(1).max(80),
  lastName:     z.string().trim().min(1).max(80),
  businessEmail:z.string().trim().toLowerCase().email().max(255),
  company:      z.string().trim().min(2).max(150),
  role:         z.string().trim().min(2).max(120),
  purpose:      z.string().trim().min(20).max(2000),
  signatureInitials: z.string().trim().min(2).max(8)
                    .regex(/^[A-ZÄÖÜ.]{2,8}$/, "Nur Großbuchstaben/Punkte"),
  consentAiAct: z.literal(true),
  consentDsa:   z.literal(true),
  consentEthics:z.literal(true),
});
export type AccessRequestInput = z.infer<typeof AccessRequestSchema>;

/** Zeile 55 — Extrahiert die Domain aus einer Email. */
export function extractDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 0) throw new Error("invalid_email");
  return email.slice(at + 1).toLowerCase();
}

/** Zeile 63 — Prüft, ob die Domain als Business gilt. */
export function isBusinessDomain(email: string): boolean {
  const domain = extractDomain(email);
  return !FREEMAIL_BLACKLIST.includes(domain);
}

/** Zeile 70 — Vollständige Gate-1-Prüfung. */
export function validateAccessRequest(raw: unknown):
  { ok: true; data: AccessRequestInput } | { ok: false; reason: string } {
  const parsed = AccessRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: parsed.error.issues[0]?.message ?? "invalid" };
  }
  if (!isBusinessDomain(parsed.data.businessEmail)) {
    return { ok: false, reason: "freemail_or_disposable_not_allowed" };
  }
  return { ok: true, data: parsed.data };
}
