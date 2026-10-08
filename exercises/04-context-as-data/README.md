# 04 — Treat context as data

An event field may contain text supplied by somebody outside your workflow. Do not paste such an expression directly into shell code. Put it in `env`, then quote the shell variable: YAML evaluates the expression once and the shell receives data, not source code.

## Do

An issue title is being inspected by a workflow. In [workflow.yml](workflow.yml), give the `inspect` step an `env` mapping with `EVENT_TEXT` set from `github.event`, then make its `run` command echo `"$EVENT_TEXT"`. Remove direct `github.event` interpolation from `run`.

```sh
node exercises/04-context-as-data/check.mjs
```

It fails while event text is interpolated in shell and passes when the quoted environment variable is used. Hint: expressions belong in `env`; shell code reads `"$EVENT_TEXT"`. [Contexts](https://docs.github.com/actions/learn-github-actions/contexts) explains where expressions are evaluated.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/04-context-as-data/workflow.yml).</details>

Next: [05 — Job output](../05-job-output/README.md).
