/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * HNOSS Email Validation Portal — ZWEITE INSTANZ DES PORTALS
 * ----------------------------------------------------------
 * Eingebettetes, eigenständiges Validierungs-Portal, das als zweite Instanz
 * neben dem Original-Portal fungiert und als zusätzliche Login-/Validierungs-
 * ebene dient (Double-Opt-In E-Mail-Verifikation).
 *
 * Baut vollständig auf dem wiederverwendbaren `EmailValidationModule` und dem
 * autarken Governance-Store (`createRequest` / `verifyRequest`) auf — kein
 * externer Server, kein SMTP.
 */

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ShieldCheck, MailCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import EmailValidationModule from "./EmailValidationModule";
import {
  createRequest,
  buildVerificationLink,
  verifyRequest,
} from "../security/governanceStore";

export default function EmailValidationPortal() {
  const [email, setEmail] = useState("");
  const [integrationName, setIntegrationName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [verifyLink, setVerifyLink] = useState("");
  const [success, setSuccess] = useState(false);

  const [tokenInput, setTokenInput] = useState("");
  const [verifyMsg, setVerifyMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setVerifyLink("");

    if (!acceptedTerms) {
      setError("Terms of Access müssen bestätigt werden (Ethics Act).");
      return;
    }
    if (!integrationName.trim()) {
      setError("Bitte geben Sie einen Integrations-Namen an.");
      return;
    }
    if (!email) {
      setError("Bitte geben Sie eine gültige Business-E-Mail ein.");
      return;
    }

    const result = createRequest({
      integration_name: integrationName,
      business_email: email,
      e_signature_initials: "VAL", // Validierungsinstanz: systemseitiges Kürzel
    });

    if (result.ok === false) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setVerifyLink(buildVerificationLink(result.token));
    setEmail("");
    setIntegrationName("");
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
      setVerifyMsg({
        ok: true,
        text: "E-Mail erfolgreich validiert (Gate 2). Diese Instanz ist zur Login-Freigabe bereit.",
      });
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
          <span className="text-white font-bold text-lg">Email-Validierung · Instanz II</span>
        </div>
        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Zweite Portal-Instanz zur E-Mail-Validierung & Login-Verifikation. Geschäftliche
          Adressen werden gegen die Freemail-/Wegwerf-Blacklist geprüft (Double-Opt-In).
        </p>

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Validierungsantrag eingereicht (Gate 1 bestätigt). Bitte E-Mail via Link verifizieren.
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
              Integrations-Name
            </label>
            <input
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
              placeholder="z. B. SAGA-PEZ Capital Network"
              className="w-full p-3 rounded-lg border border-[#475569] bg-[#0f172a] text-white focus:border-[#bf953f] focus:outline-none"
            />
          </div>

          <EmailValidationModule
            label="Business-E-Mail (Validierung)"
            placeholder="contact@ihre-firma.de"
            value={email}
            onChange={setEmail}
          />

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
            Validierung anfordern
          </button>
        </form>

        {verifyLink && (
          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#bf953f]/30 text-sm">
            <div className="flex items-center gap-2 text-[#bf953f] font-bold text-xs uppercase tracking-wider mb-2">
              <MailCheck className="w-4 h-4" />
              Gate 1 bestätigt — Verifikations-Link
            </div>
            <code className="block break-all text-[11px] text-[#fcf6ba] bg-black/50 p-2 rounded select-all">
              {verifyLink}
            </code>
          </div>
        )}

        <div className="pt-2 border-t border-[#334155]">
          <h3 className="flex items-center gap-2 text-white font-bold text-sm mb-3">
            <MailCheck className="w-4 h-4 text-[#bf953f]" />
            Gate 2 — E-Mail Bestätigung (Login-Validierung)
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