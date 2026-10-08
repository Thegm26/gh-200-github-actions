# 10 — Make a composite action

A composite action groups shell steps behind one action interface. Its execution model is `composite`, and every `run` step declares its shell explicitly.

## Do

Turn [action.yml](action.yml) into a tiny reusable greeting action: set `runs.using` to `composite`, add `runs.steps`, and include one Bash shell step that runs `echo hello`.

```sh
node exercises/10-composite-action/check.mjs
```

It fails until the action has that explicit composite step and passes when the run step declares Bash. Hint: `steps` is nested below `runs`. [Composite actions](https://docs.github.com/actions/sharing-automations/creating-actions/creating-a-composite-action) explains the metadata.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/10-composite-action/action.yml).</details>

Next: [11 — Failure evidence](../11-failure-evidence/README.md).
