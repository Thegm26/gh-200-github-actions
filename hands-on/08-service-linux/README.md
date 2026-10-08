# 08-service-linux hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/08-service-linux/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

Redis socket connection to port 6380 fails.

## Exact repair

Use port 6379 and the health option in solution.yml.txt.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-08-service-linux-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.
