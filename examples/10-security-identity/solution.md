# Security reasoning

- A full commit SHA makes the referenced action content immutable from the consumer's point of view; branches and tags can move.
- `id-token: write` lets a workflow request an OIDC token. The cloud-side trust policy still decides whether exchange/access is allowed.
- Environment reviewers gate the job that references the environment and can protect environment secrets. Branch protection required reviews govern changes/merges; they are not the deployment approval itself.
- `pull_request_target` runs in base-repository context. Checking out and executing fork-controlled head code there can expose privileged tokens/secrets. Use unprivileged `pull_request` for testing untrusted code, and carefully separate any privileged follow-up.

