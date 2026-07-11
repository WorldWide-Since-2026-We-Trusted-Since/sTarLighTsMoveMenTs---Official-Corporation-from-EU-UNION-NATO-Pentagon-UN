# PNIA Infrastructure — v2 (Gold Transformation)

Deploy any service by its Unique ID. The registry is the single source of
truth; the ID resolves database, mesh route, gateway key, GPP manifest and
CI job in one shot.

## Layout

    infra/
      00-core/          shared registry, contract, lib (log/validate/parallel)
      01-registry/      deploy-by-ID (v2 hardened + original)
      02-scale-1000/    1000-instance resource generator
      03-service-mesh/  Istio VirtualServices, cross-links via DEPENDS_ON
      04-gateway/       Kong keys + credential rotation
      05-cloudflare/    Worker + wrangler
      06-orchestrator/  Python asyncio orchestrator (v2)
      07-gpp-protocol/  Good Public Protocol manifests
      08-gpp-node/      Go GPP node + protos
      09-first-state/   first-state daemon
      10-genesis/       certbot + nginx bootstrap
      api/              OpenAPI + uniform HTTP connectors
      ci/               GitHub Actions + GitLab CI (parallel matrix)
      docs/protocol.md  full research protocol (reference)
      Makefile          one-liner ops
      docker-compose.yml top-level, profiled per stage

## Cross-connection

    registry.csv (ID -> everything)
        |
        +--> deploy (docker)
        +--> gateway (Kong)
        +--> GPP tick (07 / 08)
        +--> DOI archive (DataCite)
        +--> CI (GitHub / GitLab)
        +--> edge (Cloudflare)

Independent IDs deploy concurrently (xargs -P or asyncio.gather);
dependents wait on DEPENDS_ON — implemented once in
00-core/lib/parallel.sh and mirrored in the Python orchestrator.

## Quick start

    cp 00-core/ids.env.template 00-core/ids.env
    make validate
    make deploy ID=PNIA-001
    make deploy-all
    make orchestrate

## Hardening rules

- set -Eeuo pipefail, IFS, trap ERR
- All variables quoted; ShellCheck-clean
- Idempotent (docker compose -p per ID)
- Structured JSON logs (00-core/lib/log.sh)
- Python: type hints, asyncio.gather
- CI: shellcheck gate before deploy; matrix strategy for parallelism

## Downloading

Open /infra in this Lovable app and click Download infra.zip.
