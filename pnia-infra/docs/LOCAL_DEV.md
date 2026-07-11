# PNIA — Local Development Walkthrough

End-to-end guide to run the PNIA infra stack on your laptop.

## 0. Prerequisites

- Docker 24+ with `docker compose` v2
- GNU Make, Bash 5, Python 3.12+, Go 1.22+ (only for 08-gpp-node)
- shellcheck, ruff (optional but recommended)

## 1. Clone & configure

    git clone <your-fork> pnia
    cd pnia/infra
    cp 00-core/ids.env.template 00-core/ids.env
    $EDITOR 00-core/ids.env         # fill secrets, never commit

Required env vars per connector (see api/connectors/README.md):

| Connector      | Required env vars                          |
|----------------|--------------------------------------------|
| github.sh      | GITHUB_TOKEN, GITHUB_REPO                  |
| gitlab.sh      | GITLAB_TOKEN, GITLAB_PROJECT_ID            |
| datacite.sh    | DATACITE_USER, DATACITE_PASS               |
| cloudflare.sh  | CLOUDFLARE_API_TOKEN, CF_ACCOUNT_ID        |
| kong.sh        | KONG_ADMIN_URL                             |
| gpp.sh         | GPP_NODE_URL                               |

Load into your shell:

    set -a; source 00-core/ids.env; set +a

## 2. Validate the registry (fail-fast)

    make validate                    # header + row schema
    make validate-dag                # DAG check: no cycles, no dangling deps

`validate-dag` is now run automatically before `deploy-all` and by CI.

## 3. Run with docker compose

Top-level compose ships profiles per stage. Bring up only what you need:

    docker compose --profile registry up -d              # Postgres registry
    docker compose --profile gateway up -d               # Kong gateway
    docker compose --profile orchestrator up             # Python orchestrator

Bring the whole stack:

    docker compose --profile registry --profile gateway --profile orchestrator up -d

Tear down and remove per-ID containers created by deploy scripts:

    make clean

## 4. Make targets

| Target              | What it does                                              |
|---------------------|-----------------------------------------------------------|
| `make help`         | list all targets                                          |
| `make lint`         | shellcheck every *.sh in infra/                           |
| `make validate`     | registry schema check                                     |
| `make validate-dag` | DAG validity (cycles + dangling refs)                     |
| `make deploy ID=X`  | deploy a single ID (docker compose -p pnia-x up -d)       |
| `make deploy-all`   | validate-dag + parallel wave deploy                       |
| `make orchestrate`  | python asyncio orchestrator (v2)                          |
| `make test`         | end-to-end orchestrator integration test                  |
| `make clean`        | remove all pnia-* containers                              |

## 5. Connector smoke test

    bash api/connectors/kong.sh POST PNIA-001
    bash api/connectors/gpp.sh POST PNIA-001 /dev/null

Each connector fails fast (`: "${VAR:?}"`) if its env var is missing.

## 6. Health endpoint (Lovable UI)

- `/infra`         — file tree + zip download
- `/infra/health`  — JSON readiness + last-run per connector

Health is also fetched from the browser at `/api/infra-health`.

## 7. End-to-end test

    make test

Runs `pnia_orchestrator.v2.py` against the fixture registry in
`tests/fixtures/registry.csv` with `PNIA_DEPLOY_BIN=tests/mock_deploy.sh`,
so no Docker is required. Asserts every ID succeeds and dependency
ordering is respected.

## 8. Troubleshooting

- **`registry header mismatch`** — the CSV header must be exact; see
  `00-core/lib/validate.sh`.
- **`cycle detected`** — `validate-dag` prints the cycling nodes; fix
  `DEPENDS_ON` in `00-core/registry.csv`.
- **connector prints `VAR: parameter null or not set`** — you skipped
  `source 00-core/ids.env`.
- **Worker download 500** — rebuild after changing `infra/`; Vite inlines
  every file with `import.meta.glob` at build time.
