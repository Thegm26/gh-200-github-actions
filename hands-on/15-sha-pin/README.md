# 15 — SHA pin policy

This lab validates action-reference data; it does not execute the candidate action. The hosted workflow itself uses only the SHA-pinned checkout action, then runs a local Node policy checker.

## First hosted result

    mkdir -p .github/workflows .github/gh200-sha-pin
    cp hands-on/15-sha-pin/workflow.yml.txt .github/workflows/gh200-lab.yml
    cp hands-on/15-sha-pin/check-pin.js .github/gh200-sha-pin/check-pin.js
    cp hands-on/15-sha-pin/action-candidate.json .github/gh200-sha-pin/action-candidate.json

Commit and push, then use **Run workflow**. The candidate uses mutable `v4`, so the real local policy check fails. No candidate action is run.

## Exact repair

Replace only the copied candidate with its verified immutable revision:

    cp hands-on/15-sha-pin/action-candidate.solution.json .github/gh200-sha-pin/action-candidate.json

## New evidence

Commit and push, then start a **new** manual run. The checker passes only when the action name and full 40-character SHA equal the reviewed revision. Compare [solution.yml.txt](solution.yml.txt) and [action-candidate.solution.json](action-candidate.solution.json). Do not use **Re-run jobs** after changing files.

The workflow is read-only and has a five-minute timeout.

## Preserve and clean up

    mkdir -p .practice
    cp -n .github/workflows/gh200-lab.yml .practice/gh200-15-sha-pin-backup.yml
    git rm .github/workflows/gh200-lab.yml
    git rm -r .github/gh200-sha-pin

Commit and push cleanup when finished.

[Back to setup](../SETUP.md) · [Next case: 16](../16-upload-artifact/README.md)
