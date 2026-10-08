# Hosted fork-to-fix labs

All 17 cases are inactive templates. Most create a real hosted red job; 01, 02, 03, 12, 13, 14, and 15 explicitly teach a registration, configuration, or safe policy state instead. Nothing runs until you copy a template into your own fork.

## Prerequisites and one-lab route

You need Git, VS Code, a GitHub account, and a fork with Actions enabled. Node/npm are not required for the hosted route; GitHub runner images supply tools used by each workflow.

    git clone https://github.com/YOUR-USERNAME/gh-200-github-actions.git
    cd gh-200-github-actions
    git switch main
    git branch --show-current
    git status --short
    code .

If your fork default branch is not main, use that branch instead. Read the chosen case guide before copying: it gives exact source and destination paths. Do not overwrite an existing learner workflow; if .github/workflows/gh200-lab.yml exists, stop and save or remove it yourself first.

After a copy or edit:

    git add .github/workflows/gh200-lab.yml
    git commit -m "Try GH-200 hosted lab"
    git push origin main

For a case with support files, stage only the listed files too (for example, `git add .github/workflows/gh200-called.yml` for 09); do not use broad `git add .github`. Open your fork Actions tab, enable Actions if GitHub asks, select the lab, then choose [Run workflow](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow). After repairing, make another commit, push it, and choose a new manual dispatch at that new SHA. [Re-running](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/re-running-workflows-and-jobs) an old job does not prove the repair.

To preserve an active learner workflow without overwriting a previous backup:

    mkdir -p .practice
    cp -n .github/workflows/gh200-lab.yml .practice/gh200-lab-backup.yml

Each case lists exact cleanup files. The maintainer npm run check is not a learner workflow checker after activation.

## Cases

| ID | Case | First hosted state |
| --- | --- | --- |
| [01](01-first-workflow/README.md) | Manual dispatch | No Run workflow button until trigger exists |
| [02](02-job-and-runner/README.md) | Runner | Invalid configuration; no runner job |
| [03](03-push-filter/README.md) | Push filters | Opt-in trigger policy |
| [04](04-context-as-data/README.md) | Context data | Safe literal input behavior |
| [05](05-job-output/README.md) | Job output | Red consumer job |
| [06](06-needs-output/README.md) | Needs output | Invalid dependency expression |
| [07](07-matrix/README.md) | Matrix | Red Node-version row |
| [08](08-service-linux/README.md) | Service | Red Redis connection |
| [09](09-reusable-call/README.md) | Reusable workflow | Missing called-workflow configuration |
| [10](10-composite-action/README.md) | Composite action | Red local action output |
| [11](11-failure-evidence/README.md) | Evidence | Intentional red job |
| [12](12-runner-policy/README.md) | Runner policy | Safe decision model |
| [13](13-least-privilege/README.md) | Permissions | Read-only candidate-policy validation |
| [14](14-oidc-job/README.md) | OIDC | Job ability to request identity |
| [15](15-sha-pin/README.md) | SHA policy | Safe source-policy model |
| [16](16-upload-artifact/README.md) | Artifact | Red missing-upload input |
| [17](17-capstone-gate/README.md) | Deployment gate | Red needs-output gate |
