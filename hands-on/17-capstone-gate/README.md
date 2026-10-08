# 17-capstone-gate hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/17-capstone-gate/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

deploy is red because build output is not-ready.

## Exact repair

Change build output to `result=ready`; keep `needs: build`.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-17-capstone-gate-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.
