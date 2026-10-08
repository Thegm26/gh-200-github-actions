# 05 — Publish a job output

A step output lives inside its job. To let a later job use it, the job must explicitly map that step value into `outputs`. This is the bridge between two separate runners.

## Do

`prepare` calculates version `1`; make it available to a future deployment. In [workflow.yml](workflow.yml), add `outputs.version` to `prepare` with the value `${{ steps.version.outputs.version }}`. Leave the existing step that writes `version=1` to `$GITHUB_OUTPUT`.

```sh
node exercises/05-job-output/check.mjs
```

It fails until the step-to-job bridge exists and passes when `outputs.version` names the step output. Hint: the `${{ steps.version.outputs.version }}` expression belongs under `prepare.outputs`. [Passing job outputs](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/passing-information-between-jobs) has the full pattern.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/05-job-output/workflow.yml).</details>

Next: [06 — Consume output](../06-needs-output/README.md).
