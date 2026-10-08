# 11 — cache, artifacts, packages, retention, and attestations

## Prerequisites and focused goal

Complete canonical lab 16 first. Preserve one build result and explain why it is not a dependency cache.

## Objective and domain

Secure and optimize automation: choose cache versus artifact, reason about retention/API controls, and separate package/attestation generation from verification without publishing or deploying.

## Files to inspect or edit

- Complete `decision-table.md`.
- Repair inactive `supply-chain.workflow.yml.txt`.
- Run `make-artifact.mjs` and `verify-artifact.mjs` locally.
- Compare with `solution.workflow.yml.txt` and `solution.md` afterward.

## Tasks

1. Use cache for npm dependency reuse with an exact key plus broader ordered restore prefix; explain cache-poisoning boundaries.
2. Use artifacts to move a package/report between jobs and set artifact `retention-days` deliberately.
3. Build a local deterministic artifact plus SHA-256 statement, then verify it. This models digest verification, not a GitHub-signed attestation.
4. Add a safe, inactive package/attestation workflow sketch with `packages: write` and `attestations: write` only on the producing job. Do not publish, sign, or deploy.
5. Write the verification command that constrains expected repository identity before trust.

## Expected observable result

Local verification prints `verified sha256=...`. The inactive workflow distinguishes dependency cache, run artifact, package permission, attestation generation, and downstream attestation verification.

## Verification commands or checklist

```bash
node examples/11-cache-artifacts-attestations/make-artifact.mjs
node examples/11-cache-artifacts-attestations/verify-artifact.mjs
```

Checklist: a cache is never treated as authoritative release evidence; verification checks digest and expected identity; all publish/attest YAML is `.txt`; no external mutation occurs.

## Answer or solution location

Use [`solution.workflow.yml.txt`](solution.workflow.yml.txt) and [`solution.md`](solution.md). Local digest verification models a trust decision; it is not a GitHub-signed attestation or a hosted retention/API proof.

## Primary official links

- [Caching dependencies](https://docs.github.com/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Storing workflow data as artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts)
- [Artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations)
- [Verifying attestations with GitHub CLI](https://cli.github.com/manual/gh_attestation_verify)
- [Publishing Node.js packages](https://docs.github.com/actions/publishing-packages/publishing-nodejs-packages)
