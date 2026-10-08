# Learn GitHub Actions for GH-200

This is a beginner-first, local practice course for the [Microsoft GH-200 study guide (skills measured January 2026)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200). It teaches GitHub Actions through one small task at a time. It is not an exam dump and does not promise an exam result.

## Start here

Prerequisites: Git, Node.js 18+ and npm (Node 22+ is recommended). A GitHub account and `gh` CLI are optional until the GitHub sandbox runbook.

```bash
git clone https://github.com/Thegm26/gh-200-github-actions.git
cd gh-200-github-actions
npm install
```

Install once, then open [Exercise 01 — Your first workflow](exercises/01-first-workflow/README.md).

Each numbered folder is a small, safe local exercise: read its explanation, edit the named YAML file, run its `node exercises/.../check.mjs` command, then move to the linked next exercise. The check fails first on purpose and tells you what to change. It only reads that exercise folder; nothing is copied, reset, or sent to GitHub.

## Your first red → green exercise

Open [01 — Your first workflow](exercises/01-first-workflow/README.md). It explains manual triggers, names [workflow.yml](exercises/01-first-workflow/workflow.yml) as the only file to edit, and gives this check:

```bash
node exercises/01-first-workflow/check.mjs
```

After you have tried, compare with the separate immutable solution linked from that exercise. `npm run check` is for repository maintainers; your exercise check is the learning feedback.

## Course map

Open [START_HERE.md](docs/START_HERE.md) for vocabulary, platform notes, troubleshooting, and the safe GitHub sandbox option. [COURSE.md](docs/COURSE.md) is the progressive route with primary references; [BLUEPRINT.md](docs/BLUEPRINT.md) maps objective groups to practice evidence and names automatic, manual, and hosted-only limits. [EXTRA_EXERCISES.md](docs/EXTRA_EXERCISES.md) supplies small supplementary drills for advanced objectives outside the canonical 17 labs.

The older [`examples/`](examples) remain useful focused reference exercises and the [`labs/`](labs) indexes group them by domain. They are untimed. Each gives prerequisites, one scope, a success/failure expectation, a check, a retry path, a separated solution, and a next link.

## Readiness loop

1. Complete each exercise green at least once.
2. Run the seeded quizzes: `npm run quiz -- --domain <tag> --count 8 --seed practice`.
3. Record each missed objective, redo its linked lab without the solution, then answer the explanation in your own words.
4. Use [CHEAT_SHEET.md](docs/CHEAT_SHEET.md) for distinctions, not as a substitute for the exercise.
5. Reopen the relevant exercise README and redo its YAML without the solution.

This is an evidence-based study loop, not a guarantee of readiness or certification.

## Optional GitHub sandbox

The local course makes no GitHub changes. When you are ready to see a real run, follow the exact, non-production instructions in [the sandbox runbook](docs/START_HERE.md#optional-github-sandbox-runbook). Use a disposable repository, no secrets, and delete it when finished.

Technical sources: [GH-200 guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and [GitHub Actions documentation](https://docs.github.com/actions). [SOURCES.md](docs/SOURCES.md) explains source roles.
