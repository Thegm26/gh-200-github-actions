# 06 — interleaved hard scenarios

## Exact target time

10 minutes (02:00–02:10).

## Objective and domain

Interleave author/manage, consume/troubleshoot, and author-actions knowledge so cues do not reveal the abstraction.

## Files to inspect or edit

- Complete `scenarios.md` without prior modules.
- Check `solution.md` only after all five decisions.

## Tasks

Give the smallest correct fix and reject one tempting distractor for each scenario:

1. A later job sees an empty build version.
2. One matrix row failed, siblings were cancelled, and all combinations must finish.
3. A centrally maintained deployment has three jobs and two environment gates.
4. A portable sequence of three steps must be reused inside existing jobs.
5. A copied organization scaffold must evolve independently in each new repository.

## Expected observable result

Five decisions name job output mapping, `fail-fast: false`, reusable workflow, composite action, and starter workflow—in that order.

## Verification commands or checklist

```bash
diff -u examples/06-interleaved-debugging/solution.md examples/06-interleaved-debugging/scenarios.md || true
```

Score one point for the answer and one for rejecting the wrong abstraction: target 8/10.

## Answer or solution location

Open [`solution.md`](solution.md) after writing all answers.

## Primary official links

- [Job outputs](https://docs.github.com/actions/using-jobs/defining-outputs-for-jobs)
- [Matrix failure handling](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs#handling-failures)
- [Avoiding duplication](https://docs.github.com/actions/concepts/workflows-and-actions/avoiding-duplication)

