# Course: one small lab at a time

Start at [exercise 01](../exercises/01-first-workflow/README.md) and follow each exercise's Next link. Every folder gives one explanation, one YAML file to edit, one direct Node check, a hint, and a separate solution link. Local checks inspect only that folder; GitHub-specific behavior still needs the optional sandbox or an authorized repository.

| Labs | Focus | Domain | Execution |
| --- | --- | --- | --- |
| 01–04 | manual trigger, job/runner, filters, safe context data | Author/manage | local |
| 05–08 | job data, matrix, Linux service container | Author/manage | local |
| 09, 11 | reusable call and failure evidence | Consume/troubleshoot | GitHub / local |
| 10 | composite action metadata | Author actions | local |
| 12–13 | runner policy and least privilege | Enterprise | GitHub |
| 14–17 | OIDC/environment, SHA pin, artifact, dependency gate | Secure/optimize | GitHub |

For every exercise: read → run a red check → make one scoped edit → run green check → explain why it works → inspect the solution only if useful. A local green result proves only the stated invariant; use the official link for behavior a file parser cannot prove.

## Lab-by-lab guide

The file named below is the only file to edit. Open its exercise README first, run its check red, then make the smallest change. A green check proves the stated invariant only; complete the manual explanation before moving on.

| ID and edit | Small task and non-solution hint | Check and manual criterion |
| --- | --- | --- |
| 01 `workflow.yml` | Add `workflow_dispatch` as a mapping. A manual trigger belongs under `on`. | `node _internal/exercises/01-first-workflow/check.mjs`; explain why this does not run on push. |
| 02 `workflow.yml` | Give `build` `runs-on: ubuntu-latest`. A job needs one runner. | `node _internal/exercises/02-job-and-runner/check.mjs`; explain job versus step. |
| 03 `workflow.yml` | Filter `push` to `main` and `_internal/src/**`. Filters combine; they do not make two independent triggers. | `node _internal/exercises/03-push-filter/check.mjs`; predict a docs-only push. |
| 04 `workflow.yml` | Put event text in `EVENT_TEXT` and quote `"$EVENT_TEXT"` in shell. | `node _internal/exercises/04-context-as-data/check.mjs`; explain why direct event interpolation is risky. |
| 05 `workflow.yml` | Map a step's version output through `prepare.outputs`. | `node _internal/exercises/05-job-output/check.mjs`; distinguish step output from job output. |
| 06 `workflow.yml` | Make `report` depend on `prepare` and read `needs.prepare.outputs.version`. | `node _internal/exercises/06-needs-output/check.mjs`; explain why `GITHUB_ENV` cannot cross jobs. |
| 07 `workflow.yml` | Add Node 20 and 22 matrix values. | `node _internal/exercises/07-matrix/check.mjs`; name one `include` use and distinguish fail-fast from max-parallel. |
| 08 `workflow.yml` | Add Redis with a health command to an Ubuntu job. | `node _internal/exercises/08-service-linux/check.mjs`; explain VM `localhost` versus container service-label access. |
| 09 `workflow.yml` | Make `risk` call the approved reusable workflow path instead of declaring a runner. | `node _internal/exercises/09-reusable-call/check.mjs`; confirm the real call only in an authorized GitHub repository. |
| 10 `action.yml` | Set composite `runs.using` and a Bash echo step. | `node _internal/exercises/10-composite-action/check.mjs`; explain composite versus JavaScript/Docker actions. |
| 11 `workflow.yml` | Add an `always()` evidence step writing `GITHUB_STEP_SUMMARY`. | `node _internal/exercises/11-failure-evidence/check.mjs`; use sandbox logs to prove failure behavior if authorized. |
| 12 `workflow.yml` | Use exactly `self-hosted` and `approved` labels. | `node _internal/exercises/12-runner-policy/check.mjs`; explain why labels are not an action policy or firewall. |
| 13 `workflow.yml` | Set only `contents: read` at the top level. | `node _internal/exercises/13-least-privilege/check.mjs`; explain token permission versus PAT and environment approval. |
| 14 `workflow.yml` | Put `id-token: write`, `contents: read`, and `environment: production` only on `deploy`. | `node _internal/exercises/14-oidc-job/check.mjs`; explain OIDC federation needs cloud trust configuration. |
| 15 `workflow.yml` | Copy the full approved checkout SHA shown in the starter's task comment; never invent one. | `node _internal/exercises/15-sha-pin/check.mjs`; explain policy-required full SHA versus immutable release-tag strategy. |
| 16 `workflow.yml` | Upload `dist` as `build-output`. | `node _internal/exercises/16-upload-artifact/check.mjs`; contrast an artifact with a cache and verify a hosted upload only when authorized. |
| 17 `workflow.yml` | Gate `deploy` on `build` and retain read-only permissions. | `node _internal/exercises/17-capstone-gate/check.mjs`; identify what an environment approval can additionally enforce. |

Use the exact Node command in each exercise README (for example, `node _internal/exercises/07-matrix/check.mjs`). Solutions live at `_internal/learning/solutions/<ID>/` and are comparison material, never a required copy destination.

Primary references by section: [workflow syntax and events](https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions), [contexts and expressions](https://docs.github.com/actions/learn-github-actions/contexts), [job outputs](https://docs.github.com/actions/using-jobs/defining-outputs-for-jobs), [matrix](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs), [service containers](https://docs.github.com/actions/using-containerized-services/about-service-containers), [reusable workflows](https://docs.github.com/actions/sharing-automations/reusing-workflows), [action metadata](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax), [self-hosted runners](https://docs.github.com/actions/how-tos/manage-runners/self-hosted-runners/manage-access), [token permissions](https://docs.github.com/actions/security-for-github-actions/security-guides/automatic-token-authentication), [OIDC](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers), and [artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts).

## Missed-topic loop

Use `npm run quiz -- --domain <tag> --count 8 --seed practice`. For each miss, reopen the linked exercise, solve it without a solution, and write a one-sentence explanation of why the tempting alternative is wrong. This is practice evidence, not a prediction of an exam score.

## Reference exercises

The numbered [examples](../examples) deepen a concept after its canonical exercise. The [domain indexes](../labs) offer an alternate entry point. They are supplementary and their legacy scripts are intentionally limited; canonical learner correctness comes from each exercise's direct Node check plus the manual rubric.
