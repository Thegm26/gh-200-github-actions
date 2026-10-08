# 00 — blueprint recall

## Prerequisites and focused goal

Install dependencies with `npm install`. Build a map of the course before choosing a workflow feature.

## Objective and domain

Build a retrieval map of all five GH-200 domains before touching syntax. This is the orientation exercise for every domain.

## Files to inspect or edit

- Edit `attempt.md` from memory.
- Inspect the real service, active CI/reusable workflows, and both local actions using [START_HERE](../../docs/START_HERE.md).
- Inspect `../../docs/BLUEPRINT.md` after your attempt.

## Tasks

1. In one terminal run `npm start`. In a second terminal, call `/health` and `/v1/build-risk` from START_HERE, then stop the server with Ctrl-C.
2. Without notes, write the five domains and their weight ranges.
3. Put these nouns under the best domain: matrix, run log, `action.yml`, runner group, OIDC, starter workflow, attestation.
4. Circle the two domains that together account for 40–50%.

## Expected observable result

Your attempt has five domains, seven classified nouns, identifies author/manage plus enterprise as the largest combined emphasis, and you can point to one live CI, reusable-workflow, and local-action example in this repository.

## Verification commands or checklist

```bash
diff -u examples/00-blueprint-recall/solution.md examples/00-blueprint-recall/attempt.md || true
```

Differences are expected; explain every difference aloud before correcting it.

## Answer or solution location

Open [`solution.md`](solution.md) only after the attempt. Retry by rewriting the map without notes.

## Primary official links

- [Microsoft GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200)
