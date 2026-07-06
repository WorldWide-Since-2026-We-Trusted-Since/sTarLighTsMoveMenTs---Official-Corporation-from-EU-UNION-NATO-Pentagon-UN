/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * 
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * 
 * Cloudflare Worker für HNOSS Security-Tunnel & DOM Protection
 * Liefert die Website ohne API-Keys im Quellcode
 * Integriert sich mit pLedge250freedom.gov.eu DNS
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const clientIP = request.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // Security Headers - verhindert DOM-Scanning und Rebuild
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'none';",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Anti-Tampering Headers mit Umgebungsvariablen
    const antiTamperHeaders = {
      ...securityHeaders,
      'X-Source-Auth': env.HNOSS_DOMAIN_SIGNATURE || 'HCOS-AUTHORIZED',
      'X-Tunnel-ID': env.TUNNEL_ID || 'secure-tunnel-active',
      'X-Build-Hash': env.BUILD_HASH || 'production-locked',
      'X-Forwarded-For': clientIP
    };

    // Blockierliste für bekannte Scanner/Bots (Case-insensitive)
    const blockedUserAgents = [
      'bot', 'crawler', 'spider', 'scraper', 'wget', 'curl',
      'nikto', 'sqlmap', 'nmap', 'masscan', 'zgrab', 'python', 'java'
    ];

    if (blockedUserAgents.some(blocked => 
      userAgent.toLowerCase().includes(blocked))) {
      return new Response('Access Denied - Security Violation', { 
        status: 403,
        headers: { ...antiTamperHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Route zur Hauptdomain mit korrekter Response-Handhabung
    if (url.pathname === '/' || url.pathname === '/index.html') {
      try {
        const response = await fetch('https://pLedge250freedom.gov.eu/', {
          headers: {
            'X-Forwarded-For': clientIP,
            'X-Real-IP': clientIP,
          }
        });
        
        const newHeaders = new Headers(response.headers);
        Object.entries(antiTamperHeaders).forEach(([key, value]) => {
          newHeaders.set(key, value);
        });

        return new Response(response.body, {
          status: response.status,
          headers: newHeaders
        });
      } catch (error) {
        return new Response('Tunnel Error: Origin unreachable', { 
          status: 502,
          headers: { ...antiTamperHeaders, 'Content-Type': 'text/plain' }
        });
      }
    }

    return new Response('Secure Tunnel Active - HNOSS Protected', {
      status: 200,
      headers: { ...antiTamperHeaders, 'Content-Type': 'text/plain' }
    });
  }
};

/**
 * @cloudflare-worker
 * Deployment: wrangler deploy cloudflare-worker.js
 * Environment Variables Required:
 * - HNOSS_DOMAIN_SIGNATURE
 * - TUNNEL_ID  
 * - BUILD_HASH
 */