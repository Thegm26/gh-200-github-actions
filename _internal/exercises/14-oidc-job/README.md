# 14 — Scope cloud identity to one deployment job

OIDC lets a job request a short-lived identity token for a cloud provider. It is powerful, so it belongs only on the deployment job that needs it. A protected `production` environment can add approvals or other rules, while the cloud provider must still trust this repository and subject.

## Do

In [workflow.yml](workflow.yml), make the top-level permissions exactly `contents: read`. On `deploy`, add `environment: production` and a job-level permissions mapping containing `id-token: write` and `contents: read`.

```sh
node _internal/exercises/14-oidc-job/check.mjs
```

It fails while OIDC is broad or the deployment lacks the `production` environment reference, and passes when `deploy` owns both settings. The local parser cannot prove an actual approval rule or cloud trust: configure those on GitHub and in the cloud provider. Hint: put the special permission under the job, not next to the workflow name. [OIDC with cloud providers](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers) shows the full trust setup.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/14-oidc-job/workflow.yml) after trying it.</details>

Next: [15 — SHA pin](../15-sha-pin/README.md).
Hosted fork-to-fix: [14 lab](../../../hands-on/14-oidc-job/README.md).
