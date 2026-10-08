# 02 — Give a job a runner

A job is work, but GitHub needs to know where that work runs. `runs-on` selects a hosted machine; its steps then execute on that machine. A build step without a runner is like a command with no computer to execute it.

## Do

Your team needs its small build check to run on GitHub’s Ubuntu image. In [workflow.yml](workflow.yml), add `runs-on: ubuntu-latest` to `jobs.build`, before `steps` and aligned with it.

```sh
node exercises/02-job-and-runner/check.mjs
```

It fails because `build` has no runner and passes only for `ubuntu-latest`. Hint: `runs-on` is aligned with `steps`, inside `build`. [Choose runners](https://docs.github.com/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job) for the wider runner model.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/02-job-and-runner/workflow.yml).</details>

Next: [03 — Push filter](../03-push-filter/README.md).
