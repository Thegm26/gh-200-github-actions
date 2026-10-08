# 12 — Runner policy decision

This lab models a self-hosted runner request while the checker itself runs safely on hosted `ubuntu-latest`. The check evaluates repository access and required labels in candidate job data; it does not request or prove access to a self-hosted runner. It is a configuration model, not proof that a hosting platform enforces this policy.

## First hosted result

    mkdir -p .github/workflows .github/gh200-runner-policy
    cp hands-on/12-runner-policy/workflow.yml.txt .github/workflows/gh200-lab.yml
    cp hands-on/12-runner-policy/check-policy.js .github/gh200-runner-policy/check-policy.js
    cp hands-on/12-runner-policy/candidate.json .github/gh200-runner-policy/candidate.json

Commit and push, then use **Run workflow**. The local Node check reads the candidate job request and fails because its repository lacks group access, despite the matching `trusted` label.

## Exact repair

Replace only the copied candidate with the approved one:

    cp hands-on/12-runner-policy/candidate.solution.json .github/gh200-runner-policy/candidate.json

## New evidence

Commit and push, then start a **new** manual run at that commit. The same checker passes because the repository is selected and the required label matches. Compare the workflow with [solution.yml.txt](solution.yml.txt), and the data with [candidate.solution.json](candidate.solution.json). Do not use **Re-run jobs** after changing files.

The executing workflow has `contents: read`, a five-minute timeout, an approved SHA-pinned checkout, and runs only local Node code. `requestedRunner: self-hosted` is candidate data, not the workflow's `runs-on` value.

## Preserve and clean up

    mkdir -p .practice
    cp -n .github/workflows/gh200-lab.yml .practice/gh200-12-runner-policy-backup.yml
    git rm .github/workflows/gh200-lab.yml
    git rm -r .github/gh200-runner-policy

Commit and push cleanup when finished.

[Back to setup](../SETUP.md) · [Next case: 13](../13-least-privilege/README.md)
