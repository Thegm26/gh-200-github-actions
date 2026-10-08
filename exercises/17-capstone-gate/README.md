# 17 — Gate deployment on a successful build

Jobs normally run in parallel. `needs: build` makes deployment wait for the build and skip if it fails. The deployment token should stay read-only unless a real deployment step needs a narrowly scoped write permission; an environment can add approval rules on top of that dependency.

## Do

In [workflow.yml](workflow.yml), give `deploy` `needs: build`. Change its `permissions.contents` from `write` to `read`, with no other write permission.

```sh
node exercises/17-capstone-gate/check.mjs
```

It fails while deployment can run independently or has write access, and passes when the build is its dependency and the token is read-only. Hint: `needs` is aligned with `runs-on` inside `deploy`. [Defining prerequisite jobs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idneeds) explains the dependency graph.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/17-capstone-gate/workflow.yml) after trying it.</details>

You finished the canonical route. Revisit [the course guide](../../docs/COURSE.md) or use the optional GitHub sandbox when authorized.
\nHosted fork-to-fix: [17 lab](../../hands-on/17-capstone-gate/README.md).
