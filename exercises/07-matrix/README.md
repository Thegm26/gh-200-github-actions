# 07 — Test a matrix

A matrix makes one job for every listed value. It is a compact way to check the same project against supported versions without copying a job.

## Do

The project supports Node 20 and 22. In [workflow.yml](workflow.yml), add `22` to the `strategy.matrix.node` list; keep `20` too.

```sh
node exercises/07-matrix/check.mjs
```

It fails while one supported version is missing and passes when both values are in the list. Hint: add `22` at the same indentation as `20`. [Matrix strategy](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs) explains expanded jobs.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/07-matrix/workflow.yml).</details>

Next: [08 — Service](../08-service-linux/README.md).
