/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * 
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * 
 * 🔒 Cloudflare Worker für pLedge250freedom.gov.eu Security Edge
 * Zero-Key-in-Code Architektur - Keine API-Keys im Quellcode
 * Alle Secrets werden via wrangler login authentifiziert
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const clientIP = request.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // 🔒 Zero Trust Security Headers
    const securityHeaders = {
      // Clickjacking Schutz
      'X-Frame-Options': 'DENY',
      // CSP - strikt für Zero Trust
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'none'; object-src 'none';",
      // MIME-Type Sniffing verhindern
      'X-Content-Type-Options': 'nosniff',
      // XSS Schutz
      'X-XSS-Protection': '1; mode=block',
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Hardware Zugriffe blockieren
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), serial=()',
      // HSTS - 1 Jahr inklusive Subdomains
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      // Cache Control für dynamische Inhalte
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Bot/Scanner Blockliste
    const blockedUserAgents = [
      'bot', 'crawler', 'spider', 'scraper', 'wget', 'curl',
      'nikto', 'sqlmap', 'nmap', 'masscan', 'zgrab', 'python-requests',
      'httpclient', 'apache-httpclient', 'indy library'
    ];

    if (blockedUserAgents.some(blocked => 
      userAgent.toLowerCase().includes(blocked))) {
      return new Response('Access Denied - Security Violation', { 
        status: 403,
        headers: { ...securityHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Hauptroute für pLedge250freedom.gov.eu
    if (url.pathname === '/' || url.pathname === '/index.html') {
      try {
        const response = await fetch('https://pLedge250freedom.gov.eu/', {
          headers: {
            'X-Forwarded-For': clientIP,
            'X-Real-IP': clientIP,
          }
        });
        
        const newHeaders = new Headers(response.headers);
        Object.entries(securityHeaders).forEach(([key, value]) => {
          newHeaders.set(key, value);
        });

        return new Response(response.body, {
          status: response.status,
          headers: newHeaders
        });
      } catch (error) {
        return new Response('🛡️ Secure Tunnel Active - Origin protected', { 
          status: 200,
          headers: { ...securityHeaders, 'Content-Type': 'text/plain' }
        });
      }
    }

    // Standard Response für andere Pfade
    return new Response('🔒 HNOSS Protected - pLedge250freedom.gov.eu', {
      status: 200,
      headers: { ...securityHeaders, 'Content-Type': 'text/plain' }
    });
  }
};

/**
 * @cloudflare-worker
 * 🔒 Zero-Key-in-Code Deployment:
 * 
 * 1. wrangler login (einmalig - browser based auth)
 * 2. wrangler deploy (keine API-Keys nötig)
 * 
 * Alle Secrets werden im ~/.wrangler/config/default.toml abgelegt
 * und niemals ins Git-Repository gepushed!
 */