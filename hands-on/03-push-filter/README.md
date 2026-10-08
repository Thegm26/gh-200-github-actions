# 03 — Push path filter

This is the one deliberate push-trigger exercise. Its workflow is read-only, has a five-minute timeout, and only prints `hello`.

## First hosted result

    mkdir -p .github/workflows
    cp hands-on/03-push-filter/workflow.yml.txt .github/workflows/gh200-lab.yml

Commit this file on your default branch and push it. It does **not** start a run: the push trigger accepts only the `gh200-path-lab` branch. You may use **Run workflow** to check that the file is valid, but manual dispatch does not prove push filters.

Create the branch with `git switch -c gh200-path-lab`. In VS Code, create `lab-inputs/hello.txt`, add a short line, then run:

    git add lab-inputs/hello.txt
    git commit -m "Add lab input"
    git push origin gh200-path-lab

No run appears because the starter watches `_internal/docs/**`, not `lab-inputs/**`.

## Exact repair

Change the starter's `paths` value from `_internal/docs/**` to `lab-inputs/**`. Edit `lab-inputs/hello.txt`, commit, and push again on `gh200-path-lab`. This push creates a run whose only step prints `hello`.

## New evidence

Compare your repaired workflow with [solution.yml.txt](solution.yml.txt). Make a new commit and push for every observation; do not use **Re-run jobs** to claim a changed filter took effect.

## Preserve and clean up

    mkdir -p .practice
    cp -n .github/workflows/gh200-lab.yml .practice/gh200-03-push-filter-backup.yml
    git rm .github/workflows/gh200-lab.yml

Make this cleanup commit on `gh200-path-lab`:

    git commit -m "Remove GH-200 lab workflow"
    git push origin gh200-path-lab

Then switch to your default branch (`main` below; substitute your branch name if different), make a distinct backup, and remove only the active lab file:

    git switch main
    mkdir -p .practice
    cp -n .github/workflows/gh200-lab.yml .practice/gh200-03-push-filter-main-backup.yml
    git rm .github/workflows/gh200-lab.yml
    git commit -m "Remove GH-200 lab workflow"
    git push origin main

Retain `gh200-path-lab`; without the active workflow file, later pushes to it are inactive. Do not delete the branch or an existing backup blindly.

[Back to setup](../SETUP.md) · [Next case: 04](../04-context-as-data/README.md)
