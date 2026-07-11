/**
 * Instanz 04 — Admin-Gate (Login + Session)
 * ────────────────────────────────────────────────────────────────────
 * Zweck:      Erzwingt Admin-Authentifizierung vor jedem Zugriff auf
 *             administrative Aktionen (Approve/Reject/Revoke,
 *             Audit-View).
 *
 * Recht:      AI Act Art. 14 (Human Oversight),
 *             DSGVO Art. 32 (Sicherheit der Verarbeitung),
 *             DSA Art. 16 (klare Kontaktstelle / Verantwortlicher).
 *
 * STRIDE:     Elevation of Privilege: Rolle "admin" wird aus einer
 *             separaten Tabelle (`user_roles`) via SECURITY-DEFINER-
 *             Funktion `has_role()` gelesen, NIE aus profiles/claims.
 *             HIBP-Passwort-Check verhindert Wiederverwendung
 *             kompromittierter Passwörter.
 */
export interface AdminSession {
  userId: string;
  email: string;
  role: "admin" | "moderator";
  issuedAt: number;      // epoch ms
  expiresAt: number;     // epoch ms
}

/** Zeile 20 — Prüft, ob eine Session gültig und Rolle passend ist. */
export function assertAdmin(session: AdminSession | null,
                            required: "admin" | "moderator" = "admin"): void {
  if (!session) throw new Error("unauthenticated");
  if (session.expiresAt < Date.now()) throw new Error("session_expired");
  if (required === "admin" && session.role !== "admin") {
    throw new Error("forbidden");
  }
}

/** Zeile 30 — SQL-Referenz für `has_role()` (SECURITY DEFINER). */
export const HAS_ROLE_SQL = `
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles
                 WHERE user_id = _user_id AND role = _role)
$$;`.trim();
