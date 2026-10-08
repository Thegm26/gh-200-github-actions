# GH-200 cheat sheet

Technical authority: [GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and [GitHub Actions docs](https://docs.github.com/actions).

Recall first, then check. For hands-on repair use [01–02](../examples/01-triggers-contexts/README.md); for governance use [07–08](../examples/07-enterprise-policy-runners/README.md); for security/supply chain use [10–11](../examples/10-security-identity/README.md).

## Workflow grammar and data

```yaml
on:
  workflow_dispatch: { inputs: { deploy: { type: boolean, required: true } } }
  workflow_call: { inputs: { target: { type: string, required: true } }, secrets: { token: { required: true } } }
permissions: { contents: read, id-token: write }
jobs:
  test:
    if: ${{ github.ref == 'refs/heads/main' && inputs.deploy }}
    strategy: { fail-fast: false, max-parallel: 2, matrix: { node: [20, 22], os: [ubuntu-latest], exclude: [], include: [] } }
    runs-on: ${{ matrix.os }}
    outputs: { version: ${{ steps.meta.outputs.version }} }
    steps:
      - id: meta
        run: echo "version=1.2.3" >> "$GITHUB_OUTPUT"
      - run: echo "COLOR=blue" >> "$GITHUB_ENV"
      - run: echo "## Results" >> "$GITHUB_STEP_SUMMARY"
```

Contexts: `github` (event/ref), `github.event` (payload), `runner` (machine), `env` (workflow/job/step env), `vars` (configuration variables), `secrets` (masked secrets), `inputs` (manual/reusable call), `matrix`/`strategy`, `needs.<job>.outputs`, `job`, `steps.<id>.outputs`. Expressions use `${{ }}`; do not interpolate untrusted context directly into `run:`. `GITHUB_ENV` affects later steps in its job; `GITHUB_OUTPUT` exposes a step output; job outputs bridge jobs; artifacts bridge files.

GitHub documents YAML anchors and aliases for workflow reuse. Plain YAML parsers may also interpret merge keys such as `<<: *base`; this repository uses that only as a troubleshooting simulation, not as evidence that GitHub Actions supports merge keys. Expand any simulated mapping mentally before judging its effective values. See [anchors](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#yaml-anchors-and-aliases).

`workflow_dispatch` is manual; `schedule` is cron; `repository_dispatch` is webhook-style; `push`/`pull_request` are repository events. Scope events and permissions narrowly. [Triggers](https://docs.github.com/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow).

For authoring, the GitHub Actions VS Code extension and YAML schema can flag invalid keys, offer workflow/action metadata completion, and surface diagnostics. They are fast feedback, not a substitute for a real hosted run; use supplementary drill 9 to see one harmless inactive-file correction.

## Reuse, runners and data persistence

| Thing | What it is | Invocation/lifetime |
| --- | --- | --- |
| Starter workflow | copied scaffold | independent after creation |
| Reusable workflow | workflow with `on: workflow_call` | called as a job; versioned centrally |
| Composite action | bundled workflow steps in `action.yml` | used as a step |
| JavaScript / Docker action | code/container action | used as a step |
| Cache | keyed dependency/build reuse | mutable optimization; cache hit may be stale relative to source |
| Artifact | run output for download/pass files | immutable upload per run; retention applies |

An action's `action.yml` belongs at the action root. Composite actions map outputs from child steps; JavaScript actions must declare a matching runtime and committed entrypoint, then write outputs through the documented environment-file contract. The custom-actions module's Tasks 1, 2, and 5 are the hands-on checks for those distinctions.

Services run alongside a job: use `services`, mapped ports, health options and `localhost:<port>` on a VM job (or service label inside a job container). Matrix `include` adds combinations; `exclude` removes; `fail-fast: false` lets siblings finish; `max-parallel` caps peak concurrency. Reducing matrix combinations can reduce planned runner work; reducing concurrency alone does not guarantee lower billed work or cost because duration, runner type, platform billing, cache behavior, and failures matter. Track hosted runner changes through [runner images](https://github.com/actions/runner-images); do not assume `ubuntu-latest` or `windows-latest` is static.

## Security and governance

`GITHUB_TOKEN` is an ephemeral, per-job repository-scoped token; set `permissions` to the minimum at workflow or job level. A PAT is user-issued, while a GitHub App installation token represents an installed App: neither is “just another `GITHUB_TOKEN`.” Deliberately store and scope longer-lived credentials. OIDC requires `id-token: write`, exchanges a signed identity token with a cloud trust, and avoids long-lived cloud credentials. [OIDC](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers).

Prefer verified/maintained Marketplace actions; pin third-party actions to a **full commit SHA**, not `@main` or a mutable tag. A selected-actions/full-SHA policy governs the references consumers may use; an immutable publisher release/tag is a separate release-management control. Validate/quote untrusted inputs; pass values through env; never run an issue title/PR text as shell syntax. [Hardening](https://docs.github.com/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions).

Secrets are encrypted and masked; variables are non-secret configuration. Both may be organization, repository, or environment scoped; environment protection/approval gates apply when a job references that environment. The most specific available configuration variable wins, but environment-level variables become available after the runner starts and do **not** overwrite an existing `env` or rewrite another `vars` context. Secret values cannot be read back through REST: a rotation caller supplies a new encrypted value. Use REST endpoints to set retention or manage secrets/variables where permitted. [Secrets](https://docs.github.com/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) · [Variables](https://docs.github.com/actions/learn-github-actions/variables).

Runner groups decide which repositories can use self-hosted runners; enterprise action policies decide which actions/workflows are allowed; IP allow lists/networking constrain traffic. Hosted images expose preinstalled tools/toolcache; use setup actions, package managers, cache, container images or curated self-hosted images for deterministic tools.

Attestations bind artifact digest, build provenance and identity. Generate during build and verify before release/deploy with `gh attestation verify` or supported APIs; verification must check the expected repository/identity and artifact digest. Generation needs `contents: read`, `id-token: write`, and `attestations: write`; publishing a package may separately need `packages: write`. [Artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations).

Package publication with `GITHUB_TOKEN` normally needs `packages: write`; attestation generation needs all three permissions listed above: `contents: read`, `id-token: write`, and `attestations: write`. Those permissions do different jobs. The safe [supply-chain module](../examples/11-cache-artifacts-attestations/README.md) keeps publish/attest syntax inactive and simulates digest verification locally.

## Fast distinctions

Disable preserves a workflow definition for re-enable; remove its YAML file from `.github/workflows` to remove the future workflow definition. Deleting a run is a separate operation that removes that run's logs and artifacts. A selected-actions policy controls permitted action sources; require normal pull-request review (for example CODEOWNERS) for workflow-file changes. Retention is not caching. `pull_request_target` has base-repository privileges/context: never check out and execute untrusted PR code in it. A job summary is Markdown written to `GITHUB_STEP_SUMMARY`, not a log annotation. [Retention REST API](https://docs.github.com/rest/actions/permissions#set-artifact-and-log-retention-settings-for-an-organization).
