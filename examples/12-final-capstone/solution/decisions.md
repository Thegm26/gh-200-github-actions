# Capstone decision key

- Trigger: PR to `main` AND matching source/test path; typed Boolean for safe manual preview.
- Output: `GITHUB_OUTPUT` → `steps.meta.outputs.version` → `jobs.prepare.outputs.version` → `needs.prepare.outputs.version`.
- Matrix: `fail-fast: false` lets siblings finish; `max-parallel` controls simultaneous work; `exclude` removes one combination.
- Artifact carries report bytes between/after jobs; cache is for reusable dependency/build optimization.
- `GITHUB_TOKEN` is ephemeral and permission-scoped; OIDC needs `id-token: write` and cloud trust; use env/quoting for untrusted text; full SHAs; protected production environment.
- Multi-job central graph → reusable workflow; step sequence → composite action; copied scaffold → starter workflow.
- Runner group controls repository access to self-hosted capacity; action policy controls allowed action/workflow sources.
- Generate provenance during trusted build; verify expected repository/identity and subject digest before promotion.

