# Connectors

Uniform HTTP adapters used by every stage. Each connector reads its
credentials from `00-core/ids.env` (or Lovable Cloud secrets in CI).

- datacite.sh — Register DOIs (DATACITE_USER, DATACITE_PASS)
- github.sh   — Trigger workflow_dispatch (GITHUB_TOKEN)
- gitlab.sh   — Trigger GitLab pipeline (GITLAB_TOKEN)
- cloudflare.sh — Publish Worker (CLOUDFLARE_API_TOKEN)
- kong.sh     — Import gateway keys (KONG_ADMIN_URL)
- gpp.sh      — POST GPP live-tick events (GPP_NODE_URL)

All connectors share the same call shape:

    ./<connector>.sh <verb> <PNIA_ID> [payload.json]