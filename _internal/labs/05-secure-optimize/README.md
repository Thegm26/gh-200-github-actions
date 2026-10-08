# Lab 05 — secure and optimize

Start with canonical labs 14–17 in [COURSE.md](../../docs/COURSE.md), then use these non-deploying modules:

- [10 — permissions, identity, injection, pinning, environments](../../examples/10-security-identity/README.md)
- [11 — cache, artifacts, packages, retention, attestations](../../examples/11-cache-artifacts-attestations/README.md)
- [12 — final mixed capstone](../../examples/12-final-capstone/README.md)

The legacy `starter/insecure-deploy.workflow.yaml.txt` is optional extra practice. Expected failure: broad trust and unsafe input handling. Success: justify every permission, identity, pin, and artifact decision before comparing `solution/secure-pattern.yml`; keep it inactive.

Primary sources: [security hardening](https://docs.github.com/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions) · [OIDC](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers) · [attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations).
