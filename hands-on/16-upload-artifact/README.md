# 16-upload-artifact hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/16-upload-artifact/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

`upload-artifact` is red because `dist/result.txt` is absent and the template sets `if-no-files-found: error`.

## Exact repair

Add `mkdir -p dist && printf artifact > dist/result.txt` before upload.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-16-upload-artifact-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.
