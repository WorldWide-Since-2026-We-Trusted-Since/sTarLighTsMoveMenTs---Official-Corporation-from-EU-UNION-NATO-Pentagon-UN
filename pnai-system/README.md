# PNAI Live System

Ein echtes, lauffähiges System, das **echte Live-Daten ohne Registrierung** integriert und
sie in die Wonnet / Master-Token-Bewertungslogik einspeist. Keine Platzhalter, keine Dummys.

## Was echt ist (ohne Registrierung, sofort nutzbar)

| Quelle | Daten | Key nötig? |
|--------|-------|-----------|
| CoinGecko (simple/price) | Live-Krypto-Kurse (BTC, ETH, …) in EUR/USD | nein |
| CoinGecko (global) | Gesamt-Marktkap., BTC-Dominanz, aktive Coins | nein |
| Frankfurter (EZB) | Live-Devisenkurse EUR→USD/GBP/CHF/… | nein |
| Multi-Chain public RPC | Live-Block + Gas auf ETH, Polygon, BSC, Optimism, Base, Arbitrum | nein |
| Ethereum public RPC | ERC-20 totalSupply/symbol (Master-Token) | nein |
| DeFiLlama | Globales TVL + Top-Chains + Top-Protokolle (7700+) | nein |
| alternative.me | Fear & Greed Index | nein |
| Coinbase WebSocket | Echtzeit-Ticker (Streaming, ~laufend) | nein |

Alle Werte werden mit voller **Provenance** geliefert (Quelle, Endpoint, Zeitstempel),
sodass jede Zahl nachprüfbar echt ist. Die Abfragen laufen **parallel** (`asyncio.gather`).

## Was NICHT ohne Registrierung geht (ehrliche Grenze)

Echte Fiat-Auszahlungen (Stripe, Circle, Coinbase, Monerium, SEPA-Bank-Rails) bewegen echtes
Geld und sind gesetzlich an Registrierung + KYC + Lizenz gebunden (MiCA, PSD2, AML). Es gibt
dafür **keinen Workaround**. Das Modul `pnai/integrations/settlement.py` ist ein echter,
korrekt strukturierter Client, der nur dann eine Live-Auszahlung versucht, wenn du **deine
eigenen** Provider-Credentials hinterlegst — und sonst `not_configured` meldet, statt eine
Zahlung vorzutäuschen.

## Start

```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt

# CLI: ein Live-Snapshot ins Terminal
python -m pnai.cli

# Web-Dashboard + API (Auto-Refresh alle 10s)
uvicorn pnai.api.app:app --reload --port 8000
# -> http://localhost:8000
```

### Endpoints
- `GET /` – Live-Dashboard (GIGA-Layout: Markt, Multi-Chain, DeFi, Sentiment, Ticker)
- `GET /api/snapshot` – kompletter Live-Snapshot (alle Feeds + Master-Token-Zertifikat)
- `GET /api/ticker` – aktueller Echtzeit-Ticker-Stand
- `WS  /ws/ticker` – Echtzeit-Streaming-Ticker (Coinbase) für das Dashboard
- `GET /api/settlement/status` – ob echte Settlement-Credentials konfiguriert sind
- `POST /api/settlement/test` – 1-Cent-Testauszahlung (nur mit echten Credentials)

### Optionale echte Erweiterungen (`.env`)
```bash
cp .env.example .env
# MASTER_TOKEN_ADDRESS=<echte ERC-20-Adresse>  -> liest live symbol/supply on-chain
# SETTLEMENT_*=<eigene Provider-Credentials>   -> aktiviert echte Auszahlungen
```

## Tests
```bash
pip install pytest && pytest -q
```
