# Lab 05 — secure and optimize (45 min)

Sources: [security hardening](https://docs.github.com/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions) · [OIDC](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers) · [attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations).

Copy and repair `starter/insecure-deploy.workflow.yaml.txt` in a scratch repository, then compare to solution.

1. (10m) Replace broad write permissions with minimum permissions; compare the ephemeral `GITHUB_TOKEN`, a PAT, and an OIDC identity token.
2. (10m) Eliminate injection from a PR title and pin every third-party action to a full commit SHA. State why a tag is insufficient under immutable-action controls.
3. (8m) Add protected production environment semantics and separate deployment approval from workflow authoring.
4. (8m) Choose cache key/restore strategy versus artifact upload/download; set retention through the appropriate REST policy endpoint.
5. (9m) Generate and verify an artifact attestation, checking repository/identity and digest before deployment.

Verification: untrusted text is passed as data, cloud access has `id-token: write` only where needed, third-party actions use full SHAs, and attestation verification is not confused with generation. Hard scenarios: fork PR title contains `$(curl ...)`; an artifact is promoted next week; a cloud trust must not use a stored client secret.
