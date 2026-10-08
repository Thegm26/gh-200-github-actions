# 11 — Keep evidence after a failure

By default, later steps do not run when a previous step fails. An evidence step needs `if: ${{ always() }}` so it still records what happened; `$GITHUB_STEP_SUMMARY` makes that evidence visible in the run summary.

## Do

The test intentionally fails, but its logs still need a short summary. In [workflow.yml](workflow.yml), add a later step whose `if` is exactly `${{ always() }}` and whose `run` appends text to `$GITHUB_STEP_SUMMARY`.

```sh
node _internal/exercises/11-failure-evidence/check.mjs
```

It fails until both the condition and summary write are present and passes when the evidence step always runs. Hint: add the evidence step after the failing test step. [Status check functions](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/evaluate-expressions-in-workflows-and-actions#status-check-functions) explains `always()`.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/11-failure-evidence/workflow.yml).</details>

Next: [12 — Runner policy](../12-runner-policy/README.md).
Hosted fork-to-fix: [11 lab](../../../hands-on/11-failure-evidence/README.md).
