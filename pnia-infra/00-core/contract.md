# PNIA Deployment Contract

This contract is the machine- and human-readable agreement that every
deployment triggered from an ID in `registry.csv` MUST fulfil.

## Parties
- **Operator**: holder of `PNIA_ORG_ID` + `PNIA_LICENSE_KEY`.
- **GPP Node**: Good Public Protocol node at `GPP_NODE_URL`.
- **Archive**: DataCite / DOI-registered long-term archive.

## Guarantees
1. Reproducibility — same ID + registry row => same deployment.
2. Idempotency — re-running never corrupts state.
3. Parallel safety — `DEPENDS_ON` DAG honoured by `lib/parallel.sh`.
4. Auditability — every action emits a structured JSON log line.
5. Sovereignty — data leaves only via `api/connectors/` under declared license.

## Termination
Void if license revoked, GPP unreachable > 24h, or registry row removed.

See `api/openapi.yaml` for the machine-readable interface.