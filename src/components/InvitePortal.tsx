/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * HNOSS Invite Portal (AUTARK / CLIENT-SIDE)
 * Double-Opt-In Zugangsanfrage mit Domain-Blacklist-Validierung.
 * Läuft vollständig im Browser (localStorage) — kein SMTP, kein externer Server.
 */

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ShieldCheck, AlertTriangle, CheckCircle2, MailCheck } from "lucide-react";
import {
  createRequest,
  validateBusinessEmail,
  buildVerificationLink,
  verifyRequest,
} from "../security/governanceStore";

export default function InvitePortal() {
  const [integrationName, setIntegrationName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [initials, setInitials] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verifyLink, setVerifyLink] = useState("");

  // Gate 2 (Double-Opt-In): paste the verification token / link here.
  const [tokenInput, setTokenInput] = useState("");
  const [verifyMsg, setVerifyMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const emailError = businessEmail
    ? validateBusinessEmail(businessEmail).reason ?? ""
    : "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setVerifyLink("");

    if (!acceptedTerms) {
      setError("Terms of Access müssen bestätigt werden (Ethics Act).");
      return;
    }

    const result = createRequest({
      integration_name: integrationName,
      business_email: businessEmail,
      e_signature_initials: initials,
    });

    if (result.ok === false) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    // Autark: in Produktion würde dieser Link per SMTP versendet werden.
    setVerifyLink(buildVerificationLink(result.token));
    setIntegrationName("");
    setBusinessEmail("");
    setInitials("");
    setAcceptedTerms(false);
  };

  const confirmEmail = (e: FormEvent) => {
    e.preventDefault();
    setVerifyMsg(null);
    const token = tokenInput.trim().replace(/^.*#verify=/, "");
    if (!token) {
      setVerifyMsg({ ok: false, text: "Bitte geben Sie den Verifikations-Link oder Token ein." });
      return;
    }
    const res = verifyRequest(token);
    if (res.ok) {
      setVerifyMsg({ ok: true, text: "E-Mail erfolgreich bestätigt (Gate 2). Die Anfrage liegt nun zur Admin-Freigabe vor." });
      setTokenInput("");
    } else {
      setVerifyMsg({ ok: false, text: res.reason || "Verifikation fehlgeschlagen." });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e293b] border-2 border-[#334155] rounded-2xl shadow-2xl p-8 space-y-5"
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-6 h-6 text-[#bf953f]" />
          <span className="text-white font-bold text-lg">Integration Zugangsantrag</span>
        </div>
        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Beantragen Sie den Integrationszugang. Es sind ausschließlich geschäftliche
          E-Mail-Adressen zulässig (Freemail- und Wegwerfprovider sind gesperrt).
        </p>

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Antrag eingereicht (PENDING_VERIFICATION). Ein Administrator muss die Anfrage
            verifizieren und freigeben.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-xs uppercase font-bold tracking-wider mb-1">
              Integration-Name
            </label>
            <input
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
              placeholder="z. B. SAGA-PEZ Capital Network"
              className="w-full p-3 rounded-lg border border-[#475569] bg-[#0f172a] text-white focus:border-[#bf953f] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs uppercase font-bold tracking-wider mb-1">
              Business-E-Mail
            </label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              placeholder="contact@ihre-firma.de"
              className={`w-full p-3 rounded-lg border bg-[#0f172a] text-white focus:outline-none ${
                emailError ? "border-red-500/60" : "border-[#475569] focus:border-[#bf953f]"
              }`}
            />
            {emailError && (
              <p className="text-red-400 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-xs uppercase font-bold tracking-wider mb-1">
              E-Signatur-Kürzel
            </label>
            <input
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              placeholder="z. B. DP"
              className="w-full p-3 rounded-lg border border-[#475569] bg-[#0f172a] text-white focus:border-[#bf953f] focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-[13px] text-[#cbd5e1] select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 scale-110 cursor-pointer"
              required
            />
            <span>
              Ich bestätige die Terms of Access und die Verarbeitung meiner Daten gemäß
              EU AI Act / Ethics Act (Double-Opt-In).
            </span>
          </label>

          <button
            type="submit"
            className="w-full p-3.5 rounded-lg bg-[#0284c7] text-white font-bold hover:bg-[#0369a1] transition-colors"
          >
            Zugangsantrag einreichen
          </button>
        </form>

        {verifyLink && (
          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#bf953f]/30 text-sm">
            <div className="flex items-center gap-2 text-[#bf953f] font-bold text-xs uppercase tracking-wider mb-2">
              <MailCheck className="w-4 h-4" />
              Gate 1 bestätigt — Verifikations-Link (Double-Opt-In)
            </div>
            <p className="text-[#94a3b8] text-xs mb-2">
              In Produktion würde dieser Link per SMTP an die Business-E-Mail gesendet.
              Hier können Sie ihn direkt zum Testen kopieren und unten (Gate 2) einfügen.
            </p>
            <code className="block break-all text-[11px] text-[#fcf6ba] bg-black/50 p-2 rounded select-all">
              {verifyLink}
            </code>
          </div>
        )}

        <div className="pt-2 border-t border-[#334155]">
          <h3 className="flex items-center gap-2 text-white font-bold text-sm mb-3">
            <MailCheck className="w-4 h-4 text-[#bf953f]" />
            Gate 2 — E-Mail Bestätigung (Double-Opt-In)
          </h3>
          <form onSubmit={confirmEmail} className="flex flex-col sm:flex-row gap-2">
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Verifikations-Link oder Token einfügen"
              className="flex-1 p-3 rounded-lg border border-[#475569] bg-[#0f172a] text-white focus:border-[#bf953f] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-3 rounded-lg bg-[#bf953f] text-black font-bold hover:bg-[#d4af37] transition-colors"
            >
              Bestätigen
            </button>
          </form>
          {verifyMsg && (
            <div
              className={`mt-3 flex items-center gap-2 p-3 rounded-lg text-sm ${
                verifyMsg.ok
                  ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                  : "bg-red-950/40 border border-red-500/30 text-red-300"
              }`}
            >
              {verifyMsg.ok ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              )}
              {verifyMsg.text}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
