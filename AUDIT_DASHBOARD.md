# 🔒 PNIA Security Audit Dashboard

**Live-Forensik-Übersicht für pLedge250freedom.gov.eu**

---

## 📊 Überwachungscockpit

### Endpunkt
- `/api/security/audit-log` - Empfängt silent reports vom Client

### Datenstruktur (Audit Entry)
```javascript
{
  timestamp: "2026-07-06T04:45:00.000Z",
  event: "Illegale Eingabe erkannt",
  severity: "high|medium|low",
  url: "/pfad/zur/seite",
  userAgent: "Mozilla/5.0...",
  node_id: "DE-NOD-01"
}
```

---

## 🚀 Schnellstart: Dashboard mit Vanilla JS

### 1. Audit API Endpoint (cloudflare-worker.js erweitern)

Fügen Sie diesen Code in den Worker ein:

```javascript
// Audit Log Endpoint
if (url.pathname === '/api/security/audit-log' && request.method === 'POST') {
  const data = await request.json();
  // In-memory buffering (Cloudflare KV für persistente Speicherung)
  console.log('SECURITY ALERT:', JSON.stringify(data));
  // Optional: KV.put('audit:' + Date.now(), JSON.stringify(data));
  return new Response('{"status":"ok"}', { status: 200 });
}
```

### 2. Live-Visualisierung (HTML)

Speichern Sie als `audit-dashboard.html`:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>🔒 PNIA Security Audit Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0d1117; color: #c9d1d9; font-family: monospace; padding: 20px; }
    .header { border-bottom: 1px solid #30363d; padding-bottom: 15px; margin-bottom: 20px; }
    .badge { background: #8b0000; color: white; padding: 2px 8px; font-size: 12px; border-radius: 3px; }
    .alerts { max-height: 80vh; overflow-y: auto; }
    .alert { 
      background: #161b22; border-left: 3px solid #58a6ff; padding: 10px; margin-bottom: 10px;
      font-size: 12px;
    }
    .alert.high { border-color: #f85149; }
    .alert.medium { border-color: #e3b341; }
    .timestamp { color: #8b949e; font-size: 11px; }
    .severity { 
      display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; margin-left: 10px;
    }
    .severity.high { background: #f85149; color: white; }
    .severity.medium { background: #e3b341; color: black; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔒 PNIA Security Audit <span class="badge">LIVE</span></h1>
  </div>
  <div class="alerts" id="alerts"></div>

  <script>
    // Simulierte Live-Daten (in Production: WebSocket vom Server)
    const alerts = document.getElementById('alerts');
    
    function addAlert(data) {
      const div = document.createElement('div');
      div.className = 'alert ' + (data.severity || 'medium');
      div.innerHTML = `
        <span class="severity ${data.severity}">${data.severity.toUpperCase()}</span>
        <strong>${data.event}</strong>
        <div class="timestamp">${new Date(data.timestamp).toLocaleString()}</div>
        <div>${data.url} - ${data.userAgent?.substring(0, 50)}...</div>
      `;
      alerts.prepend(div);
    }

    // Polling alle 5 Sekunden (Alternative: SSE oder WebSocket)
    setInterval(async () => {
      try {
        const res = await fetch('/api/security/audit-log/recent');
        const data = await res.json();
        if (data.alerts) data.alerts.forEach(addAlert);
      } catch (e) { /* silent */ }
    }, 5000);

    // Initialer Check
    console.log('🔒 Audit Dashboard bereit für pLedge250freedom.gov.eu');
  </script>
</body>
</html>
```

---

## 🛠️ EasyPanel Deployment

```bash
# Im EasyPanel Terminal
cd /app/scripts
node audit-server.js &  # Optional: Separate Audit-Engine
```

### audit-server.js (Minimal)

```javascript
const express = require('express');
const app = express();
app.use(express.json());

let alerts = [];

app.post('/api/security/audit-log', (req, res) => {
  alerts.push(req.body);
  console.log('SECURITY ALERT:', req.body);
  res.json({ status: 'ok' });
});

app.get('/api/security/audit-log/recent', (req, res) => {
  res.json({ alerts: alerts.slice(-20) });
});

app.listen(3001, () => console.log('Audit Server on :3001'));
```

---

## 🔐 Sicherheitshinweise

1. **Das Dashboard ist selbst geschützt** durch den Government Worker
2. **Keine öffentliche API** - nur intern erreichbar
3. **Silent Reports** - keine störenden Popups für Nutzer
4. **Forensik-Daten** werden via `sendBeacon` gesendet (unabhängig vom Page-Lifecycle)