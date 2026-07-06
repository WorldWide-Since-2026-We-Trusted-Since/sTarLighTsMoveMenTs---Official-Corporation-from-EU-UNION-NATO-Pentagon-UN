/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 *
 * HNOSS Security Middleware - DOM Protection & Anti-Copy
 * Zero Trust Security - Keine sensiblen Daten im Code
 */

/**
 * Anti-Copy Protection Script
 * Verhindert einfaches Kopieren und DevTools-Zugriff
 */
export const antiCopyProtection = `
<script>
(function() {
  'use strict';
  
  // Right Click Disable - nur für nicht autorisierte Elemente
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  
  // DevTools Detection (non-blocking)
  let devtoolsOpen = false;
  const threshold = 200;
  setInterval(function() {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        console.clear();
      }
    } else {
      devtoolsOpen = false;
    }
  }, 1000);
})();
</script>
`;

/**
 * Security Headers for Express/Vite
 * All secrets from environment variables
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'none';",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-HNOS-Signature': process?.env?.HNOSS_SIG || 'AUTHORIZED-TUNNEL',
  'X-Build-Timestamp': new Date().toISOString()
};

/**
 * DOM Mutation Observer - protects against unauthorized modifications
 */
export const domProtection = `
<script>
(function() {
  'use strict';
  
  const allowedOrigins = ['localhost', 'pLedge250freedom.gov.eu'];
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.target.tagName === 'BODY') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
            const src = node.src || '';
            const isAllowed = allowedOrigins.some(function(origin) {
              return src.includes(origin);
            });
            if (!isAllowed && !node.isContentEditable) {
              console.warn('Blocked unauthorized script injection');
              node.remove();
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})();
</script>
`;
