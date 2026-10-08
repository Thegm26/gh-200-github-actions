# 01-first-workflow hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/01-first-workflow/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

No Run workflow button: starter lacks workflow_dispatch.

## Exact repair

Add this trigger:

```yaml
on:
  workflow_dispatch: {}
```

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-01-first-workflow-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.

[Back to setup](../SETUP.md) · [Next case: 02](../02-job-and-runner/README.md)
