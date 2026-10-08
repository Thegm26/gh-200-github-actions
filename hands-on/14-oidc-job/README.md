# 14-oidc-job hosted fork-to-fix

## Copy

    mkdir -p .github/workflows
    cp hands-on/14-oidc-job/workflow.yml.txt .github/workflows/gh200-lab.yml

## First hosted result

The deploy job is red because no job-level id-token write permission exists, so ACTIONS_ID_TOKEN_REQUEST_URL is absent. It neither prints nor requests a token.

## Exact repair

Under jobs.deploy add:

    permissions:
      contents: read
      id-token: write

The fixed job proves only ability to request an OIDC token; it does not mint a token, exchange with a cloud, prove cloud trust, read a secret, or deploy.

## New evidence

Commit and push. Open Actions and choose Run workflow. Use a new manual dispatch at the new commit SHA; never Re-run jobs for the old SHA. Compare only after attempting: [solution.yml.txt](solution.yml.txt).

## Preserve and clean up

    mkdir -p .practice && cp -n .github/workflows/gh200-lab.yml .practice/gh200-14-oidc-job-backup.yml
    git rm .github/workflows/gh200-lab.yml

Commit and push cleanup.
