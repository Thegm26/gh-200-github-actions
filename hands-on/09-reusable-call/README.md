# 09-reusable-call hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/09-reusable-call/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

The starter dispatch is rejected before a job starts because `.github/workflows/gh200-called.yml` is absent. This is a configuration result, not a red runner job.

## Exact repair

Add the called workflow, then commit both files:

    cp hands-on/09-reusable-call/gh200-called.yml.txt .github/workflows/gh200-called.yml

Keep risk as a job-level `uses` call with no `runs-on` or steps; the next dispatch logs the called reusable workflow.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-09-reusable-call-backup.yml
    git rm .github/workflows/gh200-lab.yml

    git rm .github/workflows/gh200-called.yml

Commit and push cleanup.

[Back to setup](../SETUP.md) · [Next case: 10](../10-composite-action/README.md)
