# 03 — author/manage retrieval checkpoint

## Prerequisites and focused goal

Complete examples 01–02. Retrieve workflow boundaries without opening their solutions.

## Objective and domain

Author and manage workflows: retrieve syntax and boundary rules, then use misses to select a small lab to repeat.

## Files to inspect or edit

- Write answers in `attempt.md` without opening prior modules.
- Run the seeded CLI quiz.
- Check `solution.md` afterward.

## Tasks

1. Run eight domain questions: `npm run quiz -- --domain author-manage --count 8 --seed route1`.
2. In `attempt.md`, write the full step → job → downstream-job output chain.
3. List the four matrix rows from Module 02 and distinguish `fail-fast` from `max-parallel`.
4. Explain branch-plus-path filter behavior and typed manual Boolean behavior.

## Expected observable result

Record every missed objective and repeat its canonical lab before retrying. A score is feedback, not readiness certification.

## Verification commands or checklist

```bash
npm run quiz -- --domain author-manage --count 8 --seed route1
```

Checklist: no notes during first attempt; explain each wrong distractor; record weak objective, not only score.

## Answer or solution location

Open [`solution.md`](solution.md) after the quiz.

## Primary official links

- [Microsoft GH-200 author/manage objectives](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200#skills-measured-as-of-january-2026)
- [Workflow syntax](https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions)
