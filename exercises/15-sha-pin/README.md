# 15 — Pin checkout to an immutable commit

An action tag such as `v4` is convenient but can move. A complete 40-character commit SHA names one exact revision, making review and policy enforcement reproducible. It is still important to verify that SHA against the action's upstream release rather than inventing one.

## Do

In [workflow.yml](workflow.yml), replace `actions/checkout@v4` with the verified 40-character checkout SHA in the comment directly above the job. Keep `actions/checkout@` before that SHA.

```sh
node exercises/15-sha-pin/check.mjs
```

It fails for a mutable tag, a shortened hash, or extra text after the SHA; it passes for one complete commit reference. Hint: copy the commented SHA exactly. [Secure use reference](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions) explains immutable pinning.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/15-sha-pin/workflow.yml) after trying it.</details>

Next: [16 — Upload an artifact](../16-upload-artifact/README.md).
\nHosted fork-to-fix: [15 lab](../../hands-on/15-sha-pin/README.md).
