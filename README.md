# Learn GitHub Actions for GH-200

This is a beginner-first, local practice course for the [Microsoft GH-200 study guide (skills measured January 2026)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200). It teaches GitHub Actions through one small task at a time. It is not an exam dump and does not promise an exam result.

## Start here

The primary learning path needs only a modern browser. Clone this repository or download and unzip it, then open [index.html](index.html). It works offline, including from `file://`; no install, account, or server is needed. Your browser keeps lesson drafts and completed checks locally.

To clone it:

```bash
git clone https://github.com/Thegm26/gh-200-github-actions.git
cd gh-200-github-actions
```

For an optional local URL, Node.js 18+ can serve the same static course without installing packages:

```bash
node scripts/serve-course.mjs
# then open http://127.0.0.1:4173
```

The browser has three sections:

- **Learning path** — 17 connected lessons with a YAML editor, local feedback, and saved progress.
- **Practice questions** — 86 original questions with explanations, domain filtering, and an incorrect-answer review loop.
- **References** — 16 clearly labeled primary or secondary resources, offline notes/snapshots where supplied, the cheat sheet, blueprint coverage, and an **Exam practice resources** area. These resources are not released past exam papers.

The sections below describe the optional direct terminal exercises and maintainer checks.

## Hosted fork-to-fix mode (optional)

To practise real Actions behavior, use GitHub's [Fork button](https://github.com/Thegm26/gh-200-github-actions/fork) to create your own copy, clone that fork, open it in VS Code with `code .`, and follow [hands-on/README.md](hands-on/README.md). Each of the 17 shared templates stays inactive until you copy it into `.github/workflows` on your fork default branch. Follow the case-specific expected result: lab 01 has a missing trigger and lab 02 has invalid configuration, so GitHub can reject them before a job runs; other labs intentionally demonstrate a safe failure or safe hosted behavior. Make the stated repair where applicable, then confirm a **new** run at the new commit SHA. This is separate from the offline browser path and needs a GitHub account; expected hosted outcomes are instructions, not results observed by this repository.

Maintainer CI runs automatically only in `Thegm26/gh-200-github-actions`. Fork pushes can show skipped CI entries but execute no maintainer jobs; use the learner template's default-branch/manual-run route instead.

## Optional direct terminal exercise

The original adjacent-file route needs Node.js 18+ plus `npm install` once because its checker uses the YAML package. Open [Exercise 01 — Your first workflow](exercises/01-first-workflow/README.md), edit its YAML, and run:

```bash
node exercises/01-first-workflow/check.mjs
```

Each numbered folder is a small, safe local exercise: read its explanation, edit the named YAML file, run its `node exercises/.../check.mjs` command, then move to the linked next exercise. The check fails first on purpose and tells you what to change. It only reads that exercise folder; nothing is copied, reset, or sent to GitHub.

## Maintainer setup

Repository maintainers need Node.js 18+ and npm (Node 22+ recommended):

```bash
npm install
```

Run `npm run check` for the repository gate. The optional browser regression needs Chromium once on the maintainer machine:

```bash
npx playwright-core install chromium
npm run test:browser
```

Set `GH200_BROWSER_EXECUTABLE` to use an already-installed Chromium, or `GH200_PLAYWRIGHT_MODULE` to point at a compatible external Playwright module. Learners never need these tools.

## Course map

Open [START_HERE.md](docs/START_HERE.md) for vocabulary, platform notes, troubleshooting, and the safe GitHub sandbox option. [COURSE.md](docs/COURSE.md) is the progressive route with primary references; [BLUEPRINT.md](docs/BLUEPRINT.md) maps objective groups to practice evidence and names automatic, manual, and hosted-only limits. [EXTRA_EXERCISES.md](docs/EXTRA_EXERCISES.md) supplies small supplementary drills for advanced objectives outside the canonical 17 labs.

The older [`examples/`](examples) remain useful focused reference exercises and the [`labs/`](labs) indexes group them by domain. They are untimed. Each gives prerequisites, one scope, a success/failure expectation, a check, a retry path, a separated solution, and a next link.

## Readiness loop

1. Complete each exercise green at least once.
2. Open **Practice questions** in the browser, filter to a domain, then review missed answers and their official links. The CLI quiz (`npm run quiz -- --domain <tag> --count 8 --seed practice`) remains optional.
3. Record each missed objective, redo its linked lab without the solution, then answer the explanation in your own words.
4. Use [CHEAT_SHEET.md](docs/CHEAT_SHEET.md) for distinctions, not as a substitute for the exercise.
5. Reopen the relevant exercise README and redo its YAML without the solution.

This is an evidence-based study loop, not a guarantee of readiness or certification.

## Optional GitHub sandbox

The local course makes no GitHub changes. When you are ready to see a real run, follow the exact, non-production instructions in [the sandbox runbook](docs/START_HERE.md#optional-github-sandbox-runbook). Use a disposable repository, no secrets, and delete it when finished.

Technical sources: [GH-200 guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and [GitHub Actions documentation](https://docs.github.com/actions). [SOURCES.md](docs/SOURCES.md) explains source roles.
