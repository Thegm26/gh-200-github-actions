# 05 — custom actions: composite, JavaScript, and Docker

## Prerequisites and focused goal

Complete canonical lab 10 first. Repair one metadata contract for each action type without publishing anything.

## Objective and domain

Author and maintain actions: implement runnable local composite and JavaScript actions, inspect metadata contracts, and reason about a safe non-executing Docker action.

## Files to inspect or edit

- Repair files in `workspace/composite` and `workspace/javascript` using `starter/action.yml.txt` as the broken prompt.
- Inspect `workspace/docker/action.yml.txt` and `Dockerfile.txt`; do not activate or execute them.
- Use `solution/*` only after attempting.

## Tasks

1. Composite: declare a required `prefix`, produce `stamp` through a step output, and map it in metadata.
2. JavaScript: declare `sample_size`, validate 0–20, and append `score`/`level` to the path in `GITHUB_OUTPUT`. Run its dependency-free harness locally.
3. Docker: explain why `runs.using: docker`, `image`, inputs, entrypoint, and Linux runner compatibility matter. Keep this example inactive.
4. Decide distribution/versioning for private internal use versus public Marketplace; distinguish release tag convenience from consumer full-SHA hardening.
5. Diagnose three failures: metadata not at action root; missing `shell` in a composite `run` step; JS action references source that was not committed.

## Expected observable result

Both local action metadata files have `name`, `description`, declared inputs/outputs, and correct `runs` values. `node workspace/javascript/test.mjs` reports success. Docker remains `.txt` and cannot run accidentally.

## Verification commands or checklist

```bash
node examples/05-custom-actions/workspace/javascript/test.mjs
node examples/05-custom-actions/verify.mjs
```

Checklist: composite output maps from a step; JS writes through the environment-file contract; Docker example is inactive; no credential or publish command executes.

## Answer or solution location

Compare against [`solution/composite/action.yml`](solution/composite/action.yml), [`solution/javascript`](solution/javascript), and [`solution/docker`](solution/docker). The local verifier is a supplement; manual success requires explaining metadata placement, action runtime, and release/distribution choice.

## Primary official links

- [Creating actions](https://docs.github.com/en/actions/tutorials/create-actions)
- [Metadata syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)
- [Creating a JavaScript action](https://docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action)
- [Creating a Docker container action](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-a-docker-container-action)
- [Creating a composite action](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action)
