# 09 — Call a reusable workflow

A reusable workflow is called at the job level. Unlike an ordinary job, it has `uses` and no local `runs-on` or `steps`; the called workflow owns those details.

## Do

Your organization provides a shared risk check. In [workflow.yml](workflow.yml), make `risk` use `./.github/workflows/reusable-risk.yml`. Keep `with.sample_size: 3`, and remove its runner and steps.

```sh
node exercises/09-reusable-call/check.mjs
```

It fails if this is still a runner-backed job and passes when `risk` has only the reusable `uses` reference and its input. Hint: delete `runs-on` and `steps` after adding `uses`. [Reusing workflows](https://docs.github.com/actions/sharing-automations/reusing-workflows) shows caller-job syntax.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/09-reusable-call/workflow.yml).</details>

Next: [10 — Composite action](../10-composite-action/README.md).
