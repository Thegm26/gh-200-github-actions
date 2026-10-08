# Learn GitHub Actions for GH-200

This is a beginner-first, local practice course for the [Microsoft GH-200 study guide (skills measured January 2026)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200). It teaches GitHub Actions through one small task at a time. It is not an exam dump and does not promise an exam result.

## Start here

Prerequisites: Git, Node.js 18+ and npm (Node 22+ is recommended). A GitHub account and `gh` CLI are optional until the GitHub sandbox runbook.

```bash
git clone https://github.com/Thegm26/gh-200-github-actions.git
cd gh-200-github-actions
npm install
npm run doctor
npm run learn -- list
```

`doctor` checks local prerequisites. `learn list` shows the available small labs and their GH-200 objective/domain. Start with the first lab:

```bash
npm run learn -- start 01-first-workflow
# edit .practice/01-first-workflow/workflow.yml
npm run learn -- check 01-first-workflow
```

Expected pattern: `start` reports the new `.practice/<id>` folder; `check` reports either specific fixes or a passing result. A failed check is the intended red step—read its message, edit the starter again, and rerun the same command. `start` never overwrites an existing workspace. To intentionally restart one lab:

```bash
npm run learn -- reset <id> --yes
npm run learn -- status
```

Use `npm run verify:learning` to verify the course engine. `npm run check` is repository-maintainer integrity validation (tests, content, and workflow contracts); it does **not** measure learner correctness or certify exam readiness.

## Your first red → green exercise

The start command above already created the workspace; do not run it again. First run `npm run learn -- check 01-first-workflow` to see the red result, then edit `.practice/01-first-workflow/workflow.yml`. Its `on: false` starter is deliberately red. Replace it with:

```yaml
on:
  workflow_dispatch: {}
```

Then run `npm run learn -- check 01-first-workflow`. This file is outside `.github/workflows`, so it cannot run by accident. Make one change at a time and recheck.

Only after a pass, compare your work with `learning/solutions/01-first-workflow/workflow.yml`. Do not copy a solution to make a checker pass: the checks inspect workflow structure and decisions, not an answer hash. If stuck, use the task-specific GitHub Docs link in the lab, then retry before viewing the solution.

## Course map

Open [START_HERE.md](docs/START_HERE.md) for vocabulary, platform notes, troubleshooting, and the safe GitHub sandbox option. [COURSE.md](docs/COURSE.md) is the progressive route with primary references; [BLUEPRINT.md](docs/BLUEPRINT.md) maps objective groups to practice evidence and names automatic, manual, and hosted-only limits. [EXTRA_EXERCISES.md](docs/EXTRA_EXERCISES.md) supplies small supplementary drills for advanced objectives outside the canonical 17 labs.

The older [`examples/`](examples) remain useful focused reference exercises and the [`labs/`](labs) indexes group them by domain. They are untimed. Each gives prerequisites, one scope, a success/failure expectation, a check, a retry path, a separated solution, and a next link.

## Readiness loop

1. Complete each learning lab green at least once.
2. Run the seeded quizzes: `npm run quiz -- --domain <tag> --count 8 --seed practice`.
3. Record each missed objective, redo its linked lab without the solution, then answer the explanation in your own words.
4. Use [CHEAT_SHEET.md](docs/CHEAT_SHEET.md) for distinctions, not as a substitute for the exercise.
5. Re-run `npm run learn -- status` and repeat only unfinished or missed-topic labs.

This is an evidence-based study loop, not a guarantee of readiness or certification.

## Optional GitHub sandbox

The local course makes no GitHub changes. When you are ready to see a real run, follow the exact, non-production instructions in [the sandbox runbook](docs/START_HERE.md#optional-github-sandbox-runbook). Use a disposable repository, no secrets, and delete it when finished.

Technical sources: [GH-200 guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and [GitHub Actions documentation](https://docs.github.com/actions). [SOURCES.md](docs/SOURCES.md) explains source roles.
