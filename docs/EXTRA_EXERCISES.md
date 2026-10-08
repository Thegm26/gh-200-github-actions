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

## 7. Internal templates and self-hosted runner controls

**Write:** `.practice/extra-enterprise/access-plan.md`.

**Scenario:** an internal workflow template must be visible to selected repositories and run a build on an approved self-hosted runner group. State template visibility/repository access, the runner group and labels, the IP/network allow-list owner, and how the image/toolcache/runtime is maintained and versioned. **Pass:** separate template access, allowed-actions policy, runner routing, and network control; name the team responsible for patching the runner image. [Primary reference: enterprise Actions administration](https://docs.github.com/en/enterprise-cloud@latest/admin/managing-github-actions-for-your-enterprise/getting-started-with-github-actions-for-your-enterprise/getting-started-with-github-actions-for-github-enterprise-cloud) and [runner access](https://docs.github.com/actions/how-tos/manage-runners/self-hosted-runners/manage-access)

## 8. Digest verification versus attestation

**Write:** `.practice/extra-attestation/verification-notes.md`.

**Scenario:** run `node examples/11-cache-artifacts-attestations/make-artifact.mjs` followed by `node examples/11-cache-artifacts-attestations/verify-artifact.mjs`, then record the subject digest, expected repository/identity constraints, and the failure you would expect after changing the artifact. **Pass:** state that this is a local digest model, not a GitHub-signed attestation, and that a verifier must check both identity expectations and digest. [Primary reference: artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations)
