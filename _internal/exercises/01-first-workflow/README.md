# 01 — Your first workflow

A workflow is a YAML file GitHub reads as an automation recipe. `name` is its label, `on` says **when** it may run, and `jobs` holds the work. This small shape is worth learning before adding any complexity:

```yaml
name: greeting

on:
  workflow_dispatch: {}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo ready
```

`build` is one job, `runs-on` selects its runner, and each item under `steps` is an action the runner performs. `workflow_dispatch` creates the **Run workflow** button: useful when a release check should run only when a person asks for it.

## Do

Imagine you maintain a release smoke test. It must never run by accident; a maintainer should start it from the Actions page. In [workflow.yml](workflow.yml), replace the disabled `on: false` with a two-space-indented `workflow_dispatch` mapping. Keep the existing `build` job.

From the repository root, run:

```sh
node _internal/exercises/01-first-workflow/check.mjs
```

It fails now because there is no manual trigger. It passes when the trigger is a mapping (not just `true`).

Hint: `on` is top-level; events are nested beneath it. [GitHub’s event documentation](https://docs.github.com/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow) shows the syntax.

<details>
<summary>Solution</summary>

Compare your file with the immutable [solution](../../learning/solutions/01-first-workflow/workflow.yml) only after trying it.
</details>

Next: [02 — Job and runner](../02-job-and-runner/README.md).
Hosted fork-to-fix: [01 lab](../../../hands-on/01-first-workflow/README.md).
