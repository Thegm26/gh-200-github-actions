# Start here

## What this course changes

Every canonical exercise lives in a disposable `.practice/<id>` folder. `npm run learn -- start <id>` copies a starter; `npm run learn -- check <id>` gives concrete structural feedback. Nothing in the local labs changes a GitHub repository.

## Small glossary

- **Workflow:** YAML automation triggered by an event or manual dispatch.
- **Job / step:** a job runs on one runner; steps run in order inside it.
- **Runner:** the machine that executes a job. GitHub-hosted runners are managed by GitHub; self-hosted runners are yours to secure and maintain.
- **Action:** reusable unit invoked by a step. A composite action combines steps; JavaScript and Docker actions run code.
- **Reusable workflow:** a multi-job workflow called by another workflow.
- **Context:** run metadata such as `github.event`; treat untrusted values as data by passing them through `env` and quoting shell expansion.
- **Artifact / cache:** an artifact transfers or preserves run output; a cache speeds repeat work and is not release evidence.

## Shell and platform notes

Use a POSIX terminal (macOS/Linux, Git Bash, or WSL) for the copy-paste commands. On PowerShell, replace `export NAME=value` with `$env:NAME = 'value'`; otherwise the learner commands are unchanged. Open files with any editor—VS Code is optional. The local checker runs only Node scripts; it cannot prove GitHub-hosted behavior such as an approval, runner policy, or OIDC cloud trust.

## If something fails

1. Run `npm run doctor` and fix the reported prerequisite.
2. Run `npm run learn -- status` to see started labs and their current outcome.
3. Read the failed invariant, make the smallest edit, and rerun `check`.
4. If the workspace is confused, use `npm run learn -- reset <id> --yes`; this replaces only that lab's `.practice/<id>` folder.
5. Compare with `learning/solutions/<id>/` only after a genuine attempt. If the local check passes but your explanation is weak, use the manual rubric in [COURSE.md](COURSE.md).

## Optional GitHub sandbox runbook

Use this only after local labs. It creates and later deletes a disposable repository. Do not use a work repository or add secrets.

```bash
gh auth status
export GH200_REPO="$(gh api user --jq .login)/gh200-sandbox-$(date +%s)"
gh repo create "$GH200_REPO" --private --clone
cd "${GH200_REPO#*/}"
git checkout -b main
mkdir -p .github/workflows
```

Create `.github/workflows/first.yml` with this minimal workflow:

```yaml
name: first sandbox workflow
on:
  workflow_dispatch:
jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - run: echo "hello from GitHub Actions"
```

Commit and push it to the default branch before manual dispatch—the workflow file must be present on the default branch for `workflow_dispatch` to be available:

```bash
git add .github/workflows/first.yml
git commit -m "Add disposable first workflow"
git push --set-upstream origin main
gh workflow run first.yml --repo "$GH200_REPO"
gh run list --repo "$GH200_REPO" --workflow first.yml --limit 1
gh run watch --repo "$GH200_REPO"
```

For a completed run, inspect logs and rerun only the failed jobs when appropriate:

```bash
export GH200_RUN_ID="$(gh run list --repo "$GH200_REPO" --workflow first.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run view "$GH200_RUN_ID" --repo "$GH200_REPO" --log
```

To practise failure logs, deliberately change the echo step to `run: exit 1`, commit, push, and dispatch again. Then select the new failed run before inspecting or rerunning it:

```bash
gh run list --repo "$GH200_REPO" --workflow first.yml --limit 5
export GH200_RUN_ID="$(gh run list --repo "$GH200_REPO" --workflow first.yml --status failure --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$GH200_RUN_ID" --repo "$GH200_REPO" --exit-status
gh run view "$GH200_RUN_ID" --repo "$GH200_REPO" --log-failed
gh run rerun "$GH200_RUN_ID" --repo "$GH200_REPO" --failed
```

Restore the success step before cleanup.

To see artifacts, use the Actions UI for the repository or `gh run download "$GH200_RUN_ID" --repo "$GH200_REPO"` after adding an artifact-upload step. Cleanup is explicit:

```bash
cd ..
gh repo delete "$GH200_REPO" --yes
unset GH200_REPO GH200_RUN_ID
```

For environments, reusable workflows, action publishing, enterprise policies, runner groups, IP allow lists, and OIDC cloud federation, use the corresponding GitHub/enterprise account only when you have authorization. The local exercises teach the YAML and decision boundaries; they cannot safely create privileged configuration.
