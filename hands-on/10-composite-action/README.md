# 10-composite-action hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/10-composite-action/workflow.yml.txt .github/workflows/gh200-lab.yml
    mkdir -p .github/actions/gh200-greeting
    cp hands-on/10-composite-action/action.starter.yml.txt .github/actions/gh200-greeting/action.yml

## First hosted result

Starter composite emits message=starter; caller assertion is red.

## Exact repair

Replace only the copied metadata file:

    cp hands-on/10-composite-action/action.yml.txt .github/actions/gh200-greeting/action.yml

It emits message=hello through GITHUB_OUTPUT; the caller assertion then turns green.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-10-composite-action-backup.yml
    git rm .github/workflows/gh200-lab.yml

    git rm .github/actions/gh200-greeting/action.yml

Then remove the empty local action directory if it remains empty, commit, and push cleanup.

[Back to setup](../SETUP.md) · [Next case: 11](../11-failure-evidence/README.md)
