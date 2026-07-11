/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * HNOSS Invite-Governance Server (autark / standalone)
 * -----------------------------------------------------
 * Double-Gate Zugangsportal mit EU AI Act / Digital Act / Ethics Act Compliance.
 * - Keine externen Dienste: SQLite (node:sqlite) als lokale Datei.
 * - Keine SMTP-Abhaengigkeit: Bestaetigungsmail wird serverseitig geloggt
 *   (Link in Konsole + als JSON im Response), damit der Flow lokal funktioniert.
 *
 * Start: node server/governance-server.js
 * Env:   REQUEST_FORM_DATA_PASSWORD, ADMIN_USER, ADMIN_PASSWORD, GOVERNANCE_PORT,
 *        PUBLIC_BASE_URL (optional, fuer den Verification-Link)
 */

import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ---- CORS (zero-config cross-origin for local dev + prod) ------------------
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
}

// ---- Env (zero-trust: niemals Secrets ins Frontend) -------------------------
const REQUEST_FORM_DATA_PASSWORD = process.env.REQUEST_FORM_DATA_PASSWORD || '';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const GOVERNANCE_PORT = Number(process.env.GOVERNANCE_PORT || 8787);
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${GOVERNANCE_PORT}`;
const SIGNATURE_SALT = process.env.SIGNATURE_SALT || 'hnoss-sovereign-invite-salt-v1';

// ---- SQLite (autark) -------------------------------------------------------
const DB_PATH = process.env.GOVERNANCE_DB || path.join(ROOT, 'hnoss_governance.db');
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS access_requests (
    id TEXT PRIMARY KEY,
    integration_name TEXT NOT NULL,
    business_email TEXT UNIQUE NOT NULL,
    e_signature_hash TEXT NOT NULL,
    e_signature_initials TEXT,
    status TEXT DEFAULT 'PENDING_VERIFICATION',
    admin_notes TEXT,
    requested_at TEXT DEFAULT (datetime('now')),
    verified_at TEXT,
    admin_action_at TEXT,
    is_active INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS verification_tokens (
    token TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0
  );
`);

// ---- Helpers ---------------------------------------------------------------
function genId() {
  return crypto.randomUUID();
}

function hashSignature(email, initials) {
  // HMAC-SHA256(Email + Initials + Salt) -> kryptografischer Fingerabdruck
  return crypto
    .createHmac('sha256', SIGNATURE_SALT)
    .update(`${email}|${initials}|${SIGNATURE_SALT}`)
    .digest('hex');
}

// Disposable / free-mail provider blocklist (Compliance: nur Business-Mail)
const BLOCKED_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'trashmail.com', 'yopmail.com', 'getnada.com', 'throwawaymail.com',
  'gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com',
  'yahoo.com', 'icloud.com', 'proton.me', 'protonmail.com', 'gmx.net', 'web.de'
]);

function isValidBusinessEmail(email) {
  const m = /^[^@\s]+@([^@\s]+\.[^@\s]+)$/.exec(email || '');
  if (!m) return false;
  const domain = m[1].toLowerCase();
  return !BLOCKED_DOMAINS.has(domain);
}

function sendVerificationEmail(email, link) {
  // Autark: kein SMTP. Mail wird geloggt; Link ist im Response + Konsole.
  const msg = [
    '===========================================================',
    ' HNOSS INVITE — E-MAIL BESTAETIGUNG (autark, kein SMTP)',
    '===========================================================',
    ` An: ${email}`,
    ` Link: ${link}`,
    ' Hinweis: Diese Mail waere ueber SMTP versendet worden.',
    '===========================================================',
  ].join('\n');
  console.log(msg);
  return true;
}

function issueToken(requestId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24h
  db.prepare(
    'INSERT INTO verification_tokens (token, request_id, expires_at) VALUES (?, ?, ?)'
  ).run(token, requestId, expires);
  return token;
}

// ---- Rate limiting (in-memory, per-IP) -------------------------------------
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 100);
const rateStore = new Map();

function rateLimit(req, res, next) {
  const key = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateStore.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateStore.set(key, entry);
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte spaeter erneut versuchen.' });
  }
  next();
}

// ---- Express App -----------------------------------------------------------
const app = express();
app.use(corsMiddleware);
app.use(rateLimit);
app.use(express.json());

// Admin Basic Auth (nur fuer /api/admin)
function basicAuth(req, res, next) {
  const b64 = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64, 'base64').toString().split(':');
  if (login && password && login === ADMIN_USER && password === ADMIN_PASSWORD) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="HNOSS Admin Governance"');
  res.status(401).json({ error: 'Compliance-Fehler: Autorisierung erforderlich.' });
}
app.use('/api/admin', basicAuth);

// --- Public: Request access ------------------------------------------------
app.post('/api/invite/request', (req, res) => {
  const { password, integrationName, businessEmail, eSignatureInitials, acceptedTerms } = req.body || {};

  if (!REQUEST_FORM_DATA_PASSWORD) {
    return res.status(500).json({ error: 'Server-Konfigurationsfehler: REQUEST_FORM_DATA_PASSWORD fehlt.' });
  }
  if (password !== REQUEST_FORM_DATA_PASSWORD) {
    return res.status(403).json({ error: 'Compliance-Fehler: Ungueltige Anmeldedaten (Gate 1).' });
  }
  if (!acceptedTerms) {
    return res.status(400).json({ error: 'Terms of Access muessen bestaetigt werden (Ethics Act).' });
  }
  if (!integrationName || !businessEmail || !eSignatureInitials) {
    return res.status(400).json({ error: 'Integration-Name, Business-E-Mail und E-Signatur-Kuerzel sind Pflichtfelder.' });
  }
  if (!isValidBusinessEmail(businessEmail)) {
    return res.status(400).json({ error: 'Nur geschaeftliche E-Mail-Adressen zugelassen (keine Freemail/Wegwerfprovider).' });
  }

  const existing = db.prepare('SELECT id, status FROM access_requests WHERE business_email = ?').get(businessEmail);
  if (existing) {
    return res.status(409).json({
      error: 'Diese Business-E-Mail ist bereits registriert.',
      status: existing.status,
    });
  }

  const id = genId();
  const sigHash = hashSignature(businessEmail, eSignatureInitials);
  db.prepare(
    `INSERT INTO access_requests (id, integration_name, business_email, e_signature_hash, e_signature_initials, status)
     VALUES (?, ?, ?, ?, ?, 'PENDING_VERIFICATION')`
  ).run(id, integrationName, businessEmail, sigHash, eSignatureInitials);

  const token = issueToken(id);
  const link = `${PUBLIC_BASE_URL}/api/invite/verify?token=${token}`;
  sendVerificationEmail(businessEmail, link);

  return res.status(201).json({
    message: 'Antrag eingereicht. Bitte E-Mail-Bestaetigung abschliessen (Double-Opt-In).',
    status: 'PENDING_VERIFICATION',
    verificationLink: link, // autark sichtbar; in Produktion nur per Mail
  });
});

// --- Public: Verify email (Gate 2) -----------------------------------------
app.get('/api/invite/verify', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Token fehlt.');

  const row = db.prepare('SELECT * FROM verification_tokens WHERE token = ?').get(token);
  if (!row || row.used) return res.status(410).send('Token ungueltig oder bereits verwendet.');
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(410).send('Token abgelaufen.');
  }

  db.prepare('UPDATE verification_tokens SET used = 1 WHERE token = ?').run(token);
  db.prepare("UPDATE access_requests SET status = 'VERIFIED', verified_at = datetime('now') WHERE id = ?").run(row.request_id);

  return res.send('E-Mail erfolgreich bestaetigt. Ihre Anfrage liegt nun zur Admin-Freigabe vor.');
});

// --- Admin: List requests --------------------------------------------------
app.get('/api/admin/requests', (_req, res) => {
  const rows = db.prepare('SELECT * FROM access_requests ORDER BY requested_at DESC').all();
  res.json(rows);
});

// --- Admin: Approve (requires note) ---------------------------------------
app.post('/api/admin/approve/:id', (req, res) => {
  const { note } = req.body || {};
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Admin-Notiz (Audit-Begruendung) ist Pflicht (Ethics Act).' });
  }
  const info = db.prepare('SELECT status FROM access_requests WHERE id = ?').get(req.params.id);
  if (!info) return res.status(404).json({ error: 'Antrag nicht gefunden.' });
  if (info.status !== 'VERIFIED') {
    return res.status(409).json({ error: 'Nur verifizierte (VERIFIED) Antraege duerfen freigeschaltet werden.' });
  }
  db.prepare(
    "UPDATE access_requests SET status = 'APPROVED', admin_notes = ?, admin_action_at = datetime('now'), is_active = 1 WHERE id = ?"
  ).run(note, req.params.id);
  return res.json({ ok: true, status: 'APPROVED' });
});

// --- Admin: Reject (requires note) ----------------------------------------
app.post('/api/admin/reject/:id', (req, res) => {
  const { note } = req.body || {};
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Admin-Notiz (Ablehnungsbegruendung) ist Pflicht.' });
  }
  const info = db.prepare('SELECT id FROM access_requests WHERE id = ?').get(req.params.id);
  if (!info) return res.status(404).json({ error: 'Antrag nicht gefunden.' });
  db.prepare(
    "UPDATE access_requests SET status = 'REJECTED', admin_notes = ?, admin_action_at = datetime('now'), is_active = 0 WHERE id = ?"
  ).run(note, req.params.id);
  return res.json({ ok: true, status: 'REJECTED' });
});

// --- Admin: Delete (right to erasure, DSGVO/AI Act) -----------------------
app.delete('/api/admin/requests/:id', (req, res) => {
  db.prepare('DELETE FROM verification_tokens WHERE request_id = ?').run(req.params.id);
  db.prepare('DELETE FROM access_requests WHERE id = ?').run(req.params.id);
  return res.json({ ok: true });
});

// --- Admin: Compliance export (immutable audit JSON) ----------------------
app.get('/api/admin/export', (_req, res) => {
  const data = db.prepare('SELECT * FROM access_requests ORDER BY requested_at DESC').all();
  const report = {
    meta: {
      system: 'HNOSS Governance Engine',
      generated_at: new Date().toISOString(),
      compliance_standard: 'EU AI Act / Digital Services Act / Ethics Act Audit Log',
      total: data.length,
    },
    audit_log: data,
  };
  res.setHeader('Content-Disposition', 'attachment; filename="compliance_report_audit.json"');
  res.json(report);
});

const isMainModule =
  process.argv[1] && (
    process.argv[1].endsWith('server/governance-server.js') ||
    process.argv[1].endsWith('governance-server.js') ||
    import.meta.url === `file://${process.argv[1]}`
  );

if (isMainModule) {
  app.listen(GOVERNANCE_PORT, () => {
    console.log(`HNOSS Governance Instanz aktiv auf Port ${GOVERNANCE_PORT}`);
  });
}

export { app, db, hashSignature };