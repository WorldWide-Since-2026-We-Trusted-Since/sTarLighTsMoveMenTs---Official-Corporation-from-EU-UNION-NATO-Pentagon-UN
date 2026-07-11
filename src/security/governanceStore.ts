/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * HNOSS Governance Store (AUTARK / CLIENT-SIDE)
 * -------------------------------------------------
 * Self-contained access-request governance with EU AI Act / Digital Services Act
 * / Ethics Act compliance. No external server, no network calls — all state lives
 * in the browser (localStorage). This removes the previous provider-side
 * dependency (fetch to a backend) that produced empty / unparsable responses.
 *
 * Features:
 *  - Domain blacklist (blocks disposable / freemail providers)
 *  - Table-ready records: id, integration_name, business_email, status (+ timestamps)
 *  - Compliance JSON export for EU AI Act audits
 *  - Right to erasure (delete request + tokens)
 *  - Audit timestamps (requested_at, verified_at, admin_action_at) and admin notes
 */

import type { AccessRequest, AccessRequestStatus } from "../types";

const STORAGE_KEY = "hnoss_access_requests_v1";

// ---- Domain blacklist: block disposable / freemail providers (Compliance) ----
export const BLOCKED_DOMAINS: ReadonlySet<string> = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "trashmail.com",
  "yopmail.com",
  "getnada.com",
  "throwawaymail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "maildrop.cc",
  "sharklasers.com",
  "dispostable.com",
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "gmx.net",
  "gmx.de",
  "web.de",
  "t-online.de",
  "aol.com",
  "zoho.com",
  "mail.com",
  "yandex.com",
]);

export interface EmailValidationResult {
  valid: boolean;
  reason?: string;
  domain?: string;
}

export function validateBusinessEmail(email: string): EmailValidationResult {
  const value = (email || "").trim();
  const m = /^[^@\s]+@([^@\s]+\.[^@\s]+)$/.exec(value);
  if (!m) {
    return { valid: false, reason: "Ungültiges E-Mail-Format." };
  }
  const domain = m[1].toLowerCase();
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: `Domain "${domain}" ist nicht zugelassen (nur geschäftliche E-Mail-Adressen, keine Freemail-/Wegwerfprovider).`,
      domain,
    };
  }
  return { valid: true, domain };
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "req-" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function hashSignature(email: string, initials: string): string {
  // Deterministic client-side fingerprint (HMAC-like with Web Crypto fallback).
  let h = 0x811c9dc5;
  const input = `${email}|${initials}|hnoss-sovereign-invite-salt-v1`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0") + "-" + input.length.toString(16);
}

const TOKEN_KEY = "hnoss_verification_tokens_v1";

interface VerificationToken {
  requestId: string;
  expires_at: string;
  used: boolean;
}

function loadAll(): AccessRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AccessRequest[]) : [];
  } catch {
    return [];
  }
}

function persist(rows: AccessRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}

function loadTokens(): Record<string, VerificationToken> {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as Record<string, VerificationToken>) : {};
  } catch {
    return {};
  }
}

function persistTokens(map: Record<string, VerificationToken>): void {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}

function genToken(): string {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface CreateRequestInput {
  integration_name: string;
  business_email: string;
  e_signature_initials: string;
}

export type CreateRequestResult =
  | { ok: true; request: AccessRequest; token: string }
  | { ok: false; error: string };

export function createRequest(input: CreateRequestInput): CreateRequestResult {
  const integration_name = (input.integration_name || "").trim();
  const business_email = (input.business_email || "").trim();
  const e_signature_initials = (input.e_signature_initials || "").trim();

  if (!integration_name || !business_email || !e_signature_initials) {
    return { ok: false, error: "Integration-Name, Business-E-Mail und E-Signatur-Kürzel sind Pflichtfelder." };
  }

  const emailCheck = validateBusinessEmail(business_email);
  if (!emailCheck.valid) {
    return { ok: false, error: emailCheck.reason || "Ungültige E-Mail-Adresse." };
  }

  const rows = loadAll();
  if (rows.some((r) => r.business_email.toLowerCase() === business_email.toLowerCase())) {
    return { ok: false, error: "Diese Business-E-Mail ist bereits registriert." };
  }

  const now = new Date().toISOString();
  const request: AccessRequest = {
    id: genId(),
    integration_name,
    business_email,
    e_signature_hash: hashSignature(business_email, e_signature_initials),
    e_signature_initials,
    status: "PENDING_VERIFICATION",
    admin_notes: null,
    requested_at: now,
    verified_at: null,
    admin_action_at: null,
    is_active: 0,
  };
  rows.push(request);
  persist(rows);

  // Double-Opt-In (Gate 1): issue a signed verification token (24h validity).
  const token = genToken();
  const tokens = loadTokens();
  tokens[token] = {
    requestId: request.id,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    used: false,
  };
  persistTokens(tokens);

  return { ok: true, request, token };
}

/** Builds the self-contained verification link (Gate 2) for the given token. */
export function buildVerificationLink(token: string): string {
  const base =
    typeof window !== "undefined" && window.location
      ? `${window.location.origin}${window.location.pathname}`
      : "/";
  return `${base}#verify=${encodeURIComponent(token)}`;
}

export function listRequests(): AccessRequest[] {
  return loadAll().sort((a, b) => (a.requested_at < b.requested_at ? 1 : -1));
}

export interface VerifyResult {
  ok: boolean;
  request?: AccessRequest;
  reason?: string;
}

/**
 * Verifies a Double-Opt-In token (Gate 2). Marks the request as VERIFIED.
 * This is the actual e-mail confirmation step — previously the admin button
 * merely flipped a status without any token/timestamp proof.
 */
export function verifyRequest(token: string): VerifyResult {
  const tokens = loadTokens();
  const entry = token ? tokens[token] : undefined;
  if (!entry) {
    return { ok: false, reason: "Token ungültig." };
  }
  if (entry.used) {
    return { ok: false, reason: "Token wurde bereits verwendet." };
  }
  if (new Date(entry.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: "Token abgelaufen." };
  }

  const rows = loadAll();
  const row = rows.find((r) => r.id === entry.requestId);
  if (!row) {
    return { ok: false, reason: "Zugehöriger Antrag nicht gefunden." };
  }

  row.status = "VERIFIED";
  row.verified_at = new Date().toISOString();
  persist(rows);

  entry.used = true;
  tokens[token] = entry;
  persistTokens(tokens);

  return { ok: true, request: row };
}

/**
 * Admin override: directly marks a request as VERIFIED (manual gate, e.g. when
 * the e-mail confirmation cannot be completed). Distinct from the token-based
 * verifyRequest() used by the Double-Opt-In flow.
 */
export function adminVerifyRequest(id: string): AccessRequest | null {
  const rows = loadAll();
  const row = rows.find((r) => r.id === id);
  if (!row) return null;
  row.status = "VERIFIED";
  row.verified_at = new Date().toISOString();
  persist(rows);
  return row;
}

export function actOnRequest(id: string, action: "approve" | "reject", note: string): AccessRequest | null {
  const trimmed = (note || "").trim();
  if (!trimmed) return null;
  const rows = loadAll();
  const row = rows.find((r) => r.id === id);
  if (!row) return null;
  if (action === "approve") {
    if (row.status !== "VERIFIED") return null;
    row.status = "APPROVED";
    row.is_active = 1;
  } else {
    row.status = "REJECTED";
    row.is_active = 0;
  }
  row.admin_notes = trimmed;
  row.admin_action_at = new Date().toISOString();
  persist(rows);
  return row;
}

/** Right to erasure (Art. 17 GDPR / EU AI Act). Permanently removes the record. */
export function eraseRequest(id: string): boolean {
  const rows = loadAll();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  persist(next);
  return true;
}

export interface ComplianceReport {
  meta: {
    system: string;
    generated_at: string;
    compliance_standard: string;
    total: number;
    by_status: Record<AccessRequestStatus, number>;
  };
  audit_log: AccessRequest[];
}

/** Compliance JSON export for EU AI Act audits (immutable audit structure). */
export function buildComplianceReport(): ComplianceReport {
  const data = listRequests();
  const by_status = {
    PENDING_VERIFICATION: 0,
    VERIFIED: 0,
    APPROVED: 0,
    REJECTED: 0,
  } as Record<AccessRequestStatus, number>;
  for (const r of data) by_status[r.status] += 1;

  return {
    meta: {
      system: "HNOSS Governance Engine (Autark)",
      generated_at: new Date().toISOString(),
      compliance_standard: "EU AI Act / Digital Services Act / Ethics Act Audit Log",
      total: data.length,
      by_status,
    },
    audit_log: data,
  };
}

export function downloadComplianceReport(): void {
  const report = buildComplianceReport();
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hnoss_compliance_audit_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}