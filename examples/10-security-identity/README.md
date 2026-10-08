# 10 — permissions, identity, injection, pinning, and environments

## Prerequisites and focused goal

Complete canonical labs 13–15 first. Reduce one workflow's trust boundary without deploying.

## Objective and domain

Secure and optimize automation: apply least-privilege `GITHUB_TOKEN` permissions, choose PAT versus OIDC, prevent script injection, pin actions, and gate production with environments.

## Files to inspect or edit

- Repair inactive `insecure.workflow.yml.txt`.
- Complete `identity-table.md`.
- Compare with `solution.workflow.yml.txt` and `solution.md` only after a complete attempt.

## Tasks

1. Replace `write-all` with job-specific minimum permissions. Remember: once any explicit permission is set, unspecified permissions become `none`.
2. Make PR-title handling safe by passing the context value through `env` and quoting it as shell data.
3. Replace mutable action refs with reviewed full 40-character commit SHAs.
4. Choose among ephemeral repository-scoped `GITHUB_TOKEN`, deliberately stored/scoped PAT or GitHub App token, and OIDC federation with `id-token: write`.
5. Put deploy behind `environment: production`; distinguish environment required reviewers from branch-protection PR review.
6. Explain why `pull_request_target` plus checkout/execution of fork code is a privileged-code-execution trap.

## Expected observable result

The repaired workflow uses `contents: read`; grants `id-token: write` only to the cloud-auth job; treats event text as data; uses full SHAs; and references a protected environment without a real deployment.

## Verification commands or checklist

```bash
node examples/10-security-identity/check.mjs examples/10-security-identity/insecure.workflow.yml.txt
```

Checklist: no `write-all`; no `@main` or short tag; no direct untrusted context in `run`; no long-lived cloud secret; no deployment command.

## Answer or solution location

Use [`solution.workflow.yml.txt`](solution.workflow.yml.txt), [`solution.md`](solution.md), and [`identity-table.solution.md`](identity-table.solution.md). The regex checker is deliberately limited; manually verify every job has only needed permissions and that OIDC is granted only to a job which actually federates. A full SHA may be required by an organization/repository policy; immutable release tags are also a supported action-release strategy, so do not claim GitHub universally rejects tags.

## Primary official links

- [Security hardening for GitHub Actions](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [`GITHUB_TOKEN` permissions](https://docs.github.com/actions/security-for-github-actions/security-guides/automatic-token-authentication)
- [OIDC in cloud providers](https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Deployments and environments](https://docs.github.com/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment)
