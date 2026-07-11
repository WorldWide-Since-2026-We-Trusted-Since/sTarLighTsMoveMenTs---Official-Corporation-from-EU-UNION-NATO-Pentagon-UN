// PNIA Infrastructure Bundle — 05-cloudflare/worker.js
// Source: ProtokolInfrastructurImplementation.txt, lines 411-432
// Extracted verbatim on 2026-07-06.
// Cloudflare Worker: maps PNIA-XXXX subdomains to internal services.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname; // z.B. PNIA-0001.pnia.dein-projekt.de

    // Extrahiere die ID aus der Subdomain (PNIA-XXXX)
    const pniaID = hostname.split('.')[0].toUpperCase();

    // Mapping: Wir konstruieren das interne Ziel dynamisch
    // Dein Server (via Cloudflare Tunnel) hört auf diese internen Dienst-Namen
    const targetUrl = `http://${pniaID}.internal-network:8080${url.pathname}${url.search}`;

    // Weiterleitung an den internen Dienst
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }
};
