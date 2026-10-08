# 06 — Consume an earlier job’s result

Jobs run independently unless `needs` connects them. Once connected, the dependent job can read an exposed output through `needs.<job>.outputs.<name>`.

## Do

The release report must wait for `prepare` and print its version. In [workflow.yml](workflow.yml), set `report.needs` to `prepare`, then change its command so it contains `needs.prepare.outputs.version`. The output bridge in `prepare` is already correct.

```sh
node _internal/exercises/06-needs-output/check.mjs
```

It fails until both the dependency and reference exist and passes when `report` can read `prepare`'s output. Hint: `needs` is a job field, while the output reference is in the report step. [Job dependencies and outputs](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/passing-information-between-jobs) covers both pieces.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/06-needs-output/workflow.yml).</details>

Next: [07 — Matrix](../07-matrix/README.md).
Hosted fork-to-fix: [06 lab](../../../hands-on/06-needs-output/README.md).
