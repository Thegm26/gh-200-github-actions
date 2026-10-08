# 11 — Failure evidence

## First hosted result

    mkdir -p .github/workflows
    cp hands-on/11-failure-evidence/workflow.yml.txt .github/workflows/gh200-lab.yml

Commit and push, then start a new manual run. The test step exits 1, making the job red; the ordinary evidence step is skipped.

## Exact repair

Add the evidence step from [evidence-only.yml.txt](evidence-only.yml.txt), including `if: ${{ always() }}`, after the failing test. Commit and push, then start a new run. It remains **red**, but the step writes `test-finished` to the job summary. This is the intended intermediate result.

## New evidence

Then replace the test's `exit 1` with `echo success`, retaining the always-run evidence step. Commit and push, then start another new run. It is **green** and includes the summary evidence. [solution.yml.txt](solution.yml.txt) is the final workflow. Do not use **Re-run jobs** after changing workflow content.

Every version is read-only and has a five-minute timeout.

## Preserve and clean up

    mkdir -p .practice
    cp -n .github/workflows/gh200-lab.yml .practice/gh200-11-failure-evidence-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup when finished.
