# 12 — final mixed capstone and oral close

## Exact target time

30 minutes total: 15 minutes capstone (04:15–04:30), 10 minutes review (04:30–04:40), and 5 minutes oral close (04:40–04:45).

## Objective and domain

Integrate all five GH-200 domains in one constrained workflow review, then finish with high-yield distinctions rather than passive rereading.

## Files to inspect or edit

- Repair `starter/capstone.workflow.yml.txt` and complete `starter/decisions.md`.
- Run the mixed quiz during the first 15 minutes.
- Compare with `solution/` only in the 10-minute review window.

## Tasks

### 15-minute capstone

1. Run `npm run quiz -- --count 15 --seed route3 --review-wrong`.
2. Fix trigger filters and typed manual input; retain a safe manual path.
3. Repair step → job → reusable-workflow output flow.
4. Correct matrix cancellation/concurrency and choose artifact rather than cache for the report.
5. Apply minimum permissions, full-SHA pins, safe PR-title handling, and environment gating.
6. Classify the shared logic as starter/reusable/composite, choose runner governance, and specify attestation verification before trust.

### 10-minute review

Read only missed sections in `solution/`, then use `../../docs/CHEAT_SHEET.md` and `../../docs/LAST_HOUR.md` to close gaps.

### 5-minute oral close

Explain aloud: starter/reusable/composite; artifact/cache; secret/variable; `GITHUB_TOKEN`/PAT/OIDC; full SHA/tag. Add runner group/action policy and generate/verify attestation if time remains.

## Expected observable result

The repaired inactive workflow passes `check.mjs`, the mixed quiz reaches at least 12/15, and you can explain all five distinctions without notes.

## Verification commands or checklist

```bash
npm run quiz -- --count 15 --seed route3 --review-wrong
node examples/12-final-capstone/check.mjs examples/12-final-capstone/starter/capstone.workflow.yml.txt
```

Checklist: no active workflow copied; no credentials/deployments; write down every miss by objective; stop after the oral close.

## Answer or solution location

Use [`solution/capstone.workflow.yml.txt`](solution/capstone.workflow.yml.txt) and [`solution/decisions.md`](solution/decisions.md) only in the review window.

## Primary official links

- [Microsoft GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200)
- [GitHub Actions documentation](https://docs.github.com/actions)
- [Security hardening](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [Artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations)

