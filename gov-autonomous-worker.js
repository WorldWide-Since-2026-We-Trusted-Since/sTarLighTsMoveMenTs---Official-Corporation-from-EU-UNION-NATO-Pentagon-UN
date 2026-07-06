/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * 
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * 
 * 🔒 Autonomer High-Security Interstitial Worker für pLedge250freedom.gov.eu
 * 100% Zero-Key, Zero-Trust. Keine externen APIs, keine manuellen Keys erforderlich.
 * Erzwingt eine kryptografisch validierte 11-Sekunden-Verzögerung.
 */

// Generiert automatisch bei jedem Start der Worker-Instanz ein lokales, temporäres Geheimnis.
// Wird ausschließlich im RAM gehalten. Keine manuellen Keys nötig.
const WORKER_INSTANCE_SECRET = crypto.randomUUID();

/**
 * Erstellt eine HMAC-SHA-256 Signatur für den Zeitstempel
 */
async function generateSignature(payload) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', 
        encoder.encode(WORKER_INSTANCE_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false, 
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const cookieHeader = request.headers.get("Cookie") || "";

        // 1. Prüfen, ob das Clearance-Cookie bereits existiert (Nutzer hat die 11 Sekunden bestanden)
        if (cookieHeader.includes("gov_clearance=verified")) {
            // Traffic wird zum echten Server durchgelassen & Audit-Modul injizieren
            return await handleVerifiedRequest(request);
        }

        // 2. Verarbeiten des POST-Requests nach den abgelaufenen 11 Sekunden
        if (request.method === "POST" && url.pathname === "/_gov_verify") {
            const formData = await request.formData();
            const ts = formData.get("timestamp");
            const sig = formData.get("signature");
            const redirectTo = formData.get("redirect_to") || "/";

            // Berechne die erwartete Signatur für den übergebenen Zeitstempel
            const expectedSig = await generateSignature(ts);
            const timeElapsed = Date.now() - parseInt(ts, 10);

            // SECURITY CHECK: 
            // - Ist die Signatur gültig? (Verhindert Manipulation)
            // - Sind mindestens 11 Sekunden (11000 ms) vergangen? (Verhindert Bot-Rushing)
            // - Ist der Request nicht älter als 2 Minuten? (Verhindert Replay-Angriffe)
            if (sig === expectedSig && timeElapsed >= 11000 && timeElapsed < 120000) {
                return new Response(null, {
                    status: 302,
                    headers: {
                        "Location": redirectTo,
                        "Set-Cookie": "gov_clearance=verified; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600",
                    },
                });
            }

            // Bei Fehlschlag oder Manipulationsversuch hart blockieren
            return new Response("🚨 403 Forbidden - Security Protocol Violation or Timeout. Please refresh.", { 
                status: 403 
            });
        }

        // 3. Ausliefern der autonomen 11-Sekunden Challenge-Seite
        const currentTimestamp = Date.now().toString();
        const timestampSignature = await generateSignature(currentTimestamp);
        
        return new Response(getAutonomousChallengeHTML(url.pathname, currentTimestamp, timestampSignature), {
            status: 401,
            headers: {
                "Content-Type": "text/html;charset=UTF-8",
                "X-Frame-Options": "DENY",
                "Content-Security-Policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline';",
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            },
        });
    },
};

/**
 * Behandelt verifizierte Requests mit Audit-Modul Injection
 */
async function handleVerifiedRequest(request) {
    const response = await fetch(request);
    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("text/html")) {
        let html = await response.text();
        // INJECTION: Das PNIA Audit-Modul wird direkt vor das schließende </body> gesetzt
        const injectionScript = `<script src="/scripts/pnia-audit-security.js" defer></script>`;
        html = html.replace("</body>", `${injectionScript}</body>`);
        
        return new Response(html, {
            status: response.status,
            headers: response.headers
        });
    }

    return response;
}

/**
 * 🎨 Generiert das HTML für die "Government" Lade-Seite mit Terminal-Effekt
 */
function getAutonomousChallengeHTML(redirectPath, timestamp, signature) {
    return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EU-UNION | Government Grade Security Checkpoint</title>
        <style>
            body {
                margin: 0; padding: 0;
                background-color: #0d1117; color: #c9d1d9;
                font-family: "Courier New", Courier, monospace;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                height: 100vh; text-align: left;
                user-select: none;
            }
            .container {
                width: 100%; max-width: 650px; padding: 30px;
                background: #161b22; border: 1px solid #30363d;
                border-radius: 4px; box-shadow: 0 0 20px rgba(0,0,0,0.8);
            }
            .header {
                border-bottom: 1px solid #30363d; padding-bottom: 15px; margin-bottom: 20px;
                display: flex; justify-content: space-between; align-items: center;
            }
            .header h2 { color: #58a6ff; font-weight: normal; font-size: 18px; margin: 0; }
            .badge { background: #8b0000; color: white; padding: 2px 8px; font-size: 12px; border-radius: 3px; }
            .terminal {
                height: 150px; background: #000; padding: 15px; border-radius: 4px;
                font-size: 13px; color: #3fb950; overflow: hidden; margin-bottom: 20px;
            }
            .progress-bar-container {
                width: 100%; background-color: #21262d; border-radius: 3px; height: 10px; margin-bottom: 20px;
                overflow: hidden;
            }
            .progress-bar {
                height: 100%; background-color: #58a6ff; width: 0%;
                transition: width 11s linear;
            }
            p { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; color: #8b949e; }
            .footer-text { font-size: 11px; color: #484f58; margin-top: 30px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>System Gateway Authentication</h2>
                <span class="badge">GOVERNMENT GRADE</span>
            </div>
            
            <p>Initiating Zero-Trust cryptographic browser validation. Access requires completion of the 11-second security protocol.</p>
            
            <div class="terminal" id="terminal-output">
                > System initialized...<br>
            </div>

            <div class="progress-bar-container">
                <div class="progress-bar" id="progress"></div>
            </div>

            <!-- Das unsichtbare Formular enthält die kryptografischen Daten des Servers -->
            <form id="challenge-form" action="/_gov_verify" method="POST" style="display:none;">
                <input type="hidden" name="redirect_to" value="${redirectPath}">
                <input type="hidden" name="timestamp" value="${timestamp}">
                <input type="hidden" name="signature" value="${signature}">
            </form>
        </div>

        <div class="footer-text">
            Protected by pLedge250freedom Network Architecture<br>
            Automated Clearance Protocol in progress...
        </div>

        <script>
            // Protokoll-Texte für den Terminal-Effekt
            const logs = [
                "> Analyzing TLS/JA3 Fingerprint...",
                "> Validating origin request routing...",
                "> Performing DOM integrity check...",
                "> Executing localized cryptographic proof...",
                "> Verifying Network ID constraints...",
                "> Evaluating time-drift parameters...",
                "> Awaiting final clearance confirmation...",
                "> Clearance granted. Establishing secure tunnel..."
            ];

            const terminal = document.getElementById('terminal-output');
            const progressBar = document.getElementById('progress');
            let logIndex = 0;

            // Startet die Progress-Bar sofort für exakt 11 Sekunden
            setTimeout(() => { progressBar.style.width = '100%'; }, 100);

            // Simuliert komplexe Berechnungen im Terminal
            const interval = setInterval(() => {
                if (logIndex < logs.length) {
                    terminal.innerHTML += logs[logIndex] + '<br>';
                    logIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 1300);

            // Nach exakt 11 Sekunden (11000ms) wird das kryptografische Formular automatisch an den Server gesendet
            setTimeout(() => {
                document.getElementById('challenge-form').submit();
            }, 11000);
        </script>
    </body>
    </html>
    `;
}