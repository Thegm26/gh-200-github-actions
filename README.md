# GH-200 GitHub Actions: 4h45 CLI Bootcamp

An intensive, hands-on review aligned to the **Microsoft GH-200 skills measured as of January 2026**. Technical claims link to [the official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and GitHub Docs; this repository contains no exam dumps.

## Start in exactly three commands

Prerequisites: Git, Node.js 20+, npm, a GitHub account/repository for optional workflow runs, and VS Code with the GitHub Actions extension.

```bash
npm install
code .
npm run check
```

Then run `npm run quiz -- --count 15 --seed gh200`, or open the lab README named by the current block below. The labs are safe locally: intentionally broken YAML is stored outside `.github/workflows` and cannot run.

## The 4h45 route (285 minutes)

Use a timer. At the end of every block, close the file and answer the prompt from memory before looking at the solution. That retrieval step and the alternating domains are deliberate learning strategy, not a technical source; see [Exam strategy](docs/EXAM_STRATEGY.md).

| Clock | Minutes | Do / retrieve |
| --- | ---: | --- |
| 00:00–00:10 | 10 | Read [blueprint](docs/BLUEPRINT.md); write the five domain weights from memory. |
| 00:10–00:35 | 25 | Lab 01, trigger/input/context tasks 1–2. |
| 00:35–00:55 | 20 | Lab 01, matrix/service/outputs tasks 3–5; explain `needs` versus `steps`. |
| 00:55–01:05 | 10 | Quiz: `--domain author-manage --count 8 --seed route1`; review misses. |
| 01:05–01:15 | 10 | Break: stand up, water, no scrolling. |
| 01:15–01:40 | 25 | Lab 02: inspect run evidence, matrix diagnosis, artifacts and templates. |
| 01:40–02:00 | 20 | Lab 03: implement/inspect composite, JavaScript, Docker action metadata. |
| 02:00–02:10 | 10 | Interleave: answer five Lab 01/02/03 hard scenarios without notes. |
| 02:10–02:20 | 10 | Break and write three confusing distinctions on paper. |
| 02:20–02:45 | 25 | Lab 04: policy, runner-group, IP-allow-list and secret-scope decisions. |
| 02:45–03:10 | 25 | Lab 04: hosted image/toolcache, REST secrets/variables and governance tasks. |
| 03:10–03:20 | 10 | Quiz: `--domain enterprise --count 10 --seed route2`; log weak objectives. |
| 03:20–03:30 | 10 | Break. |
| 03:30–03:55 | 25 | Lab 05: least privilege, injection, OIDC, immutable/pinned actions. |
| 03:55–04:15 | 20 | Lab 05: cache/retention and attestation verification. |
| 04:15–04:30 | 15 | Mixed quiz: `--count 15 --seed route3 --review-wrong`. |
| 04:30–04:40 | 10 | Read [last hour](docs/LAST_HOUR.md); use [cheat sheet](docs/CHEAT_SHEET.md) only after recalling. |
| 04:40–04:45 | 5 | Explain five distinctions aloud: starter/reusable/composite; artifact/cache; secret/variable; PAT/token/OIDC; SHA/tag. |

## Labs and quiz

Each `labs/0*/README.md` is a timed copy/edit/diagnose exercise. Copy the provided solution fragments into a scratch workflow or a test repository only after attempting the matching inactive starter. Run `npm run validate:content` to check curriculum integrity. Quiz flags: `--count N`, `--domain TAG`, `--seed TEXT`, `--review-wrong`, `--list-domains`, `--validate`.

## Emergency 3-hour compression

Spend 10 minutes on the blueprint; 35 each on Labs 01, 04, and 05; 20 each on Labs 02 and 03; then take a 25-question seeded mixed quiz (15 minutes), review every miss (15 minutes), and use LAST_HOUR (10 minutes). Preserve two five-minute breaks. Do not skip enterprise or security: together they are 30–40% of the blueprint.

Primary sources: [GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200), [GitHub Actions documentation](https://docs.github.com/actions). Source roles and learning-method evidence are separated in [SOURCES.md](docs/SOURCES.md).
