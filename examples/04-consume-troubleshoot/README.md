# 04 — consume and troubleshoot run evidence

## Exact target time

25 minutes (01:15–01:40).

## Objective and domain

Consume and troubleshoot workflows: use run evidence, expand anchors, isolate matrix failures, select logs/artifacts/API, and choose the correct reuse abstraction.

## Files to inspect or edit

- Inspect `run-evidence.json` and inactive `workflow-fragment.yml.txt`.
- Record decisions in `attempt.md`.
- Compare with `solution.md` after minute 20.

## Tasks

1. Identify the only failed matrix coordinate and the smallest useful rerun.
2. Expand the anchor and state the effective `shell` and `timeout-minutes`.
3. Pick run log, artifact, or REST API for: command stderr; compiled binary; automated cross-run inventory.
4. Classify: copied new-repo scaffold; central deployment graph; reusable three-step sequence within a job.
5. Explain disable versus delete when history and later re-enable matter.

## Expected observable result

Your diagnosis selects one failed Ubuntu/Node 22 job, `pwsh` plus timeout 10, and correctly maps starter workflow/reusable workflow/composite action.

## Verification commands or checklist

```bash
node examples/04-consume-troubleshoot/check.mjs
diff -u examples/04-consume-troubleshoot/solution.md examples/04-consume-troubleshoot/attempt.md || true
```

Explain why artifact retention can remove the file while run metadata still exists, and why a selective rerun may still need dependent jobs rerun.

## Answer or solution location

Use [`solution.md`](solution.md) only after completing `attempt.md`.

## Primary official links

- [Viewing workflow run history](https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/viewing-workflow-run-history)
- [Re-running workflows and jobs](https://docs.github.com/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/re-running-workflows-and-jobs)
- [Downloading workflow artifacts](https://docs.github.com/actions/managing-workflow-runs/downloading-workflow-artifacts)
- [Reusing workflows](https://docs.github.com/actions/sharing-automations/reusing-workflows)
- [Creating starter workflows](https://docs.github.com/actions/sharing-automations/creating-workflow-templates-for-your-organization)
- [Disabling and enabling a workflow](https://docs.github.com/actions/managing-workflow-runs/disabling-and-enabling-a-workflow)

