# 02 — environment files, outputs, matrices, and services

## Exact target time

20 minutes (00:35–00:55).

## Objective and domain

Author and manage workflows: move scalar data across step/job boundaries, expand matrix combinations, control failure/concurrency, and connect to a healthy service container.

## Files to inspect or edit

- Edit inactive `starter.workflow.yml.txt`.
- Run `matrix-check.mjs` locally.
- Inspect `solution.workflow.yml.txt` and `solution.md` only after attempting.

## Tasks

1. Make `prepare` write `version=2.4.0` to `GITHUB_OUTPUT`, map it to a job output, and consume it through `needs`.
2. Write `MODE=integration` to `GITHUB_ENV` for a later step and Markdown to `GITHUB_STEP_SUMMARY`.
3. Build an OS × Node matrix, exclude Windows/22, include Ubuntu/24 with `experimental: true`, set `fail-fast: false`, and cap `max-parallel` at 2.
4. Add PostgreSQL with credentials, a health command, and a host port. State why VM-hosted steps use `localhost`, while container jobs use the service label.
5. Predict every expanded combination before running the checker.

## Expected observable result

The predicted combinations are Ubuntu/20, Ubuntu/22, Windows/20, and the included Ubuntu/24 experimental row. The version crosses jobs; `MODE` stays within one job; the summary is presentation only.

## Verification commands or checklist

```bash
node examples/02-outputs-matrix-services/matrix-check.mjs
node examples/01-triggers-contexts/check.mjs examples/02-outputs-matrix-services/starter.workflow.yml.txt
```

The second checker is intentionally reused and should still report missing trigger-specific features; explain why a generic syntax checker is not a semantic test.

## Answer or solution location

Use [`solution.workflow.yml.txt`](solution.workflow.yml.txt) and [`solution.md`](solution.md).

## Primary official links

- [Passing information between jobs](https://docs.github.com/actions/using-jobs/defining-outputs-for-jobs)
- [Workflow commands and environment files](https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions)
- [Matrix jobs](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Service containers](https://docs.github.com/actions/using-containerized-services/about-service-containers)

