/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 *
 * 🔒 PNIA Silent State Audit Module
 * Wird automatisch durch den Government Worker injiziert.
 * Überwacht User-Verhalten in Echtzeit und meldet verdächtige Aktivitäten.
 */
(function() {
    'use strict';
    
    // Audit-Endpoint (kann angepasst werden)
    const AUDIT_LOG_URL = '/api/security/audit-log';
    
    // Sicherheits-Scanner
    const audit = {
        violations: [],
        score: 0,
        
        // Verdacht melden
        report: function(violation, severity = 'medium') {
            const entry = {
                timestamp: new Date().toISOString(),
                event: violation,
                severity: severity,
                url: window.location.pathname,
                userAgent: navigator.userAgent
            };
            
            console.warn('[PNIA-AUDIT] Sicherheitssperre aktiv:', violation);
            audit.violations.push(entry);
            
            // Silent report via beacon (keine blocking requests)
            if (navigator.sendBeacon) {
                navigator.sendBeacon(AUDIT_LOG_URL, JSON.stringify(entry));
            }
        }
    };
    
    // ==========================================================================
    // Security Checks
    // ==========================================================================
    
    // Check 1: SQL Injection / XSS in Eingabefeldern
    document.addEventListener('input', function(e) {
        const val = e.target.value || '';
        const sqlPattern = /(select|drop|delete|insert|update|union|exec|execute)/i;
        const xssPattern = /<script|javascript:|on\w+\s*=|<\s*\/\s*script/i;
        
        if (sqlPattern.test(val) || xssPattern.test(val)) {
            audit.report('Illegale Eingabe erkannt: ' + (e.target.name || 'unbenannt'), 'high');
            // Eingabe säubern
            e.target.value = val.replace(/[<>]/g, '');
        }
    }, { capture: true });
    
    // Check 2: DevTools Manipulationsversuch
    let devtoolsOpen = false;
    setInterval(function() {
        const threshold = 200;
        const detected = window.outerHeight - window.innerHeight > threshold || 
                        window.outerWidth - window.innerWidth > threshold;
        
        if (detected && !devtoolsOpen) {
            devtoolsOpen = true;
            audit.report('DevTools Manipulation erkannt', 'high');
            console.clear();
        }
    }, 3000);
    
    // Check 3: Console Manipulation
    const originalConsole = { ...console };
    ['log', 'warn', 'error', 'info'].forEach(function(method) {
        const original = console[method];
        console[method] = function() {
            // Leise überwachen - keine Änderung der Ausgabe
            return original.apply(console, arguments);
        };
    });
    
    // Check 4: DOM Mutation Monitoring (weitere Sicherheit)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        const src = node.src || '';
                        // Erlaubte Origins
                        const allowedOrigins = [
                            'pLedge250freedom.gov.eu',
                            'localhost'
                        ];
                        
                        const isAllowed = allowedOrigins.some(function(origin) {
                            return src.includes(origin);
                        });
                        
                        if (!isAllowed && !node.hasAttribute('data-secure-core')) {
                            audit.report('Unbekanntes Script wurde blockiert', 'medium');
                            if (node.remove) node.remove();
                        }
                    }
                });
            }
        });
    });
    
    if (document.documentElement) {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialisierung
    console.log('🔒 PNIA Silent State Audit aktiviert für pLedge250freedom.gov.eu');
})();