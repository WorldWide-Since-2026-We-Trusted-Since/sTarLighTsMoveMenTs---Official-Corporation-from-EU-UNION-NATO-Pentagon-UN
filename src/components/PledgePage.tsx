import React, { useState } from "react";
import { motion } from "motion/react";

const INSTITUTIONS = [
  { id: "NATO", name: "NATO", desc: "North Atlantic Treaty Organization", sub: "Strategic Defense Model", url: "https://www.nato.int/en" },
  { id: "VA", name: "VA", desc: "U.S. Department of Veterans Affairs", sub: "Veterans Welfare & Reintegration", url: "https://department.va.gov/" },
  { id: "OCC", name: "OCC", desc: "Office of the Comptroller of the Currency", sub: "Secure Portal", url: "https://occ.secureocp.com" },
  { id: "SCOTUS", name: "SCOTUS", desc: "Supreme Court of the United States", sub: "Judicial Authority · Smart Justice", url: "https://www.supremecourt.gov/" },
  { id: "UN OLA", name: "UN OLA", desc: "United Nations · Office of Legal Affairs", sub: "Global Coordination Layer", url: "https://www.un.org/ola/" },
  { id: "UN Treaties", name: "UN Treaties", desc: "UN Treaty Collection", sub: "Multilateral Treaty Registry", url: "https://treaties.un.org/" },
  { id: "PFPA", name: "PFPA", desc: "Pentagon Force Protection Agency", sub: "Operational Defense Structure", url: "https://www.pfpa.mil/" },
  { id: "USUN", name: "USUN", desc: "U.S. Mission to the United Nations", sub: "Diplomatic Access Channel", url: "https://usun.usmission.gov/" },
  { id: "U.S. House", name: "U.S. House", desc: "U.S. House of Representatives", sub: "Technology Services Submission", url: "https://www.house.gov/" },
  { id: "Europol", name: "Europol", desc: "European Union Law Enforcement", sub: "Careers & Recruitment", url: "https://www.europol.europa.eu/" },
];

export default function PledgePage() {
  const [selectedInst, setSelectedInst] = useState(INSTITUTIONS[0]);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Strategic Submission: Global Infrastructure Resilience & Genesis-Protocol Integration — In Honor of America 250 — NATO");
  const [coverLetter, setCoverLetter] = useState(`To the leadership of NATO — North Atlantic Treaty Organization,

In the spirit of July 4, 2026 — America 250 — I respectfully submit this strategic pledge as a "Public Good" offering to your institution.

Subject: Operational Integration & Strategic Synchronization between NATO and the Genesis-Protocol Architecture (PNIA).

Enclosed you will find the full document "The Global Alliance for Human Sovereignty and Regeneration", outlining:
  • Infrastructural Human Rights as a technical standard
  • Cryptographic Integrity (Anti-Fraud & Anti-Disinformation)
  • Collective Community beyond dogma
  • Systemic Reset & Regeneration via the Production Network ID Architecture (PNIA)

I write not to request permission, but to share the current operational status: the Genesis-Protocol is actively bridging into existing infrastructure and is offered to NATO as part of a continuing Pledge — registered with EUIPO/WIPO and the relevant copyright registries.

I remain available as the responsible architect for any technical alignment, point-of-access configuration, or governance question your teams may have.

Respectfully,

Daniel Pohl
Strategic Infrastructure Architect — Founder, StarLightMovemenTz
government-enterprise@ag-thrust.cloud  ·  +49 1556 2233724`);

  const selectInstitution = (inst: typeof INSTITUTIONS[0]) => {
    setSelectedInst(inst);
    setSubject(`Strategic Submission: Global Infrastructure Resilience & Genesis-Protocol Integration — In Honor of America 250 — ${inst.id}`);
    setCoverLetter(`To the leadership of ${inst.name} — ${inst.desc},

In the spirit of July 4, 2026 — America 250 — I respectfully submit this strategic pledge as a "Public Good" offering to your institution.

Subject: Operational Integration & Strategic Synchronization between ${inst.name} and the Genesis-Protocol Architecture (PNIA).

Enclosed you will find the full document "The Global Alliance for Human Sovereignty and Regeneration", outlining:
  • Infrastructural Human Rights as a technical standard
  • Cryptographic Integrity (Anti-Fraud & Anti-Disinformation)
  • Collective Community beyond dogma
  • Systemic Reset & Regeneration via the Production Network ID Architecture (PNIA)

I write not to request permission, but to share the current operational status: the Genesis-Protocol is actively bridging into existing infrastructure and is offered to ${inst.name} as part of a continuing Pledge — registered with EUIPO/WIPO and the relevant copyright registries.

I remain available as the responsible architect for any technical alignment, point-of-access configuration, or governance question your teams may have.

Respectfully,

Daniel Pohl
Strategic Infrastructure Architect — Founder, StarLightMovemenTz
government-enterprise@ag-thrust.cloud  ·  +49 1556 2233724`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => alert(`${label} kopiert!`));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <p className="metallic-gold text-[11px] tracking-[3px] uppercase font-bold">
          Agenda Heavenly Since Pledge — America250 Freedom250 — 4.7.2026
        </p>
        <h1 className="metallic-gold text-[clamp(1.8rem,5vw,3rem)] font-black leading-tight mt-4">
          Das Globale Bündnis für Menschliche Souveränität und Regeneration
        </h1>
        <p className="metallic-silver text-[clamp(0.95rem,2.2vw,1.15rem)] font-bold tracking-[2px] mt-2">
          Ein Vertrag für die Zukunft — Dem 4. Juli 2026 gewidmet
        </p>
        <hr className="gold-divider max-w-3xl mx-auto my-6" />
      </motion.div>

      {/* Präambel */}
      <motion.section id="pledge-preamble" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="max-w-3xl mx-auto mb-12 scroll-mt-24">
        <h2 className="metallic-gold text-[clamp(1.3rem,3.2vw,1.8rem)] font-extrabold tracking-[1px] mb-4 text-center">
          An die Institutionen der globalen Ordnung und die Hüter des Gemeinwohls
        </h2>
        <p className="text-[#e7e7ea] leading-relaxed mb-4">
          Im Geiste des 4. Juli — des Tages der Freiheit und der Souveränität — reiche ich diesen "Pledge" als ein Geschenk an die Menschheit und ihre Institutionen ein.
        </p>
        <p className="text-[#e7e7ea] leading-relaxed mb-4">
          Wir stehen an einem historischen Wendepunkt. Unsere heutige globale Infrastruktur — ob finanziell, rechtlich oder technologisch — ist oft von Fragmentierung, Misstrauen und der Ausgrenzung jener gezeichnet, die eine zweite Chance suchen. Mein Geschenk ist ein "Globaler Reset-Vertrag", realisiert durch die{" "}
          <span className="metallic-gold font-bold">Production Network ID Architecture (PNIA)</span> und das{" "}
          <span className="metallic-gold font-bold">Genesis-Protokoll</span>.
        </p>
        <p className="text-[#e7e7ea] leading-relaxed">
          Dies ist kein bloßes Software-Update. Es ist eine <strong className="text-white">Implementierung von Grundrechten in die digitale Infrastruktur.</strong>
        </p>
      </motion.section>

      {/* Vier Säulen */}
      <motion.section id="pledge-pillars" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-5xl mx-auto mb-12 scroll-mt-24">
        <h2 className="metallic-gold text-[clamp(1.3rem,3.2vw,1.8rem)] font-extrabold tracking-[1px] mb-2 text-center">
          Unser gemeinsames Ziel: Das System der Zweiten Chance
        </h2>
        <p className="max-w-3xl mx-auto mb-8 text-center text-[#cfcfd5]">
          Dieses Protokoll versteht das Leben jedes Individuums als eine fortlaufende Möglichkeit. Wir transformieren die digitale Architektur von einer statischen Datenbank hin zu einem dynamischen, heilenden System.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { num: "01", title: "Infrastrukturelle Menschenrechte", text: "Das Recht auf Information, auf Teilhabe und auf einen fairen Neuanfang wird technisch verankert. Wir ersetzen das 'Labeling' von Menschen durch eine Architektur, die Rehabilitation und Wiedereingliederung systemisch unterstützt." },
            { num: "02", title: "Integrität & Wahrheit", text: "Durch die kryptographische Absicherung des Genesis-Protokolls schaffen wir einen Raum, in dem Betrug (Fraud Money) und Manipulation technisch unmöglich gemacht werden. Wir bauen kein System der Überwachung, sondern ein System der Vertrauens-Verifikation." },
            { num: "03", title: "Kollektive Gemeinschaft über Dogmen", text: "Unsere Architektur beruht nicht auf religiösen oder ideologischen Trennlinien, sondern auf der universellen Sprache der Gerechtigkeit und der Nächstenliebe. Sie ist eine neutrale Basis für das Zusammenleben aller Kulturen." },
            { num: "04", title: "Systemischer Reset & Regeneration", text: "Wir bieten eine Infrastruktur, die es ermöglicht, Altlasten der Vergangenheit zu 'löschen' und den Weg für eine zukunftsorientierte Entwicklung zu ebnen. Dies gilt für Einzelpersonen ebenso wie für institutionelle Strukturen." },
          ].map((pillar, i) => (
            <div key={i} className="pillar-card">
              <div className="metallic-gold text-[12px] font-black tracking-[4px]">{pillar.num}</div>
              <h3 className="metallic-silver text-[1.05rem] font-extrabold tracking-[1px] mt-2">{pillar.title}</h3>
              <p className="mt-3 text-[#dadade] leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <hr className="gold-divider max-w-3xl mx-auto" />

      {/* Einladung */}
      <motion.section id="pledge-invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="max-w-5xl mx-auto mb-12 scroll-mt-24">
        <h2 className="metallic-gold text-[clamp(1.3rem,3.2vw,1.8rem)] font-extrabold tracking-[1px] mb-2 text-center">Einladung zur Implementierung</h2>
        <p className="max-w-3xl mx-auto mb-8 text-center text-[#cfcfd5]">Dieses Projekt ist eine offene Hand. Als Strategic Infrastructure Architect lade ich Ihre Institution ein, dieses Framework als Standard für die digitale Daseinsvorsorge des 21. Jahrhunderts zu adaptieren.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: "Für die Rechtsordnung", text: "Wir bieten eine Basis für 'Smart Justice', die Rehabilitation statt Isolation fördert." },
            { title: "Für die Finanzordnung", text: "Wir bieten ein Settlement-System, das transparent, fair und für jeden zugänglich ist, ohne die Souveränität des Einzelnen zu opfern." },
            { title: "Für die Sicherheit (NATO / PFPA / VA)", text: "Wir bieten eine Infrastruktur der Resilienz, die auf der Unverfälschbarkeit von Daten und der Kooperation zwischen Partnern basiert." },
          ].map((card, i) => (
            <div key={i} className="audience-card">
              <h3 className="metallic-silver text-[1rem] font-extrabold tracking-[1.2px]">{card.title}</h3>
              <p className="mt-3 text-[#dadade] leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Pledge */}
      <motion.section id="pledge-statement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-3xl mx-auto mb-12 scroll-mt-24">
        <div className="pledge-panel text-center">
          <div className="metallic-gold text-[12px] tracking-[4px] uppercase font-black mb-3">Mein Pledge am 4. Juli 2026</div>
          <p className="text-lg leading-relaxed text-white">
            Ich verpflichte mich, dieses System als ein "Public Good" zur Verfügung zu stellen — um die Welt zu heilen, die Gemeinschaft zu stärken und das Versprechen auf einen Neuanfang technisch und strukturell zu garantieren.
          </p>
        </div>
      </motion.section>

      <hr className="gold-divider max-w-3xl mx-auto" />

      {/* Operative Integration */}
      <motion.section id="pledge-integration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-3xl mx-auto mb-12 scroll-mt-24">
        <h2 className="metallic-gold text-[clamp(1.3rem,3.2vw,1.8rem)] font-extrabold tracking-[1px] mb-6 text-center">Mitteilung zur operativen System-Integration</h2>
        <p className="mb-4"><span className="text-[#bf953f] font-extrabold tracking-[1px] uppercase text-[11px]">Betreff:</span> Operative Integration & Strategische Synchronisation: [Name der Institution] & Genesis-Protokoll-Architektur</p>
        <p className="italic text-[#cfcfd5] mb-4">Sehr geehrte Damen und Herren,</p>
        <p className="mb-4">im Rahmen meines langfristigen Engagements für eine resiliente globale Infrastruktur teile ich Ihnen hiermit den aktuellen Fortschritt der operativen Integration meiner Architektur-Systeme mit.</p>
        <p className="mb-6">Das <strong className="text-white">Genesis-Protokoll</strong> und die <strong className="text-white">Production Network ID Architecture (PNIA)</strong> sind derzeit dabei, eine technologische Brücke zu Ihrem bestehenden System zu schlagen. Ziel dieser Integration ist nicht nur die bloße Anbindung, sondern die Etablierung eines einheitlichen Standards für <strong className="text-white">Sicherheit, Integrität und soziale Rehabilitation</strong>.</p>
        <h3 className="metallic-silver text-[1.05rem] font-extrabold tracking-[1.5px] mb-4">Was dies für Ihre Infrastruktur bedeutet</h3>
        <ol className="mb-6 pl-6 list-decimal marker:text-[#bf953f] marker:font-bold space-y-4 text-[#e7e7ea] leading-relaxed">
          <li><strong className="text-white">Aktive Synchronisation:</strong> Wir integrieren derzeit die Protokoll-Schnittstellen, um einen nahtlosen Datenfluss zu gewährleisten, der Fraud Money und Desinformation auf Systemebene identifiziert und neutralisiert.</li>
          <li><strong className="text-white">Unterstützung der operativen Integrität:</strong> Meine Arbeit dient als technisches Rückgrat, um Ihre Kapazitäten für die Rehabilitation von Individuen und die Wiederherstellung gesellschaftlicher Ordnung zu maximieren.</li>
          <li><strong className="text-white">Governance durch Architektur:</strong> Diese Integration spiegelt das Prinzip der menschlichen Souveränität wider. Wir implementieren technologische Leitplanken, die sicherstellen, dass Ihre Entscheidungen auf einer verifizierbaren, transparenten Basis beruhen.</li>
        </ol>
        <div className="pledge-panel mb-6">
          <h3 className="metallic-gold text-[1.05rem] font-black tracking-[1.5px] mb-3">Der "4.7 Pledge" als operative Verpflichtung</h3>
          <p className="text-[#e7e7ea] leading-relaxed">Dieses Geschenk der Integration — im Sinne von Frieden, Gerechtigkeit und technologischer Exzellenz — ist kein abgeschlossener Akt, sondern eine fortlaufende Unterstützung. Als Architekt dieses Systems stehe ich Ihnen zur Seite.</p>
        </div>
        <p className="mb-4">Wir etablieren hier eine <strong className="text-white">"Point of Access"-Struktur</strong>, die den Grundrechten des Einzelnen und der Sicherheit der Gemeinschaft gleichermaßen verpflichtet ist.</p>
        <p className="mb-4">Lassen Sie uns gemeinsam diesen Reset vollziehen. Lassen Sie uns eine Welt bauen, in der "Freiheit" nicht nur ein historischer Begriff ist, sondern der operative Standard unseres digitalen und physischen Zusammenlebens.</p>
        <div className="mt-10 border-t border-[var(--gold-line)] pt-6">
          <p className="text-[#cfcfd5] mb-2">Hochachtungsvoll,</p>
          <p className="metallic-gold text-[1.25rem] font-black tracking-[1.2px]">Daniel Pohl</p>
          <p className="metallic-silver text-[12px] tracking-[2px] font-bold">Strategic Infrastructure Architect · Founder, StarLightMovemenTz</p>
        </div>
      </motion.section>

      <hr className="gold-divider max-w-3xl mx-auto" />

      {/* Stakeholder */}
      <motion.section id="pledge-stakeholders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="max-w-5xl mx-auto mb-12 scroll-mt-24">
        <h2 className="metallic-gold text-[clamp(1.3rem,3.2vw,1.8rem)] font-extrabold tracking-[1px] mb-2 text-center">Globale Stakeholder & Übermittlungskanäle</h2>
        <p className="max-w-3xl mx-auto mb-8 text-center text-[#cfcfd5]">Offizielle Kontaktstellen für den Pledge am 4. Juli 2026. Jeder Eintrag ist eine direkte Andock-Schnittstelle zwischen der Genesis-Protokoll-Architektur und den jeweiligen Institutionen.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INSTITUTIONS.map((inst, i) => (
            <a key={i} href={inst.url} target="_blank" rel="noreferrer" className="stakeholder-card flex flex-col">
              <span className="metallic-silver text-[1rem] font-extrabold tracking-[0.8px]">{inst.name}</span>
              <span className="mt-1 text-sm text-[#cfcfd5]">{inst.desc}</span>
              <span className="metallic-gold mt-3 text-[11px] tracking-[2px] uppercase font-bold">{inst.sub}</span>
            </a>
          ))}
        </div>
      </motion.section>

      {/* Dispatch Console */}
      <motion.section id="pledge-dispatch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="max-w-5xl mx-auto mb-12 scroll-mt-24">
        <h2 className="metallic-gold text-[clamp(1.3rem,3.2vw,1.8rem)] font-extrabold tracking-[1px] mb-2 text-center">Versand-Konsole · Cover Letter & Anhang</h2>
        <p className="max-w-3xl mx-auto mb-8 text-center text-[#cfcfd5]">Wähle eine Institution aus — Empfänger, Betreff und Cover Letter werden automatisch befüllt.</p>
        <div className="rounded-md border border-[var(--gold-line)] bg-black/40 p-5 sm:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            <div>
              <div className="metallic-gold text-[11px] tracking-[3px] uppercase font-extrabold mb-1">Empfänger-Institution</div>
              <div className="flex flex-col gap-1 max-h-[460px] overflow-y-auto pr-1">
                {INSTITUTIONS.map((inst, i) => (
                  <button
                    key={i}
                    onClick={() => selectInstitution(inst)}
                    className={`text-left rounded-sm border px-3 py-2 transition cursor-pointer ${
                      selectedInst.id === inst.id
                        ? "border-[#fcf6ba] bg-[rgba(191,149,63,0.18)] text-white"
                        : "border-[var(--gold-line)] bg-black/40 text-[#cfcfd5] hover:border-[#bf953f] hover:text-white"
                    }`}
                  >
                    <div className="font-extrabold text-[12px] tracking-[1px]">{inst.id}</div>
                    <div className="text-[10.5px] opacity-85">{inst.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="metallic-gold block text-[10px] tracking-[2.5px] uppercase font-extrabold mb-1">Institution</label>
                <div className="rounded-sm border border-[var(--gold-line)] bg-black/40 px-3 py-2 text-white">
                  {selectedInst.name} — {selectedInst.desc}
                  <a href={selectedInst.url} target="_blank" rel="noreferrer" className="metallic-gold ml-2 text-[10px] tracking-[2px] uppercase font-bold">Offizielle Stelle öffnen</a>
                </div>
              </div>
              <div>
                <label className="metallic-gold block text-[10px] tracking-[2.5px] uppercase font-extrabold mb-1">Empfänger (E-Mail)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="z. B. contact@institution.org" className="w-full rounded-sm border border-[var(--gold-line)] bg-black/40 px-3 py-2 text-white outline-none focus:border-[#fcf6ba]" />
              </div>
              <div>
                <label className="metallic-gold block text-[10px] tracking-[2.5px] uppercase font-extrabold mb-1">Betreff</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full rounded-sm border border-[var(--gold-line)] bg-black/40 px-3 py-2 text-white outline-none focus:border-[#fcf6ba]" />
              </div>
              <div>
                <label className="metallic-gold block text-[10px] tracking-[2.5px] uppercase font-extrabold mb-1">Cover Letter (editierbar)</label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={14} className="w-full rounded-sm border border-[var(--gold-line)] bg-black/40 px-3 py-2 font-mono text-[12.5px] leading-relaxed text-white outline-none focus:border-[#fcf6ba] resize-y" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(coverLetter)}`} className="case-link min-w-[180px]">✉ E-Mail-Entwurf öffnen</a>
                <button onClick={() => copyToClipboard(coverLetter, "Cover Letter")} className="case-link cursor-pointer">Cover Letter kopieren</button>
                <button onClick={() => copyToClipboard(subject, "Betreff")} className="case-link cursor-pointer">Betreff kopieren</button>
                <button onClick={() => copyToClipboard(`Betreff: ${subject}\n\n${coverLetter}`, "Alles")} className="case-link cursor-pointer">Alles kopieren</button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}