# 05-job-output hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/05-job-output/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

consume is red because needs.prepare.outputs.version is empty.

## Exact repair

Add `outputs: {version: ${{ steps.version.outputs.version }}}` under prepare.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-05-job-output-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.

[Back to setup](../SETUP.md) · [Next case: 06](../06-needs-output/README.md)
