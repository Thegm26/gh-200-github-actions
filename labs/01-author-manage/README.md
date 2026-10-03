# Lab 01 — author and manage workflows (45 min)

Source: [GH-200 workflow objectives](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) · [workflow syntax](https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions).

**Goal:** copy `starter/broken-release.workflow.yaml.txt` to a scratch workflow in your own test repository, repair it, and compare against `solution/release.yml`. The `.txt` extension and `labs/` location mean it is inactive here.

1. (8m) Add `workflow_dispatch` boolean `deploy` (required) and string `region` defaulting to `test`; explain why `inputs.deploy` retains Boolean semantics.
2. (8m) Make `prepare` publish a version through `GITHUB_OUTPUT`, expose it as a job output, and consume it with `needs.prepare.outputs.version`.
3. (10m) Repair the Node/OS matrix: omit Windows/Node 20, let siblings complete, and cap to two parallel jobs. State each resulting combination.
4. (9m) Add a PostgreSQL service with health check and a mapped port; use an environment file for later-step configuration and a job summary.
5. (10m) Anchor common step defaults, add a cache and an artifact. State why a cache is not the release output.

Verification: YAML schema accepts the copied workflow; manual-dispatch UI shows correct types/default; matrix job names match expected combinations; service becomes healthy; summary, artifact, and cache behavior are distinguishable. Do not add this deliberate starter under `.github/workflows`.

Hard scenarios:

- A release job needs a build string from a different job. Why is `echo X >> $GITHUB_ENV` insufficient, and which output chain is required?
- A matrix failure must not cancel a slow diagnostic sibling. Which strategy flag changes that, and what separate cap controls cost?
- A job running directly on a VM needs a mapped service port. Which host should the step target, and what prerequisite prevents a race?
