# Lab 02 — consume and troubleshoot (35 min)

Sources: [troubleshoot workflows](https://docs.github.com/actions/how-tos/monitor-workflows/use-workflow-run-logs) · [reusable workflows](https://docs.github.com/actions/sharing-automations/reusing-workflows) · [starter workflows](https://docs.github.com/actions/use-workflows/creating-starter-workflows-for-your-organization).

Use `starter/run-evidence.md.txt` as a simulated failed run. Diagnose before opening `solution/diagnosis.md`.

1. (8m) Map each failed job label to the matrix axes and name the only failed variant; decide whether to rerun one job or all jobs.
2. (8m) Expand the provided YAML anchor mentally and find which explicit value wins after the merge.
3. (7m) Choose logs, artifact download, or REST API for each incident in the starter; identify the artifact retention consequence.
4. (7m) Classify each reuse proposal as starter workflow, reusable workflow, or composite action; choose one for centrally maintained policy logic.
5. (5m) Explain disabling versus deleting when an audit trail and later re-enable are required.

Verification: a learner can identify trigger, failed matrix coordinate, evidence location, and correct reuse abstraction without opening solution. Hard scenarios: a non-public organization template must seed projects but not remain linked; a shared deployment graph must update centrally; a three-step checkout/setup/test sequence belongs inside a job.
