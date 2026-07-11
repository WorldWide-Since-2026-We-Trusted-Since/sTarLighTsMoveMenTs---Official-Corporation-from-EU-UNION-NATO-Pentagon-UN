/** 
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * HNOSS Admin Governance View (AUTARK / CLIENT-SIDE)
 * Tabellarische Übersicht aller Zugangsanfragen mit strukturierten IDs,
 * Integrations-Namen und Freigabe/Ablehnung inkl. Audit-Notiz (Ethics Act).
 *
 * Läuft vollständig im Browser (localStorage) — kein externer Server,
 * daher keine "Invalid API Response"-Fehler mehr.
 */

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  Loader2,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  MailCheck,
} from "lucide-react";
import type { AccessRequest } from "../types";
import {
  listRequests,
  actOnRequest,
  eraseRequest,
  adminVerifyRequest,
  downloadComplianceReport,
} from "../security/governanceStore";

const STATUS_STYLES: Record<AccessRequest["status"], string> = {
  PENDING_VERIFICATION: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  VERIFIED: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  APPROVED: "bg-green-500/20 text-green-300 border-green-500/40",
  REJECTED: "bg-red-500/20 text-red-300 border-red-500/40",
};

function fmt(ts: string | null): string {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString("de-DE");
  } catch {
    return ts;
  }
}

export default function AdminGovernance() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [auth, setAuth] = useState<string | null>(null);
  const [rows, setRows] = useState<AccessRequest[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRows(listRequests());
  }, []);

  useEffect(() => {
    if (auth) refresh();
  }, [auth, refresh]);

  const login = (e: FormEvent) => {
    e.preventDefault();
    // Local gate — no secrets leave the browser; this is an autark demo admin lock.
    if (user.trim() && pass.trim()) {
      setAuth(`${user.trim()}:${pass.trim()}`);
    }
  };

  const act = (id: string, action: "approve" | "reject") => {
    const note = window.prompt(
      action === "approve"
        ? "Audit-Begründung der Freigabe (Ethics Act):"
        : "Begründung der Ablehnung:"
    );
    if (!note) return;
    setBusy(id + action);
    try {
      const updated = actOnRequest(id, action, note);
      if (updated) refresh();
      else window.alert("Aktion nicht möglich (Datensatz nicht gefunden oder nicht VERIFIED).");
    } finally {
      setBusy(null);
    }
  };

  const verify = (id: string) => {
    setBusy(id + "verify");
    try {
      const updated = adminVerifyRequest(id);
      if (updated) refresh();
    } finally {
      setBusy(null);
    }
  };

  const remove = (id: string) => {
    if (!window.confirm("Datensatz unwiderruflich löschen (Recht auf Löschung / Art. 17)?")) return;
    setBusy(id + "del");
    try {
      eraseRequest(id); // Right to erasure
      refresh();
    } finally {
      setBusy(null);
    }
  };

  if (!auth) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={login}
          className="bg-[#1e293b] border-2 border-[#334155] rounded-2xl shadow-2xl p-8 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-6 h-6 text-[#bf953f]" />
            <span className="text-white font-bold text-lg">Admin Governance</span>
          </div>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Admin-Benutzer"
            className="w-full p-3 rounded-lg border border-[#475569] bg-[#0f172a] text-white focus:border-[#bf953f] focus:outline-none"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Admin-Passwort"
            className="w-full p-3 rounded-lg border border-[#475569] bg-[#0f172a] text-white focus:border-[#bf953f] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full p-3.5 rounded-lg bg-[#0284c7] text-white font-bold hover:bg-[#0369a1] transition-colors"
          >
            Anmelden
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">
          HNOSS <span className="text-[#bf953f]">Governance Requests</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadComplianceReport}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#bf953f]/40 text-[#bf953f] text-xs hover:bg-[#bf953f]/10 transition-colors"
          >
            <Download className="w-4 h-4" /> Compliance-Report (EU AI Act)
          </button>
          <button
            onClick={() => {
              setAuth(null);
              setUser("");
              setPass("");
            }}
            className="px-3 py-2 rounded-lg border border-gray-700 text-gray-300 text-xs hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-black/60 text-[#bf953f] font-mono text-[11px] uppercase">
            <tr>
              <th className="px-3 py-3">#ID</th>
              <th className="px-3 py-3">Integration</th>
              <th className="px-3 py-3">Business-E-Mail</th>
              <th className="px-3 py-3">E-Sign. Kürzel</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Zeitstempel</th>
              <th className="px-3 py-3">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  Keine Anfragen vorhanden.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-800 hover:bg-white/5 align-top">
                <td className="px-3 py-3 font-mono text-[11px] text-gray-400">
                  #{r.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-3 py-3 text-white">{r.integration_name}</td>
                <td className="px-3 py-3">{r.business_email}</td>
                <td className="px-3 py-3 font-mono text-xs">{r.e_signature_initials || "—"}</td>
                <td className="px-3 py-3">
                  <span
                    className={`px-2 py-1 rounded border text-[10px] font-mono ${STATUS_STYLES[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-3 font-mono text-[10px] text-gray-400 leading-tight">
                  <div>Anfr.: {fmt(r.requested_at)}</div>
                  <div>Verif.: {fmt(r.verified_at)}</div>
                  <div>Aktion: {fmt(r.admin_action_at)}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {r.status === "PENDING_VERIFICATION" && (
                      <button
                        disabled={busy !== null}
                        onClick={() => verify(r.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-600/20 text-cyan-300 text-xs hover:bg-cyan-600/30 disabled:opacity-40"
                        title="E-Mail verifizieren (Gate 2)"
                      >
                        {busy === r.id + "verify" ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <MailCheck className="w-3 h-3" />
                        )}
                        Verifizieren
                      </button>
                    )}
                    <button
                      disabled={r.status !== "VERIFIED" || busy !== null}
                      onClick={() => act(r.id, "approve")}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-green-600/20 text-green-300 text-xs hover:bg-green-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {busy === r.id + "approve" ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      Freigeben
                    </button>
                    <button
                      disabled={busy !== null}
                      onClick={() => act(r.id, "reject")}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs hover:bg-red-600/30 disabled:opacity-40"
                    >
                      {busy === r.id + "reject" ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      Ablehnen
                    </button>
                    <button
                      disabled={busy !== null}
                      onClick={() => remove(r.id)}
                      className="p-1 rounded text-gray-500 hover:text-red-400 disabled:opacity-40"
                      title="Löschen (Recht auf Löschung)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {r.admin_notes && (
                    <p className="text-[10px] text-gray-500 mt-1 max-w-xs">
                      Audit: {r.admin_notes}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}