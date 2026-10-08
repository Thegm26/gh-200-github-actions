# Course: one small lab at a time

Run `npm run learn -- list` before each session. Complete a lab in order unless you are revisiting a documented missed topic. Local means the checker can assess files in `.practice`; GitHub means you should first satisfy the local structure and then use the optional sandbox or an authorized repository for the hosted behavior.

| Labs | Focus | Domain | Execution |
| --- | --- | --- | --- |
| 01–04 | manual trigger, job/runner, filters, safe context data | Author/manage | local |
| 05–08 | job data, matrix, Linux service container | Author/manage | local |
| 09, 11 | reusable call and failure evidence | Consume/troubleshoot | GitHub / local |
| 10 | composite action metadata | Author actions | local |
| 12–13 | runner policy and least privilege | Enterprise | GitHub |
| 14–17 | OIDC/environment, SHA pin, artifact, dependency gate | Secure/optimize | GitHub |

For every lab: start → read task → run a red check → make one scoped edit → run green check → explain why it works → inspect the solution only if useful. A local green result proves only the stated invariant; use the lab rubric and official link for behavior a file parser cannot prove.

## Lab-by-lab guide

Each command starts a separate workspace and the `file` named below is the only learner-owned file. First run its check red. A green check proves the stated invariant only; complete the manual explanation before moving on.

| ID and edit | Small task and non-solution hint | Check and manual criterion |
| --- | --- | --- |
| 01 `workflow.yml` | Add `workflow_dispatch` as a mapping. A manual trigger belongs under `on`. | `check 01-first-workflow`; explain why this does not run on push. |
| 02 `workflow.yml` | Give `build` `runs-on: ubuntu-latest`. A job needs one runner. | `check 02-job-and-runner`; explain job versus step. |
| 03 `workflow.yml` | Filter `push` to `main` and `src/**`. Filters combine; they do not make two independent triggers. | `check 03-push-filter`; predict a docs-only push. |
| 04 `workflow.yml` | Put event text in `EVENT_TEXT` and quote `"$EVENT_TEXT"` in shell. | `check 04-context-as-data`; explain why direct event interpolation is risky. |
| 05 `workflow.yml` | Map a step's version output through `prepare.outputs`. | `check 05-job-output`; distinguish step output from job output. |
| 06 `workflow.yml` | Make `report` depend on `prepare` and read `needs.prepare.outputs.version`. | `check 06-needs-output`; explain why `GITHUB_ENV` cannot cross jobs. |
| 07 `workflow.yml` | Add Node 20 and 22 matrix values. | `check 07-matrix`; name one `include` use and distinguish fail-fast from max-parallel. |
| 08 `workflow.yml` | Add Redis with a health command to an Ubuntu job. | `check 08-service-linux`; explain VM `localhost` versus container service-label access. |
| 09 `workflow.yml` | Make `risk` call the approved reusable workflow path instead of declaring a runner. | `check 09-reusable-call`; confirm the real call only in an authorized GitHub repository. |
| 10 `action.yml` | Set composite `runs.using` and a Bash echo step. | `check 10-composite-action`; explain composite versus JavaScript/Docker actions. |
| 11 `workflow.yml` | Add an `always()` evidence step writing `GITHUB_STEP_SUMMARY`. | `check 11-failure-evidence`; use sandbox logs to prove failure behavior if authorized. |
| 12 `workflow.yml` | Use exactly `self-hosted` and `approved` labels. | `check 12-runner-policy`; explain why labels are not an action policy or firewall. |
| 13 `workflow.yml` | Set only `contents: read` at the top level. | `check 13-least-privilege`; explain token permission versus PAT and environment approval. |
| 14 `workflow.yml` | Put `id-token: write`, `contents: read`, and `environment: production` only on `deploy`. | `check 14-oidc-job`; explain OIDC federation needs cloud trust configuration. |
| 15 `workflow.yml` | Copy the full approved checkout SHA shown in the starter's task comment; never invent one. | `check 15-sha-pin`; explain policy-required full SHA versus immutable release-tag strategy. |
| 16 `workflow.yml` | Upload `dist` as `build-output`. | `check 16-upload-artifact`; contrast an artifact with a cache and verify a hosted upload only when authorized. |
| 17 `workflow.yml` | Gate `deploy` on `build` and retain read-only permissions. | `check 17-capstone-gate`; identify what an environment approval can additionally enforce. |

Use the exact form `npm run learn -- check <ID>` from the table (for example, `npm run learn -- check 07-matrix`). Solutions live at `learning/solutions/<ID>/` and are comparison material, never a required copy destination.

Primary references by section: [workflow syntax and events](https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions), [contexts and expressions](https://docs.github.com/actions/learn-github-actions/contexts), [job outputs](https://docs.github.com/actions/using-jobs/defining-outputs-for-jobs), [matrix](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs), [service containers](https://docs.github.com/actions/using-containerized-services/about-service-containers), [reusable workflows](https://docs.github.com/actions/sharing-automations/reusing-workflows), [action metadata](https://docs.github.com/actions/reference/workflows-and-actions/metadata-syntax), [self-hosted runners](https://docs.github.com/actions/how-tos/manage-runners/self-hosted-runners/manage-access), [token permissions](https://docs.github.com/actions/security-for-github-actions/security-guides/automatic-token-authentication), [OIDC](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers), and [artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts).

## Missed-topic loop

Use `npm run quiz -- --domain <tag> --count 8 --seed practice`. For each miss, name the linked lab from `npm run learn -- list`, reset it, solve it without a solution, and write a one-sentence explanation of why the tempting alternative is wrong. Recheck with `npm run learn -- status`. This is practice evidence, not a prediction of an exam score.

## Reference exercises

The numbered [examples](../examples) deepen a concept after its canonical lab. The [domain indexes](../labs) offer an alternate entry point. They are supplementary and their legacy scripts are intentionally limited; canonical learner correctness comes from `npm run learn -- check <id>` plus the manual rubric.
