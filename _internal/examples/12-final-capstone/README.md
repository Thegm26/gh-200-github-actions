# 12 — final mixed capstone and oral close

## Prerequisites and focused goal

Complete the relevant canonical labs first. Integrate two small repairs and identify remaining hosted-only decisions.

## Objective and domain

Integrate all five GH-200 domains in one constrained workflow review, then finish with high-yield distinctions rather than passive rereading.

## Files to inspect or edit

- Repair `starter/capstone.workflow.yml.txt` and complete `starter/decisions.md`.
- Inspect the separate inactive reusable-workflow contract in `solution/reusable-risk.workflow.yml.txt` only during review.
- Compare with `solution/` only after recording the repair plan.

## Tasks

1. Run `npm run quiz -- --count 5 --seed capstone`; record misses without opening explanations.
2. Repair the output path through the reusable-workflow caller to a consuming job.
3. Replace the report cache with an artifact and write why `write-all`, an unreviewed mutable ref, and direct PR-title interpolation are unsafe.
4. Explain starter/reusable/composite; artifact/cache; secret/variable; `GITHUB_TOKEN`/PAT/OIDC; and SHA policy versus immutable release tag.

## Expected observable result

You have a completed repair, a short list of remaining matrix/security defects, and a missed-topic loop. Compare the complete inactive solution only after the attempt.

## Verification commands or checklist

```bash
npm run quiz -- --count 5 --seed route3
```

Then run the checker against your starter and compare manually with the solution. Checklist: no active workflow copied; no credentials/deployments; write down every miss by objective. The legacy checker is structural, so manual explanation remains required.

## Answer or solution location

Use [`solution/capstone.workflow.yml.txt`](solution/capstone.workflow.yml.txt), [`solution/reusable-risk.workflow.yml.txt`](solution/reusable-risk.workflow.yml.txt), and [`solution/decisions.md`](solution/decisions.md) only after the attempt.

## Primary official links

- [Microsoft GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200)
- [GitHub Actions documentation](https://docs.github.com/actions)
- [Security hardening](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [Artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations)
