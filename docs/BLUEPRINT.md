# GH-200 blueprint → practice evidence

Authority: [Microsoft GH-200 study guide, skills measured January 2026](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200). GitHub Docs, linked from each lab, are the authority for product behavior. “Automatic” means a local checker can inspect the learner workspace; “manual” requires explanation/review; “hosted-only” requires an authorized GitHub account or enterprise configuration.

| Official objective cluster | Concrete practice | Evidence and check | Limit |
| --- | --- | --- | --- |
| Events: schedule, webhook/repository dispatch, manual dispatch | 01 manual trigger and [supplementary drill 1](EXTRA_EXERCISES.md#1-events-weekday-schedule-dispatch-webhook-boolean-input) | Typed `workflow_dispatch`; a concrete weekday cron and dispatch type | automatic/manual; cron/webhook delivery hosted-only |
| `workflow_call` inputs, secrets and reuse | 09 reusable call and [supplementary drill 2](EXTRA_EXERCISES.md#2-reusable-workflow-input-and-secret-mapping) | caller/callee declaration and explicit secret mapping | hosted-only call; structure automatic |
| Jobs, dependencies, conditions, commands and environment files | 02 job/runner; 04 context data; 05–06 outputs; 17 gate | `needs`, outputs, quoted environment bridge | automatic + manual |
| Contexts, expressions, editor support | 04 context as data and [supplementary drill 9](EXTRA_EXERCISES.md#9-editor-validation-schema-completion-and-metadata-help) | no direct untrusted shell interpolation; explain context scope; use editor diagnostics, schema completion, and metadata help | automatic + manual/editor hosted-only |
| YAML anchors and aliases | Example 01 and 04 troubleshooting fragment | expand an anchor manually | manual; GitHub supports anchors/aliases—parsed YAML merge keys are not a claim of hosted workflow support |
| Matrix include/exclude, max parallel, fail-fast, images | 07 matrix and [supplementary drill 10](EXTRA_EXERCISES.md#10-matrix-coverage-failure-behavior-runner-images-and-selective-rerun) | four-row matrix, include property, fail-fast/concurrency explanation, image-release review, and smallest rerun decision | local/manual; hosted image availability and rerun hosted-only |
| Service containers | 08 Linux service | Linux runner/service/health invariant | automatic; live networking hosted-only |
| Outputs, summaries, badges, protection | 05–06 outputs and [supplementary drill 3](EXTRA_EXERCISES.md#3-environment-file-later-step-summary-badge-and-required-check-plan) | step/job output chain; later-step environment use, summary, and hosted protection plan | automatic/manual; badge/protection hosted-only |
| Cache, artifact, retention, REST | 16 artifact and [supplementary drill 4](EXTRA_EXERCISES.md#4-cacheartifact-choice-retention-and-rest-endpoint-plan) | choose artifact versus cache; retention/API plan | automatic/manual; REST mutation hosted-only |
| Logs, artifacts, UI/API, selective matrix rerun | 11 failure evidence; Example 04 | identify log/artifact/API and smallest rerun | automatic/manual; UI/rerun hosted-only |
| Templates, private access, starter/reusable/composite, disable/delete | 09 and Examples 04/06 | classify each reuse mechanism and lifecycle action | manual/hosted-only |
| Composite, JavaScript, Docker action types and metadata | 10 composite; Example 05 | metadata fields, outputs, runtime choices | automatic/manual; Docker distribution hosted-only |
| Action commands, distribution, Marketplace, release/version/immutable refs | 10 and 15 SHA pin; [supplementary drill 6](EXTRA_EXERCISES.md#6-action-distribution-and-versioning) | environment-file output and immutable reference decision | automatic/manual; Marketplace/release hosted-only |
| Enterprise policy, runner groups, IP/networking, toolcache, scopes, REST | 12 runner policy; 13 permissions; [supplementary drills 5 and 7](EXTRA_EXERCISES.md#7-internal-templates-action-policy-and-self-hosted-runner-controls) | separate action allow policy from runner routing; scope and network/image ownership decision | local/manual; enterprise configuration hosted-only |
| Approvals, trust, injection, token/PAT/OIDC, pinning | 04, 13–15; Example 10 | quoted untrusted data, least privilege, OIDC job, full SHA | automatic/manual; approval/OIDC federation hosted-only |
| Attestations, cost and scaling | Example 11, [supplementary drill 8](EXTRA_EXERCISES.md#8-digest-verification-versus-attestation), and [supplementary drill 10](EXTRA_EXERCISES.md#10-matrix-coverage-failure-behavior-runner-images-and-selective-rerun) | generation versus verification; prune a matrix from six to four jobs, model 30 to 20 runner-minutes, and distinguish that from `max-parallel` concurrency (not a billing guarantee) | local/manual; attestation, cost data, and rerun hosted-only |

Every canonical lab has a small starter, solution, task-specific checker, and a manual rubric. Supplementary examples cover broader scenarios without pretending a regex or YAML parser can prove a real hosted run. Use [COURSE.md](COURSE.md) for order and [START_HERE.md](START_HERE.md) for the safe sandbox.

## Complete January 2026 objective checklist

This is the bullet-level audit used by the question bank. `Local` means an original question or local exercise can check understanding; `Manual` means read/plan/review; `Hosted` means the real GitHub, enterprise, cloud, Marketplace, or API permission is required. Question IDs are deliberately original practice, not recalled exam items.

### Author and manage workflows

| Official skill | Practice evidence | Mode |
| --- | --- | --- |
| Scheduled, manual, webhook, repository events | AM01, AM16, drill 1 | Local + Hosted |
| Scope, permissions, events | AM14, exercise 13 | Local + Manual |
| Dispatch types/defaults/required; `workflow_call` inputs/secrets | AM01, AM02, AM17, drill 2 | Local + Hosted |
| Jobs, steps, conditions | AM13, AM18, exercises 02, 17 | Local |
| Job dependencies | AM03, AM18, exercises 05–06 | Local |
| Commands and environment variables | AM09–10, drill 3 | Local |
| Service ports, health checks, options | AM04, exercise 08 | Local + Hosted |
| Matrix, include/exclude, fail-fast, parallelism, cost, image transitions | AM05–06, AM12, AM21, exercise 07 | Local + Manual |
| YAML anchors, aliases, merge analysis | AM07, CT07, examples 01/04 | Manual |
| Contexts and immutable/action pinning | AM08, AA06, SO04, exercise 15 | Local + Manual |
| Expressions, evaluation boundary, secret leakage | AM13, AM18–19, SO03 | Local + Manual |
| VS Code extension/schema/metadata validation | AM20 | Manual |
| Cache/artifacts and retention REST scopes | AM11, AM15, AM22, SO08, drill 4 | Local + Hosted |
| Artifacts, outputs, environment files, reusable outputs | AM03, AM09, AM23, exercises 05–06/09 | Local |
| Job summaries | AM10, drill 3 | Local |
| Status badges and environments | AM24, SO05, drill 3 | Manual + Hosted |

### Consume and troubleshoot workflows

| Official skill | Practice evidence | Mode |
| --- | --- | --- |
| Interpret triggers/effects from configuration and logs | CT02, CT08, CT11–12 | Local + Hosted |
| Diagnose failures using logs and run history | CT02, CT12, exercise 11 | Local + Hosted |
| Expand anchors/aliases/merged mappings | CT07, AM07 | Manual |
| Matrix expansion, job names, failures, selective rerun | CT01, AM05–06 | Manual + Hosted |
| Locate workflows, logs, artifacts in UI/API | CT02–03, CT12–13 | Manual + Hosted |
| Download/manage artifacts | CT03, CT10, CT13 | Local + Hosted |
| Consume organization/reusable workflows | CT05, EN12, exercise 09 | Local + Hosted |
| Consume non-public templates | CT09, CT15 | Manual + Hosted |
| Starter templates and customization | CT04, CT14–15 | Manual + Hosted |
| Starter vs reusable vs composite | CT04–05, exercise 09, example 06 | Local + Manual |
| Disable versus delete | CT06, CT16 | Manual + Hosted |

### Author and maintain actions

| Official skill | Practice evidence | Mode |
| --- | --- | --- |
| JavaScript, Docker, composite; immutable-action implications | AA01–02, AA05–06, AA15, exercise 10 | Local + Manual |
| Troubleshoot action execution/errors | AA09, AA12 | Local |
| Required files, layout, metadata | AA03–04, AA12, exercise 10 | Local |
| Workflow commands in actions | AA10, exercise 10 | Local |
| Public/private/Marketplace distribution | AA07, AA13–14, drill 6 | Manual + Hosted |
| Publish to Marketplace | AA08, AA14, drill 6 | Manual + Hosted |
| Version and release strategy | AA08, AA11, AA14–15 | Manual |

### Manage GitHub Actions for the enterprise

| Official skill | Practice evidence | Mode |
| --- | --- | --- |
| Reusable components/templates | CT04–05, EN12 | Manual + Hosted |
| Enterprise access to actions/workflows | CT09, CT15, EN14 | Manual + Hosted |
| Organization usage policies | EN02–03, SO12 | Manual + Hosted |
| Hosted/self-hosted configuration and monitoring | EN05–06, EN15, drill 7 | Manual + Hosted |
| IP allow lists/networking | EN04, EN17 | Manual + Hosted |
| Runner groups/troubleshooting | EN01, EN05, EN14, EN16 | Manual + Hosted |
| Preinstalled software, toolcache, runtime install/image maintenance | EN06, EN15, drill 7 | Manual + Hosted |
| Org/repo/environment secret and variable scope | EN07–09, EN19, drill 5 | Local + Hosted |
| Secrets/variables usage and REST management | EN10–11, EN13, EN18, drill 4–5 | Manual + Hosted |

### Secure and optimize automation

| Official skill | Practice evidence | Mode |
| --- | --- | --- |
| Environment protections and approvals | SO05, AM24 | Manual + Hosted |
| Trustworthy Marketplace actions | AA06, SO04, SO12 | Manual |
| Script injection protections | SO03, SO10, exercise 04 | Local + Manual |
| `GITHUB_TOKEN`, granular permissions, PAT | SO01, SO09, AM14 | Local + Manual |
| OIDC federation | SO02, exercise 14 | Manual + Hosted |
| Full-SHA pins and immutable policy | AA06, AA11, AA15, SO04 | Local + Manual |
| Allow/deny usage policy and workflow review | EN02, SO12 | Manual + Hosted |
| Attestation/provenance generation and verification | SO06–07, SO11, drill 8 | Local + Hosted |
| Caching and artifact retention efficiency | AM11, AM22, SO08, drill 4 | Local + Manual |
| Scaling and cost optimization | AM05, AM21, SO08, [supplementary drill 10](EXTRA_EXERCISES.md#10-matrix-coverage-failure-behavior-runner-images-and-selective-rerun) | Local + Manual + Hosted |
