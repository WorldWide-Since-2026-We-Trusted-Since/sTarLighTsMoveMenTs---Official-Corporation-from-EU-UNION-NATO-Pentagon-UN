/**
 * @license SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * 
 * 🔒 HNOSS Autonomous Security Layer
 * Verbesserte Version - Sicher & designverträglich
 * Für pLedge250freedom.gov.eu
 */

// === 1. Hardware-Based Session Token (Autark generiert) ===
const generateHardwareToken = (): string => {
  const nav = navigator;
  const screenEl = window.screen;
  const plugins = Array.from(nav.plugins || []);
  
  const fingerprint = btoa([
    nav.userAgent || '',
    nav.language || '',
    screenEl.width + 'x' + screenEl.height,
    nav.hardwareConcurrency?.toString() || '',
    plugins.map(p => p.name).join('|')
  ].join('|||')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  
  return fingerprint || 'local-' + Date.now().toString(36);
};

// === 2. Autonomous Protection Layer (Non-Destructive) ===
export const SecurityLayer = {
  init(): void {
    try {
      sessionStorage.setItem('hness_token', generateHardwareToken());
    } catch { /* Silent fail */ }
    
    this.applyAntiForensics();
  },
  
  applyAntiForensics(): void {
    // Nur Sicherheits-Attribute setzen, ohne die UX zu zerstören
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('input, textarea, [contenteditable]').forEach(el => {
        el.setAttribute('autocomplete', 'off');
        el.setAttribute('data-secure', 'autonomous');
      });
    });
  },
  
  silentLog(msg: string): void {
    try {
      sessionStorage.setItem('sec_' + Date.now(), msg);
    } catch { /* Silent fail */ }
  }
};

// === 3. Autonomous Tunnel Configuration (Lokal ohne Keys) ===
export const AutonomousTunnel = {
  config: {
    domain: 'pLedge250freedom.gov.eu',
    localPort: 8080,
    tunnelName: 'hness-auto-tunnel'
  },
  
  generateConfig(): string {
    return `# Autonomous Tunnel Config - Keine Keys erforderlich
tunnel: ${this.config.tunnelName}
credentials-file: /dev/null
ingress:
  - hostname: ${this.config.domain}
    service: http://localhost:${this.config.localPort}
  - service: http_status:404
    
# Hinweis: Tunnel wird über lokale cloudflared binary gestartet
# Keine API-Keys in dieser Konfiguration!`;
  },
  
  getStartCommand(): string {
    return `cloudflared tunnel --url http://localhost:${this.config.localPort} --hostname ${this.config.domain}`;
  }
};

// Initialisierung
if (typeof window !== 'undefined') {
  SecurityLayer.init();
  
  (window as Window & { HNOSS_Security?: Record<string, unknown> }).HNOSS_Security = {
    token: generateHardwareToken(),
    tunnel: AutonomousTunnel,
    version: '2026.07.06-autonomous'
  };
}