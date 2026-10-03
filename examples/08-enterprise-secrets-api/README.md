# 08 — scopes, APIs, runner images, and retention

## Exact target time

25 minutes (02:45–03:10).

## Objective and domain

Manage Actions for the enterprise: scope secrets/variables, plan protected environments, select REST resources, and make hosted image/tooling changes reproducible.

## Files to inspect or edit

- Edit `scope-plan.json` and `api-plan.sh.txt`.
- Inspect `runner-migration.md`.
- Compare with `solution/` files after minute 20.

## Tasks

1. Place `REGION`, `NPM_TOKEN`, and `DEPLOY_KEY` at organization, repository, or production-environment scope, marking variable versus secret.
2. Add production required reviewers and explain when environment secrets become available.
3. Sketch safe `gh api` requests for organization variables, repository secrets metadata, and organization artifact/log retention. Do not submit them.
4. Plan a `windows-latest` compiler migration using runner-image release notes, explicit setup/install, and a pinned tested image label where appropriate.
5. Explain why secrets are not readable back through the API and why public-key encryption is required when setting them through REST.

## Expected observable result

Shared non-sensitive `REGION` is a variable; package credential is a narrowly scoped secret; production credential is an environment secret protected by reviewers. API examples are inert `.txt` files.

## Verification commands or checklist

```bash
node examples/08-enterprise-secrets-api/check.mjs
```

Checklist: no literal secret values; no API command executes; retention is not confused with artifact `retention-days`; migration does not assume `*-latest` is fixed forever.

## Answer or solution location

Use [`solution/scope-plan.json`](solution/scope-plan.json), [`solution/api-plan.sh.txt`](solution/api-plan.sh.txt), and [`solution/runner-migration.md`](solution/runner-migration.md).

## Primary official links

- [Variables](https://docs.github.com/actions/learn-github-actions/variables)
- [Using secrets](https://docs.github.com/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
- [REST: Actions variables](https://docs.github.com/rest/actions/variables)
- [REST: Actions secrets](https://docs.github.com/rest/actions/secrets)
- [REST: Actions permissions and retention](https://docs.github.com/rest/actions/permissions)
- [Runner images](https://github.com/actions/runner-images)

