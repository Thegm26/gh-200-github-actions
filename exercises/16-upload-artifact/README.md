# 16 — Preserve build output as an artifact

An artifact saves files produced by one workflow run so people or later jobs can inspect them. It is different from a dependency cache: a cache speeds repeated work, while an artifact is named output from this run.

## Do

The build already creates `dist/result.txt`. In [workflow.yml](workflow.yml), add a second build step using `actions/upload-artifact@v4`. Give it `name: build-output` and `path: dist`.

```sh
node exercises/16-upload-artifact/check.mjs
```

It fails until the upload action, artifact name, and path all match; it passes when the build output is named clearly. Hint: `with` is nested under the `uses` step. [Storing workflow data as artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts) covers upload and download.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/16-upload-artifact/workflow.yml) after trying it.</details>

Next: [17 — Gate deployment](../17-capstone-gate/README.md).
