import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { logAccess, generateSessionId } from '../security/accessLogger';

// Password from secure vault documentation
const VIEW_PASSWORD = 'saintsheavenlysince!';

interface LoginGateProps {
  children: ReactNode;
}

export default function LoginGate({ children }: LoginGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [acceptedRights, setAcceptedRights] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState(generateSessionId());

  // Log page access attempt
  useEffect(() => {
    const ip = (() => {
      try {
        return (window as any).clientIP || 'localhost';
      } catch {
        return 'localhost';
      }
    })();
    logAccess({
      sessionId,
      ip,
      userAgent: navigator.userAgent,
      authenticated: false
    });
  }, [sessionId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== VIEW_PASSWORD) {
      setError('Zugriff verweigert. Ungültige Autorisierung.');
      return;
    }
    if (!acceptedRights) {
      setError('Die exklusive Rechtevereinbarung muss bestätigt werden.');
      return;
    }
    setAuthenticated(true);
    const ip = (window as any).clientIP || 'localhost';
    logAccess({
      sessionId,
      ip,
      userAgent: navigator.userAgent,
      authenticated: true
    });
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e293b] border-2 border-[#334155] rounded-2xl shadow-2xl max-w-lg w-full p-8"
      >
        <div className="flex justify-between items-center mb-5">
          <span className="bg-[#0369a1] text-[#38bdf8] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Protected View Mode
          </span>
          <span className="bg-[#15803d] text-[#4ade80] px-3 py-1 rounded-md text-[12px] font-mono font-bold">
            #ORIGINAL-{sessionId.slice(0, 12)}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#f8fafc] mb-2">Sicherheits-Verbindung</h2>
        <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
          Sie versuchen, eine geschützte Verbindung zu einem privaten Entwicklungsportal herzustellen.
        </p>

        <div className="bg-[#111827] border-l-4 border-[#38bdf8] p-4 rounded mb-6">
          <h4 className="text-[#38bdf8] text-sm font-bold uppercase mb-1">Inhalt dieses Portals:</h4>
          <p className="text-[#cbd5e1] text-[13px] m-0">
            Dieses System beinhaltet die geschützte Web-Applikation sowie das dazugehörige Daten-Dashboard
            der HNOSS ® sTarLighTsMoveMenTs Corporation. Die Vorschau umfasst das gesamte Interface-Design,
            die Datenbank-Strukturen und vertrauliche Assets.
          </p>
        </div>

        <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4 text-[12px] text-[#94a3b8] max-h-[100px] overflow-y-auto mb-6 leading-relaxed">
          <strong>RECHTEVORBEHALT (ALL RIGHTS RESERVED):</strong><br />
          Jegliche Datenübertragung, das Erzeugen von Backlinks, Indexierungen oder automatisierte Abfragen
          (Scraping) dieser Webadresse sind strengstens untersagt. Durch das Laden dieser Seite werden keinerlei
          geistige Eigentumsrechte oder Verwertungsrechte übertragen oder abgetreten. Alle Rechte an Quellcode,
          Layout und Inhalten verbleiben exklusiv beim Betreiber.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer text-[13px] text-[#cbd5e1] select-none">
            <input
              type="checkbox"
              checked={acceptedRights}
              onChange={(e) => setAcceptedRights(e.target.checked)}
              className="mt-1 scale-110 cursor-pointer"
              required
            />
            <span>
              Ich erkenne den vollständigen Rechtevorbehalt an und bestätige, dass alle Datenansprüche
              beim Betreiber verbleiben.
            </span>
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sicherheits-Passwort eingeben"
            className="w-full p-3.5 rounded-lg border border-[#475569] bg-[#0f172a] text-white text-base focus:border-[#38bdf8] focus:outline-none transition-colors"
            required
          />

          <button
            type="submit"
            className="w-full p-3.5 rounded-lg bg-[#0284c7] text-white font-bold text-base hover:bg-[#0369a1] transition-colors"
          >
            Integrität bestätigen & Verbinden
          </button>

          {error && (
            <p className="text-[#f43f5e] text-center text-sm font-semibold mt-4">{error}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}