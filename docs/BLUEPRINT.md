# GH-200 blueprint → practice evidence

Authority: [Microsoft GH-200 study guide, skills measured January 2026](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200). GitHub Docs, linked from each lab, are the authority for product behavior. “Automatic” means a local checker can inspect the learner workspace; “manual” requires explanation/review; “hosted-only” requires an authorized GitHub account or enterprise configuration.

| Official objective cluster | Concrete practice | Evidence and check | Limit |
| --- | --- | --- | --- |
| Events: schedule, webhook/repository dispatch, manual dispatch | 01 manual trigger and [supplementary drill 1](EXTRA_EXERCISES.md#1-events-weekday-schedule-dispatch-webhook-boolean-input) | Typed `workflow_dispatch`; a concrete weekday cron and dispatch type | automatic/manual; cron/webhook delivery hosted-only |
| `workflow_call` inputs, secrets and reuse | 09 reusable call and [supplementary drill 2](EXTRA_EXERCISES.md#2-reusable-workflow-input-and-secret-mapping) | caller/callee declaration and explicit secret mapping | hosted-only call; structure automatic |
| Jobs, dependencies, conditions, commands and environment files | 02 job/runner; 04 context data; 05–06 outputs; 17 gate | `needs`, outputs, quoted environment bridge | automatic + manual |
| Contexts, expressions, editor support | 04 context as data | no direct untrusted shell interpolation; explain context scope | automatic + manual/editor hosted-only |
| YAML anchors and aliases | Example 01 and 04 troubleshooting fragment | expand an anchor manually | manual; GitHub supports anchors/aliases—parsed YAML merge keys are not a claim of hosted workflow support |
| Matrix include/exclude, max parallel, fail-fast, images | 07 matrix and Example 02 | matrix shape and failure/concurrency explanation | automatic + manual; hosted image availability hosted-only |
| Service containers | 08 Linux service | Linux runner/service/health invariant | automatic; live networking hosted-only |
| Outputs, summaries, badges, protection | 05–06 outputs and [supplementary drill 3](EXTRA_EXERCISES.md#3-environment-file-later-step-summary-badge-and-required-check-plan) | step/job output chain; later-step environment use, summary, and hosted protection plan | automatic/manual; badge/protection hosted-only |
| Cache, artifact, retention, REST | 16 artifact and [supplementary drill 4](EXTRA_EXERCISES.md#4-cacheartifact-choice-retention-and-rest-endpoint-plan) | choose artifact versus cache; retention/API plan | automatic/manual; REST mutation hosted-only |
| Logs, artifacts, UI/API, selective matrix rerun | 11 failure evidence; Example 04 | identify log/artifact/API and smallest rerun | automatic/manual; UI/rerun hosted-only |
| Templates, private access, starter/reusable/composite, disable/delete | 09 and Examples 04/06 | classify each reuse mechanism and lifecycle action | manual/hosted-only |
| Composite, JavaScript, Docker action types and metadata | 10 composite; Example 05 | metadata fields, outputs, runtime choices | automatic/manual; Docker distribution hosted-only |
| Action commands, distribution, Marketplace, release/version/immutable refs | 10 and 15 SHA pin; [supplementary drill 6](EXTRA_EXERCISES.md#6-action-distribution-and-versioning) | environment-file output and immutable reference decision | automatic/manual; Marketplace/release hosted-only |
| Enterprise policy, runner groups, IP/networking, toolcache, scopes, REST | 12 runner policy; 13 permissions; [supplementary drills 5 and 7](EXTRA_EXERCISES.md#5-variables-and-secrets-by-scope) | separate runner routing from action policy; scope decision | manual/hosted-only |
| Approvals, trust, injection, token/PAT/OIDC, pinning | 04, 13–15; Example 10 | quoted untrusted data, least privilege, OIDC job, full SHA | automatic/manual; approval/OIDC federation hosted-only |
| Attestations, cost and scaling | Example 11 and [supplementary drill 8](EXTRA_EXERCISES.md#8-digest-verification-versus-attestation) | generation versus verification; cache/parallelism tradeoff | manual; attestation/cost data hosted-only |

Every canonical lab has a small starter, solution, task-specific checker, and a manual rubric. Supplementary examples cover broader scenarios without pretending a regex or YAML parser can prove a real hosted run. Use [COURSE.md](COURSE.md) for order and [START_HERE.md](START_HERE.md) for the safe sandbox.
