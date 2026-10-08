# 13 — Give the token only read access

`GITHUB_TOKEN` permissions say what the workflow may do in the repository. Start with the smallest useful capability. A top-level `contents: read` lets ordinary checkout and reads work without granting write access; a personal access token and an environment approval are separate controls.

## Do

This build only reads repository content. In [workflow.yml](workflow.yml), replace the broad permission with a top-level mapping that contains exactly `contents: read`. Do not add job-level permissions.

```sh
node exercises/13-least-privilege/check.mjs
```

It fails while the token is broad and passes when the top-level permission is exactly read-only. Hint: permissions are a YAML mapping, not a single `write-all` value. [Automatic token authentication](https://docs.github.com/actions/security-for-github-actions/security-guides/automatic-token-authentication) explains the available scopes.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/13-least-privilege/workflow.yml) after trying it.</details>

Next: [14 — Job-scoped OIDC](../14-oidc-job/README.md).
