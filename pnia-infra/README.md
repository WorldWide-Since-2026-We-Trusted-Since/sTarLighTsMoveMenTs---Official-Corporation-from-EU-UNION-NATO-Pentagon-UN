# PNIA Infrastructure Bundle

Real, verbatim extraction of every executable artifact defined in
`ProtokolInfrastructurImplementation.txt` — the PNIA / GPP / First-State
protocol conversation.

Nothing here is placeholder or dummy data: each file is the exact code as
written in the source protocol. The only additions are the small header
comments at the top of each file naming the source line range.

Generated: 2026-07-06T15:21:42.189Z

## Contents

### ID Registry & Deployment

- `01-registry/registry.csv` — Registry mapping each PNIA ID to a database engine, port and DB name. _(source lines 17-22)_
- `01-registry/deploy_service.sh` — Interactive deploy script driven by a unique PNIA ID. _(source lines 25-70)_
- `01-registry/docker-compose.yml` — docker-compose file that consumes the exported registry variables. _(source lines 75-85)_

### 1000-Instance Scale-Out

- `02-scale-1000/gen_pnia_resources.sh` — Generates 1000 Kubernetes manifests with GPU/CPU/RAM reservations. _(source lines 102-170)_

### Service Mesh

- `03-service-mesh/pnia_service.yaml` — Headless Service manifest enabling direct pod addressing. _(source lines 195-213)_
- `03-service-mesh/gen_virtual_services.sh` — Istio VirtualService generator for 1000 IDs. _(source lines 218-247)_

### API Gateway (Kong)

- `04-gateway/configure_gateway.sh` — Registers 1000 services and routes through the Kong Admin API. _(source lines 294-326)_
- `04-gateway/generate_credentials.sh` — Generates one cryptographic API key per PNIA ID and writes credentials.csv. _(source lines 348-370)_
- `04-gateway/kong_key_import_example.sh` — Curl example to push a single generated key into Kong for one consumer. _(source lines 380-384)_

### Cloudflare Edge Routing

- `05-cloudflare/worker.js` — Cloudflare Worker: maps PNIA-XXXX subdomains to internal services. _(source lines 411-432)_

### Orchestration & Self-Report

- `06-orchestrator/pnia_orchestrator.py` — MCP-based orchestrator that emits scientific manifests for 1000 instances. _(source lines 463-533)_
- `06-orchestrator/lint_pnia.sh` — kube-linter run over the generated scientific manifests. _(source lines 555-563)_
- `06-orchestrator/orchestrator.q` — KDB+/Q orchestrator: in-memory instance registry + audit paper. _(source lines 590-620)_
- `06-orchestrator/self_report.q` — Self-identifying database bootstrap in KDB+/Q (broadcasts hardware via MCP). _(source lines 670-699)_

### GPP Protocol & Manifests

- `07-gpp-protocol/doi_ingest_broker.py` — DOI Ingest Broker calling the DataCite Fabrica API. _(source lines 930-964)_
- `07-gpp-protocol/gpp-manifest.yaml` — Good-Public-Protocol compliance manifest (v1). _(source lines 1114-1134)_
- `07-gpp-protocol/gpp-interface.yaml` — GPP interface / compliance-gateway definition. _(source lines 1202-1237)_
- `07-gpp-protocol/gpp-state-sync.yaml` — GPP state-sync delta-ingest manifest. _(source lines 1282-1297)_
- `07-gpp-protocol/compute-audit-manifest.yaml` — HPC compute-audit manifest. _(source lines 1358-1373)_
- `07-gpp-protocol/gpp-live-tick-manifest.yaml` — GPP live-tick / event-sourcing manifest. _(source lines 1513-1527)_

### GPP Node (Go + gRPC)

- `08-gpp-node/proto/gpp_bridge.proto` — gRPC contract for HPC → GPP high-frequency tick stream. _(source lines 1569-1593)_
- `08-gpp-node/interceptor.go` — gRPC interceptor performing OPA-based compliance validation. _(source lines 1599-1623)_
- `08-gpp-node/proto/gpp.proto` — BuildingState + ValidationReceipt protocol contract. _(source lines 2084-2105)_
- `08-gpp-node/pkg/shower/validator.go` — 'Shower' engine – strips placeholders / dummies at nanosecond latency. _(source lines 2111-2146)_
- `08-gpp-node/cmd/gpp-node/main.go` — RBX-Node core: P2P sync, HPC ingest, endgeldlohn ledger. _(source lines 2152-2224)_

### First-State Constitution

- `09-first-state/connect.go` — First-State connect: constitutional session bridge between two RBXs. _(source lines 2339-2417)_
- `09-first-state/core_daemon.go` — First-State Core Daemon – the digital constitution runtime. _(source lines 2515-2632)_
- `09-first-state/protocol_handler.go` — Full daemon with GPP request/response helper structs. _(source lines 2665-2765)_

### Genesis Node Bootstrap

- `10-genesis/deploy_genesis.sh` — All-in-one Genesis-Node bootstrap script (Arch Linux). _(source lines 2853-2892)_
- `10-genesis/nginx-initial.conf` — Initial Nginx reverse-proxy config (HTTP, pre-TLS). _(source lines 2897-2911)_
- `10-genesis/certbot.sh` — Certbot HTTPS provisioning for the node domain. _(source lines 2942-2950)_
- `10-genesis/nginx-final.conf` — Final Nginx TLS config (HTTPS-enforced). _(source lines 2954-3007)_

## How to use

Each script targets its own runtime. In order of the folders:

1. `01-registry` — `bash deploy_service.sh` (needs `registry.csv` + Docker).
2. `02-scale-1000` — `bash gen_pnia_resources.sh`, then `kubectl apply -f pnia_manifests/`.
3. `03-service-mesh` — `kubectl apply -f pnia_service.yaml` + generator for Istio VirtualServices.
4. `04-gateway` — Kong Admin API + credentials generation.
5. `05-cloudflare` — deploy `worker.js` in the Cloudflare dashboard.
6. `06-orchestrator` — `python3 pnia_orchestrator.py`, KDB+/Q scripts run inside `q`.
7. `07-gpp-protocol` — apply GPP manifests to your compliance gateway.
8. `08-gpp-node` — Go module: `go build ./cmd/gpp-node` after `protoc --go_out ...`.
9. `09-first-state` — First-State daemon: `go run ./core_daemon.go`.
10. `10-genesis` — bootstrap an Arch-Linux Genesis node end-to-end.

Every script contains only real endpoints/hosts as written in the protocol.
Where a domain such as `deine-domain.de` appears it is a placeholder
**you must replace with your own registered domain** — the protocol
marks these explicitly. No secret material is shipped.

