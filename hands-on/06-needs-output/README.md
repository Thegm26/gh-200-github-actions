# 06-needs-output hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/06-needs-output/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

The missing `needs: prepare` can be rejected as a workflow configuration error before a job starts, or it can produce a red consumer test depending on GitHub's validation path. Do not rely on a preflight rejection.

## Exact repair

Add `needs: prepare` under report.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-06-needs-output-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.
