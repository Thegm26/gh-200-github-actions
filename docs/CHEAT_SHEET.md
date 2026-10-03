# Last-hour GH-200 cheat sheet

Technical authority: [GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and [GitHub Actions docs](https://docs.github.com/actions).

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

YAML anchors are file-local reuse: `defaults: &defaults { shell: bash }`, then `<<: *defaults`. In troubleshooting, expand merge keys mentally; an explicit key wins. See [anchors](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#yaml-anchors-and-aliases).

`workflow_dispatch` is manual; `schedule` is cron; `repository_dispatch` is webhook-style; `push`/`pull_request` are repository events. Scope events and permissions narrowly. [Triggers](https://docs.github.com/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow).

## Reuse, runners and data persistence

| Thing | What it is | Invocation/lifetime |
| --- | --- | --- |
| Starter workflow | copied scaffold | independent after creation |
| Reusable workflow | workflow with `on: workflow_call` | called as a job; versioned centrally |
| Composite action | bundled workflow steps in `action.yml` | used as a step |
| JavaScript / Docker action | code/container action | used as a step |
| Cache | keyed dependency/build reuse | mutable optimization; cache hit may be stale relative to source |
| Artifact | run output for download/pass files | immutable upload per run; retention applies |

Services run alongside a job: use `services`, mapped ports, health options and `localhost:<port>` on a VM job (or service label inside a job container). Matrix `include` adds combinations; `exclude` removes; `fail-fast: false` lets siblings finish; cap `max-parallel` for cost. Track hosted runner changes through [runner images](https://github.com/actions/runner-images); do not assume `ubuntu-latest` or `windows-latest` is static.

## Security and governance

`GITHUB_TOKEN` is ephemeral and repository-scoped; set `permissions` minimum per workflow/job. A PAT is user/app-issued and must be deliberately stored/scoped. OIDC requires `id-token: write`, exchanges a signed identity token with a cloud trust, and avoids long-lived cloud credentials. [OIDC](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers).

Prefer verified/maintained Marketplace actions; pin third-party actions to a **full commit SHA**, not `@main` or a mutable tag. Immutable actions enforcement can reject mutable references on hosted runners. Validate/quote untrusted inputs; pass values through env; never run an issue title/PR text as shell syntax. [Hardening](https://docs.github.com/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions).

Secrets are encrypted and masked; variables are non-secret configuration. Both may be organization, repository, or environment scoped; environment protection/approval gates apply when a job references that environment. The most specific available configuration wins for a given name; environment values are available only after the environment is reached. Use REST endpoints to set retention or manage secrets/variables where permitted. [Secrets](https://docs.github.com/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) · [Variables](https://docs.github.com/actions/learn-github-actions/variables).

Runner groups decide which repositories can use self-hosted runners; enterprise action policies decide which actions/workflows are allowed; IP allow lists/networking constrain traffic. Hosted images expose preinstalled tools/toolcache; use setup actions, package managers, cache, container images or curated self-hosted images for deterministic tools.

Attestations bind artifact digest, build provenance and identity. Generate during build and verify before release/deploy with `gh attestation verify` or supported APIs; verification must check the expected repository/identity and artifact digest. [Artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations).

## Fast distinctions

Disable preserves a workflow and history but stops automatic triggering; delete removes its workflow file/history behavior according to the UI/API action. Retention is not caching. `pull_request_target` has base-repository privileges/context: never check out and execute untrusted PR code in it. A job summary is Markdown written to `GITHUB_STEP_SUMMARY`, not a log annotation. [Retention REST API](https://docs.github.com/rest/actions/permissions#set-github-actions-retention-limit-for-an-organization).
