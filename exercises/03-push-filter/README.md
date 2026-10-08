# 03 — Filter a push trigger

Events can be narrowed before any runner starts. A branch filter says which branch matters; a path filter says which changed files matter. Both belong under the same event, so they combine rather than create two unrelated triggers.

## Do

The build should run only when `src/` changes on `main`. In [workflow.yml](workflow.yml), keep the existing `main` branch filter and add a `paths` list containing exactly `src/**`, nested under `push`.

```sh
node exercises/03-push-filter/check.mjs
```

It fails until both filters are present and passes when `src/**` is nested under `push`. Hint: `paths` is a sibling of `branches`. [Workflow filters](https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore) explain their matching rules.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/03-push-filter/workflow.yml).</details>

Next: [04 — Context as data](../04-context-as-data/README.md).
\nHosted fork-to-fix: [03 lab](../../hands-on/03-push-filter/README.md).
