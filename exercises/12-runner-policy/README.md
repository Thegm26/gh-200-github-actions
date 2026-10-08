# 12 — Request an approved self-hosted runner

An array of runner labels means a self-hosted runner must match every label. Labels route work to matching runners; runner groups and repository access settings decide which repositories may use those runners.

## Do

The scanning job must land only on approved self-hosted machines. In [workflow.yml](workflow.yml), make `runs-on` exactly the two-item list `self-hosted` and `approved`.

```sh
node exercises/12-runner-policy/check.mjs
```

It fails with the unapproved label and passes with exactly the two approved labels. Hint: both labels are list items under `runs-on`. [Self-hosted runner labels](https://docs.github.com/actions/how-tos/manage-runners/self-hosted-runners/use-in-a-workflow) gives the matching rules.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/12-runner-policy/workflow.yml).</details>

Next: [13 — Least privilege](../13-least-privilege/README.md).
