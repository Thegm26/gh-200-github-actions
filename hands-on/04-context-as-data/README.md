# 04 — Context as data

The starter intentionally demonstrates an unsafe pattern for teaching: it interpolates a maintainer-controlled, harmless default directly into shell source. Do not substitute arbitrary external data for this exercise.

## First hosted result

    mkdir -p .github/workflows
    cp hands-on/04-context-as-data/workflow.yml.txt .github/workflows/gh200-lab.yml

Commit and push, then use **Run workflow** with the default `$(printf changed)` message. The interpolation becomes shell syntax, so the printed value is `changed` and the assertion that expects the original literal fails. The workflow is read-only and times out after five minutes.

## Exact repair

Pass `inputs.message` through `env` as `EVENT_TEXT`, then print it with `printf '%s\
' "$EVENT_TEXT"`. Keep the expected value as the single-quoted literal `$(printf changed)`; do not use `eval` or another shell evaluation mechanism.

## New evidence

Commit and push the repaired workflow, then start a **new** manual run at that commit. It prints the literal `$(printf changed)` and passes. Compare it with [solution.yml.txt](solution.yml.txt); do not use **Re-run jobs** for changed workflow content.

## Preserve and clean up

    mkdir -p .practice
    cp -n .github/workflows/gh200-lab.yml .practice/gh200-04-context-as-data-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup when finished.

[Back to setup](../SETUP.md) · [Next case: 05](../05-job-output/README.md)
