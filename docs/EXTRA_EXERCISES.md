# Supplementary objective drills

These are optional, one-concept extensions. Create the named files under your ignored `.practice/` folder; keep workflow sketches as `.yml.txt` unless using the authorized sandbox. The canonical lab checker does not inspect these drills. Every pass decision below is manual, and hosted configuration remains hosted-only.

## 1. Events: weekday schedule, dispatch webhook, Boolean input

**Write:** `.practice/extra-events/workflow.yml.txt`.

**Scenario:** an operations workflow may run at 06:00 UTC on weekdays, accept only a `repository_dispatch` event called `release-ready`, or be started manually with Boolean `publish` defaulting to `false`. Add all three trigger blocks. **Pass:** point to `0 6 * * 1-5`, `types: [release-ready]`, and an input whose `type` is `boolean`; explain why a webhook payload and cron schedule are different sources, and why an unchecked publish switch stays false. [Primary reference: triggers](https://docs.github.com/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow)

## 2. Reusable workflow input and secret mapping

**Write:** `.practice/extra-reusable/called.yml.txt` and `.practice/extra-reusable/caller.yml.txt`.

**Scenario:** a reusable deployment check needs a required string `region` and required secret `deploy_token`. In the called file declare both under `on.workflow_call`; in the caller use the called workflow, pass `region`, and map the caller secret explicitly with `secrets: { deploy_token: ${{ secrets.DEPLOY_TOKEN }} }`. **Pass:** identify the declaration and mapping in separate files, explain that a called workflow does not automatically receive caller secrets, and confirm neither file prints the token. [Primary reference: reusable workflows](https://docs.github.com/actions/sharing-automations/reusing-workflows)

## 3. Environment file, later step, summary, badge, and required check plan

**Write:** `.practice/extra-summary/workflow.yml.txt` and `.practice/extra-summary/protection-plan.md`.

**Scenario:** an integration job must set `MODE=integration` by writing to `$GITHUB_ENV`, then a *later* step must print `"$MODE"` and append `Integration mode: $MODE` to `$GITHUB_STEP_SUMMARY`. In the Markdown plan write `[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)` and name this repository's displayed matrix check, `Test Node 20 on ubuntu-latest`, as the required check to configure. **Pass:** explain why the writing step cannot read its new environment value, while the later step can; mark the badge and branch-protection change as hosted-only. [Primary reference: workflow commands](https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions)

## 4. Cache/artifact choice, retention, and REST endpoint plan

**Write:** `.practice/extra-storage/decision.md` and `.practice/extra-storage/api-plan.sh.txt`.

**Scenario:** dependencies should be reused, while a test report must be retained for 14 days. Choose a cache for dependencies and an artifact for the report; write the artifact upload `retention-days: 14`. In the shell-plan file (comments only; do not run it), record `GET /repos/OWNER/REPO/actions/artifacts`, `GET /repos/OWNER/REPO/actions/caches`, and the organization retention configuration endpoint `PUT /orgs/OWNER/actions/permissions/artifact-and-log-retention` with a `retention.json` payload. **Pass:** distinguish acceleration from retained evidence and label every request as a plan, including the configuration mutation. [Primary reference: artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts) and [Actions REST endpoints](https://docs.github.com/rest/actions)

## 5. Variables and secrets by scope

**Write:** `.practice/extra-scopes/scope-plan.md`.

**Scenario:** document where to store a non-sensitive `LOG_LEVEL` for every repository in an organization, a repository-specific `API_BASE_URL`, and a production-only `DEPLOY_TOKEN`. Include the matching organization, repository, and environment REST collection paths. **Pass:** justify each scope, state that a secret value cannot be read back through the API, and keep actual values out of the file. [Primary reference: variables REST API](https://docs.github.com/rest/actions/variables) and [secrets REST API](https://docs.github.com/rest/actions/secrets)

## 6. Action distribution and versioning

**Write:** `.practice/extra-action-release/plan.md`.

**Scenario:** a composite action first serves internal repositories, then may be published for Marketplace discovery. Record its `action.yml` metadata requirement, a `v1.2.0` release tag and movable `v1` major tag for convenience, and the consumer policy to pin the reviewed release commit SHA where required. **Pass:** distinguish GitHub Marketplace publication from private/internal sharing, and distinguish a producer's convenience tag from a consumer's immutable pin. [Primary reference: immutable releases and tags](https://docs.github.com/actions/how-tos/create-and-publish-actions/using-immutable-releases-and-tags-to-manage-your-actions-releases)

## 7. Internal templates, action policy, and self-hosted runner controls

**Write:** `.practice/extra-enterprise/access-plan.md`.

**Scenario:** finance repositories may use a `prod-linux` self-hosted runner group; contractor repositories may use approved hosted CI but must never route to that group. The enterprise permits GitHub-owned actions and the organization `octo-platform/*` only. In `access-plan.md`, write four headings: **template access**, **action/reusable-workflow policy**, **runner routing**, and **network/image ownership**. Under runner routing, show the intended job selector:

```yaml
runs-on: [self-hosted, linux, prod]
```

Then state that the `prod-linux` runner group is granted only to finance repositories. Under policy, say that the selected-actions policy blocks an unapproved `uses:` reference even if a runner is available; under routing, say that an approved action does not grant a contractor repository access to `prod-linux`. Name the network/IP allow-list owner and the team responsible for patching and versioning the runner image/toolcache.

**Expected result:** a reviewer can point to two independent decisions: (1) whether an action or reusable workflow source is allowed, and (2) whether a repository can receive production compute. The labels only select an eligible runner *inside* the permitted runner group; they do not create access. **Pass:** include all four headings, the selector, the selected-actions rule, and the finance-only group rule. This is a local/manual policy review: do not change enterprise settings or register a runner. [Primary reference: enterprise Actions administration](https://docs.github.com/en/enterprise-cloud@latest/admin/managing-github-actions-for-your-enterprise/getting-started-with-github-actions-for-your-enterprise/getting-started-with-github-actions-for-github-enterprise-cloud) and [runner access](https://docs.github.com/actions/how-tos/manage-runners/self-hosted-runners/manage-access)

## 8. Digest verification versus attestation

**Write:** `.practice/extra-attestation/verification-notes.md`.

**Scenario:** run `node examples/11-cache-artifacts-attestations/make-artifact.mjs` followed by `node examples/11-cache-artifacts-attestations/verify-artifact.mjs`, then record the subject digest, expected repository/identity constraints, and the failure you would expect after changing the artifact. **Pass:** state that this is a local digest model, not a GitHub-signed attestation, and that a verifier must check both identity expectations and digest. [Primary reference: artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations)

## 9. Editor validation, schema completion, and metadata help

**Write:** `.practice/extra-editor/workflow.yml` and `.practice/extra-editor/.vscode/settings.json`. The file is outside `.github/workflows`, so GitHub cannot discover or run it.

**Setup:** install or enable the [GitHub Actions VS Code extension](https://github.com/github/vscode-github-actions) and the [Red Hat YAML extension](https://github.com/redhat-developer/vscode-yaml). Open `.practice/extra-editor` as the VS Code folder, then put this explicit association in its `.vscode/settings.json` so the inactive YAML gets the workflow schema:

```json
{
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": "workflow.yml"
  }
}
```

**Scenario:** start with this sketch and observe the schema diagnostic on `run-on`:

```yaml
name: editor-check
on: workflow_dispatch
jobs:
  check:
    run-on: ubuntu-latest
    steps:
      - run: echo hello
```

Then replace `run-on` with `runs-on: ubuntu-latest`, use completion to inspect `workflow_dispatch` input keys, and save. Do not move the sketch into `.github/workflows` or run it.

**Pass:** show the diagnostic before the correction, then show no schema error for the corrected key; explain that completion and metadata help support authoring but do not prove a hosted workflow will run. The GH-200 study guide names VS Code Actions tooling, schema completion, metadata IntelliSense, and validation as authoring skills. [Primary reference: GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200)

## 10. Matrix coverage, failure behavior, runner images, and selective rerun

**Write:** `.practice/extra-matrix/optimization.yml.txt` and `.practice/extra-matrix/decision.md`. Keep the workflow sketch inactive.

**Scenario:** begin with `os: [ubuntu-latest, windows-latest]` and `node: [20, 22, 24]`, which creates six jobs. Your coverage policy is Linux on all three Node versions and Windows only on Node 22. Add `exclude` entries for the two unsupported Windows combinations, then use `include` to label the Windows/22 job `smoke: true`. Set `fail-fast: false` so the Linux jobs still finish if Windows/22 fails, and set `max-parallel: 2`. Treat each `*-latest` image as a moving label: record the release-notes check you would make before relying on a compiler/tool version.

```yaml
strategy:
  fail-fast: false
  max-parallel: 2
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [20, 22, 24]
    exclude:
      - os: windows-latest
        node: 20
      - os: windows-latest
        node: 24
    include:
      - os: windows-latest
        node: 22
        smoke: true
```

**Expected result:** list the four remaining jobs: Ubuntu/20, Ubuntu/22, Ubuntu/24, and Windows/22 (`smoke: true`). In `decision.md`, model five minutes per job: the six-job matrix is 30 runner-minutes and the four-job matrix is 20 runner-minutes. State separately that `max-parallel: 2` caps peak concurrency but, by itself, does not guarantee less billed work or lower cost; real duration, runner type, platform billing, cache behavior, and failures still matter. For a supplied run history where only Windows/22 fails because of a transient external outage and there is **no** code or YAML change, state that the smallest hosted follow-up is **rerun the failed Windows/22 matrix job**, not all jobs. If the repair changes code or YAML, commit it and use a new run at the latest SHA instead. These actions are hosted-only; write them as a manual review step and do not create a workflow run.

**Pass:** identify exactly two excluded rows, exactly four remaining jobs, the Windows/22 include property, `fail-fast: false`, and the 30-to-20 runner-minute model. Mark the model as a planning estimate rather than observed billing and distinguish local YAML review from hosted image availability and rerun behavior. [Primary reference: matrix strategy](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs) and [runner-image releases](https://github.com/actions/runner-images/releases)
