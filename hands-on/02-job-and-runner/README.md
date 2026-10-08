# 02-job-and-runner hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/02-job-and-runner/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

Configuration error before a runner is allocated: build has no runs-on.

## Exact repair

Add `runs-on: ubuntu-latest` and `timeout-minutes: 5` under build.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-02-job-and-runner-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.
