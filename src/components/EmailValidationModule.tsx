/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * HNOSS Email Validation Module (reusable / embeddable)
 * -----------------------------------------------------
 * Self-contained, embeddable email-validation UI built on the shared
 * `validateBusinessEmail` governance routine (domain blacklist for disposable /
 * freemail providers — EU AI Act / Ethics Act compliance).
 *
 * This module can be dropped into any other component (inline) OR rendered as a
 * standalone card. It is the building block for the second portal instance
 * (EmailValidationPortal) used as an additional login / validation gate.
 */

import { useState, type ChangeEvent } from "react";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";
import { validateBusinessEmail } from "../security/governanceStore";

export interface EmailValidationModuleProps {
  /** Visual style: `inline` (compact input) or `card` (bordered panel). */
  variant?: "inline" | "card";
  /** Label shown above the input. */
  label?: string;
  /** Placeholder for the input. */
  placeholder?: string;
  /** Controlled value (optional). */
  value?: string;
  /** Controlled onChange (optional). */
  onChange?: (email: string) => void;
  /** Called with the normalized email once it passes validation. */
  onValid?: (email: string) => void;
  /** Called whenever the value becomes invalid (or empty). */
  onInvalid?: () => void;
  /** Auto-validate on every keystroke (default true). */
  live?: boolean;
}

export default function EmailValidationModule({
  variant = "card",
  label = "Business-E-Mail",
  placeholder = "contact@ihre-firma.de",
  value,
  onChange,
  onValid,
  onInvalid,
  live = true,
}: EmailValidationModuleProps) {
  const [internal, setInternal] = useState("");
  const email = value !== undefined ? value : internal;

  const result = email ? validateBusinessEmail(email) : null;
  const isValid = !!result?.valid;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (value === undefined) setInternal(next);
    onChange?.(next);
    if (live) {
      const r = validateBusinessEmail(next);
      if (r.valid) onValid?.(next.trim());
      else onInvalid?.();
    }
  };

  const showError = !!email && !isValid;
  const showOk = !!email && isValid;

  const inputEl = (
    <div className="w-full">
      {label && (
        <label className="block text-gray-300 text-xs uppercase font-bold tracking-wider mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Mail
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            showError ? "text-red-400" : showOk ? "text-emerald-400" : "text-[#bf953f]"
          }`}
        />
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={showError}
          className={`w-full pl-9 pr-3 py-3 rounded-lg border bg-[#0f172a] text-white focus:outline-none transition-colors ${
            showError
              ? "border-red-500/60 focus:border-red-400"
              : showOk
              ? "border-emerald-500/50 focus:border-emerald-400"
              : "border-[#475569] focus:border-[#bf953f]"
          }`}
        />
      </div>
      {showError && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {result?.reason}
        </p>
      )}
      {showOk && (
        <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Geschäftliche E-Mail gültig (Domain: {result?.domain}).
        </p>
      )}
    </div>
  );

  if (variant === "inline") {
    return inputEl;
  }

  return (
    <div className="w-full p-4 rounded-lg border border-[#334155] bg-[#0f172a]/60">
      {inputEl}
    </div>
  );
}