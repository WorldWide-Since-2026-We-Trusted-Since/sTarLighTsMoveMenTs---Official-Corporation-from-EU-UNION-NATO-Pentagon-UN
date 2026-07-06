m/**
 * 🔒 HNOSS Autonomous Security Layer
 * Eingebaute Defense - Keine externen Keys, vollständig autark
 * Für pLedge250freedom.gov.eu
 */

(function() {
    'use strict';
    
    // === 1. Hardware-Based Session Token (Autark generiert) ===
    const generateHardwareToken = () => {
        const nav = navigator;
        const screen = window.screen;
        const plugins = Array.from(nav.plugins || []);
        
        // Erstelle deterministischen Token aus Browser-Fingerprint
        const fingerprint = btoa([
            nav.userAgent || '',
            nav.language || '',
            screen.width + 'x' + screen.height,
            nav.hardwareConcurrency || '',
            plugins.map(p => p.name).join('|')
        ].join('|||')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
        
        return fingerprint || 'local-' + Date.now().toString(36);
    };
    
    // === 2. Autonomous Protection Layer ===
    const SecurityLayer = {
        // Hardware-Fingerprint speichern
        init() {
            try {
                sessionStorage.setItem('hness_token', generateHardwareToken());
            } catch (e) { /* Silent fail */ }
            
            this.applyDOMProtection();
            this.applyNetworkProtection();
            this.applyAntiForensics();
        },
        
        applyDOMProtection() {
            // Anti-Copy (inkl. Clipboard-Manipulation)
            ['copy', 'cut', 'paste', 'contextmenu'].forEach(evt => {
                document.addEventListener(evt, e => {
                    e.preventDefault();
                    this.silentLog(`Blockiert: ${evt}`);
                }, { passive: false });
            });
            
            // Text-Selection deaktivieren
            document.onselectstart = () => false;
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            
            // DevTools Blocker
            document.addEventListener('keydown', e => {
                const blocked = ['F12', 'I', 'J', 'C', 'U'];
                if ((e.ctrlKey && e.shiftKey && blocked.includes(e.key.toUpperCase())) ||
                    (e.ctrlKey && blocked.includes(e.key.toUpperCase()))) {
                    e.preventDefault();
                    this.silentLog('DevTools-Blockierung aktiv');
                }
            });
        },
        
        applyNetworkProtection() {
            // Mutation Observer für DOM-Manipulation
            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.tagName === 'SCRIPT' && !node.hasAttribute('data-autonomous')) {
                            node.remove();
                            this.silentLog('Fremdes Script blockiert');
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
        
        applyAntiForensics() {
            // Console-Log-Flooding vorbeugen
            const originalLog = console.log;
            console.log = function() {
                const msg = arguments[0] || '';
                if (!msg.toString().includes('autonomous') && !msg.toString().includes('HNOSS')) return;
                return originalLog.apply(console, arguments);
            };
            
            // Rechtschreibung vor Forensik-Tools schützen
            const protectElement = el => {
                if (el && el.setAttribute) {
                    el.setAttribute('spellcheck', 'false');
                    el.setAttribute('autocomplete', 'off');
                    el.setAttribute('autocorrect', 'off');
                    el.setAttribute('data-secure', 'autonomous');
                }
            };
            
            document.querySelectorAll('input, textarea, [contenteditable]').forEach(protectElement);
        },
        
        silentLog(msg) {
            try {
                sessionStorage.setItem('sec_' + Date.now(), msg);
            } catch (e) { /* Silent fail - autark */ }
        }
    };
    
    // === 3. Autonomous Tunnel Configuration (Lokal ohne Keys) ===
    const AutonomousTunnel = {
        config: {
            domain: 'pLedge250freedom.gov.eu',
            localPort: 8080,
            tunnelName: 'hness-auto-tunnel'
        },
        
        generateConfig() {
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
        
        getStartCommand() {
            return `cloudflared tunnel --url http://localhost:${this.config.localPort} --hostname ${this.config.domain}`;
        }
    };
    
    // Initialisierung
    if (typeof window !== 'undefined') {
        SecurityLayer.init();
        
        // Export für Debugging (autark)
        window.HNOSS_Security = {
            token: generateHardwareToken(),
            tunnel: AutonomousTunnel,
            version: '2026.07.06-autonomous'
        };
    }
    
    // Node.js Version für lokale CLI
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { SecurityLayer, AutonomousTunnel };
    }
    
})();