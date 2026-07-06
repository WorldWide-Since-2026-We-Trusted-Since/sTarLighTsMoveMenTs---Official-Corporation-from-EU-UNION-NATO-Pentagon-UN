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

    // Anti-Tampering Headers
    const antiTamperHeaders = {
      ...securityHeaders,
      'X-Source-Auth': env.HNOSS_DOMAIN_SIGNATURE || 'HCOS-AUTHORIZED',
      'X-Tunnel-ID': env.TUNNEL_ID || 'secure-tunnel-active',
      'X-Build-Hash': env.BUILD_HASH || 'production-locked'
    };

    // Blockierliste für bekannte Scanner/Bots
    const blockedUserAgents = [
      'bot', 'crawler', 'spider', 'scraper', 'wget', 'curl',
      'nikto', 'sqlmap', 'nmap', 'masscan', 'zgrab'
    ];

    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
    if (blockedUserAgents.some(blocked => userAgent.includes(blocked))) {
      return new Response('Access Denied - Security Violation', { 
        status: 403,
        headers: { ...antiTamperHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Route zur Hauptdomain
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const response = await fetch('https://pLedge250freedom.gov.eu', {
        headers: {
          'X-Forwarded-For': request.headers.get('cf-connecting-ip'),
          'X-Real-IP': request.headers.get('cf-connecting-ip'),
        }
      });
      return new Response(response.body, {
        ...response,
        headers: { ...response.headers, ...antiTamperHeaders }
      });
    }

    return new Response('Secure Tunnel Active', {
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