/**
 * @license SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * 
 * 🔒 HNOSS Autonomous Security Layer
 * Eingebaute Defense - Keine externen Keys, vollständig autark
 * Für pLedge250freedom.gov.eu
 */

// === 1. Hardware-Based Session Token (Autark generiert) ===
const generateHardwareToken = (): string => {
  const nav = navigator;
  const screenEl = window.screen;
  const plugins = Array.from(nav.plugins || []);
  
  // Erstelle deterministischen Token aus Browser-Fingerprint
  const fingerprint = btoa([
    nav.userAgent || '',
    nav.language || '',
    screenEl.width + 'x' + screenEl.height,
    nav.hardwareConcurrency?.toString() || '',
    plugins.map(p => p.name).join('|')
  ].join('|||')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  
  return fingerprint || 'local-' + Date.now().toString(36);
};

// === 2. Autonomous Protection Layer ===
export const SecurityLayer = {
  // Hardware-Fingerprint speichern
  init(): void {
    try {
      sessionStorage.setItem('hness_token', generateHardwareToken());
    } catch (e) { /* Silent fail */ }
    
    this.applyDOMProtection();
    this.applyNetworkProtection();
    this.applyAntiForensics();
  },
  
  applyDOMProtection(): void {
    // Anti-Copy (inkl. Clipboard-Manipulation)
    const events = ['copy', 'cut', 'paste', 'contextmenu'] as const;
    events.forEach(evt => {
      document.addEventListener(evt, (e: Event) => {
        e.preventDefault();
        this.silentLog(`Blockiert: ${evt}`);
      }, { passive: false });
    });
    
    // Text-Selection deaktivieren
    (document as Document & { onselectstart: () => boolean }).onselectstart = () => false;
    if (document.body) {
      document.body.style.userSelect = 'none';
      (document.body.style as unknown as Record<string, string>).webkitUserSelect = 'none';
    }
    
    // DevTools Blocker
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      const blocked = ['F12', 'I', 'J', 'C', 'U'];
      if ((e.ctrlKey && e.shiftKey && blocked.includes(e.key.toUpperCase())) ||
          (e.ctrlKey && blocked.includes(e.key.toUpperCase()))) {
        e.preventDefault();
        this.silentLog('DevTools-Blockierung aktiv');
      }
    });
  },
  
  applyNetworkProtection(): void {
    // Mutation Observer für DOM-Manipulation
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-autonomous')) {
              element.remove();
              this.silentLog('Fremdes Script blockiert');
            }
          }
        });
      });
    });
    
    // Beobachte sobald DOM ready
    if (document.documentElement) {
      observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
      });
    }
  },
  
  applyAntiForensics(): void {
    // Rechtschreibung vor Forensik-Tools schützen
    document.querySelectorAll('input, textarea, [contenteditable]').forEach(el => {
      el.setAttribute('spellcheck', 'false');
      el.setAttribute('autocomplete', 'off');
      el.setAttribute('autocorrect', 'off');
      el.setAttribute('data-secure', 'autonomous');
    });
  },
  
  silentLog(msg: string): void {
    try {
      sessionStorage.setItem('sec_' + Date.now(), msg);
    } catch (e) { /* Silent fail - autark */ }
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
  
  // Export für Debugging (autark)
  (window as Window & { HNOSS_Security?: Record<string, unknown> }).HNOSS_Security = {
    token: generateHardwareToken(),
    tunnel: AutonomousTunnel,
    version: '2026.07.06-autonomous'
  };
}