/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 *
 * 🔒 HNOSS Security Middleware für pLedge250freedom.gov.eu
 * Zero Trust Security - Keine sensiblen Daten im Code
 * Schützt vor DOM-Scanning und automatischem Rebuild
 */

// =============================================================================
// Anti-Copy Protection Script
// Verhindert einfaches Kopieren und DevTools-Zugriff
// =============================================================================
export const antiCopyProtection = `
<script>
(function() {
  'use strict';
  
  // Rechtsklick deaktivieren
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    console.warn('🛡️ Security: Rechtsklick deaktiviert auf pLedge250freedom.gov.eu');
    return false;
  });
  
  // Textauswahl verhindern
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    document.body.style.userSelect = 'none';
    return false;
  });
  
  // Copy/Cut/Paste blockieren und Clipboard leeren
  ['copy', 'cut', 'paste'].forEach(function(eventType) {
    document.addEventListener(eventType, function(e) {
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText('');
      }
      console.warn('🛡️ Security: ' + eventType + '-Aktion blockiert');
    });
  });
  
  // Drag & Drop verhindern
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });
})();
</script>
`;

// =============================================================================
// DevTools Detection & Blocking
// =============================================================================
export const devToolsBlocker = `
<script>
(function() {
  'use strict';
  
  // DevTools-Tastenkombinationen blockieren
  document.addEventListener('keydown', function(e) {
    // F12, Ctrl+Shift+I/J/C, Ctrl+U (View Source), Ctrl+S (Save)
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U') ||
        (e.ctrlKey && e.key.toUpperCase() === 'S')) {
      e.preventDefault();
      console.warn('🛡️ Security: Analyse-Tool-Zugriff blockiert');
      return false;
    }
  });
  
  // DevTools-Erkennung via Fenstergröße
  let devtoolsOpen = false;
  const detectDevTools = function() {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        console.clear();
        console.warn('🔒 DevTools erkannt - Bildschirm geleert');
      }
    } else {
      devtoolsOpen = false;
    }
  };
  
  setInterval(detectDevTools, 1000);
})();
</script>
`;

// =============================================================================
// Security Headers für Express/Vite
// =============================================================================
export const securityHeaders = {
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
  // HSTS - 1 Jahr
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Cache Control
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// =============================================================================
// DOM Mutation Observer - protects against unauthorized modifications
// =============================================================================
export const domProtection = `
<script>
(function() {
  'use strict';
  
  const allowedOrigins = ['localhost', 'pLedge250freedom.gov.eu'];
  
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Überwache neue Script-Einbindungen
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
            const src = node.src || '';
            const isAllowed = allowedOrigins.some(function(origin) {
              return src.includes(origin);
            });
            
            // data-secure-core Attribut für autorisierte Skripte
            const isSecureCore = node.hasAttribute && node.hasAttribute('data-secure-core');
            
            if (!isAllowed && !isSecureCore) {
              console.error('🚨 WARNUNG: Unautorisierte DOM-Manipulation blockiert!');
              node.remove();
            }
          }
        });
      }
    });
  });
  
  // Beobachte das gesamte Dokument
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }
  
  // Aktivierungs-Hinweis
  console.log('🔒 HNOSS Client-Side Security aktiviert für pLedge250freedom.gov.eu');
})();
</script>
`;

// =============================================================================
// Kombiniertes Security Script
// =============================================================================
export const hnossSecurityScript = `
<script>
(function() {
  'use strict';
  
  // 1. Anti-Copy Protection
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('selectstart', function(e) { e.preventDefault(); });
  ['copy', 'cut', 'paste'].forEach(function(type) {
    document.addEventListener(type, function(e) { 
      e.preventDefault(); 
      if (navigator.clipboard) navigator.clipboard.writeText('');
    });
  });
  
  // 2. DevTools Block
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')) {
      e.preventDefault();
    }
  });
  
  // 3. DOM Mutation Protection
  const allowedOrigins = ['localhost', 'pLedge250freedom.gov.eu'];
  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
          const isAllowed = allowedOrigins.some(function(o) { 
            return (node.src || '').includes(o); 
          });
          if (!isAllowed && !node.hasAttribute('data-secure-core')) {
            node.remove();
          }
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
  
})();
</script>
`;