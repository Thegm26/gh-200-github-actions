# 07-matrix hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/07-matrix/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

The starter requests matrix Node 22 but setup-node installs Node 20. The real job is red when process.versions.node major is compared with REQUESTED_NODE.

## Exact repair

Set setup-node node-version to the matrix node expression; the solution checks actual Node major for both 20 and 22 rows.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-07-matrix-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.
