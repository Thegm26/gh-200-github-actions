# 13-least-privilege hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/13-least-privilege/workflow.yml.txt .github/workflows/gh200-lab.yml
    cp hands-on/13-least-privilege/candidate.yml.txt .github/gh200-policy.yml

## First hosted result

This is read-only policy validation running on GitHub. The job never changes token permissions or writes: it reads the inactive candidate policy file and reports the explicit contents write violation.

## Exact repair

Edit `.github/gh200-policy.yml`: change `contents: write` to `contents: read`. Do not add another permission. The local checker parses YAML and accepts only a permissions mapping whose sole entry is `contents: read`; it does not execute the candidate.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-13-least-privilege-backup.yml
    git rm .github/workflows/gh200-lab.yml
    git rm .github/gh200-policy.yml

Commit and push cleanup.
