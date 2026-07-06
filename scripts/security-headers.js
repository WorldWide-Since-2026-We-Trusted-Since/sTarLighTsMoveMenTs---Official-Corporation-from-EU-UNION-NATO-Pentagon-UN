/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * 
 * HNOSS Security Middleware - DOM Protection & Anti-Copy
 */

// Copy Protection - verhindert einfaches Kopieren
export const antiCopyProtection = `
<script>
// Right Click Disable
document.addEventListener('contextmenu', e => e.preventDefault());

// DevTools Detection
let devtools = { open: false, orientation: undefined };
const threshold = 200;
setInterval(() => {
  if (window.outerHeight - window.innerHeight > threshold || 
      window.outerWidth - window.innerWidth > threshold) {
    if (!devtools.open) {
      devtools.open = true;
      console.clear();
      document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:50vh">Security Violation Detected</h1>';
    }
  } else {
    devtools.open = false;
  }
}, 500);

// Console Anti-Tamper
const originalLog = console.log;
console.log = function(...args) {
  const stack = new Error().stack;
  if (stack && stack.includes('eval')) return;
  originalLog.apply(console, args);
};

// Selection Protection
document.onselectstart = () => false;
document.onmousedown = e => e.button === 2;

// Keyboard Protection (Ctrl+C, Ctrl+U, etc.)
document.onkeydown = e => {
  if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'i')) {
    return false;
  }
};
</script>
`;

// Security Headers for Express/Vite
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-HNOS-Signature': process.env.HNOSS_SIG || 'AUTHORIZED-TUNNEL',
  'X-Build-Timestamp': new Date().toISOString()
};

// DOM Mutation Observer - schützt vor Änderungen
export const domProtection = `
<script>
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.type === 'childList' && m.target.tagName === 'BODY') {
      const unauthorized = m.addedNodes.some(n => 
        n.nodeType === 1 && n.tagName === 'SCRIPT' && !n.src?.includes('localhost')
      );
      if (unauthorized) {
        console.error('Unauthorized DOM modification detected');
        document.body.innerHTML = '';
      }
    }
  });
});
observer.observe(document.body, { childList: true, subtree: true });
</script>
`;