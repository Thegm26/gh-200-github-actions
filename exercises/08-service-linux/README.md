# 08 — Start a service beside a job

A service container is a dependency that lives with one job. It needs readiness checking: starting a container does not mean the database is ready for a test.

## Do

The test job uses Redis 7. In [workflow.yml](workflow.yml), keep `image: redis:7` and add `options` under `redis` containing a Redis `health-cmd` (for example `redis-cli ping`).

```sh
node exercises/08-service-linux/check.mjs
```

It fails until the Redis service has a health command and passes when `options` contains `health-cmd`. Hint: `options` is alongside `image` under `redis`. [Service containers](https://docs.github.com/actions/using-containerized-services/about-service-containers) describes the job lifecycle.

<details><summary>Solution</summary>Compare with the immutable [solution](../../learning/solutions/08-service-linux/workflow.yml).</details>

Next: [09 — Reusable workflow](../09-reusable-call/README.md).
