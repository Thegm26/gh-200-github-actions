# GH-200 GitHub Actions: 4h45 CLI Bootcamp

An intensive, hands-on review aligned to the **Microsoft GH-200 skills measured as of January 2026**. Technical claims link to [the official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and GitHub Docs; this repository contains no exam dumps.

## Start in exactly three commands

Prerequisites: Git, Node.js 20+, npm, a GitHub account/repository for optional workflow runs, and VS Code with the GitHub Actions extension.

```bash
npm install
code .
npm run check
```

Then open [`examples/00-blueprint-recall`](examples/00-blueprint-recall/README.md) and follow the numbered tree in order. Every timed study block has concrete files to edit, expected results, local checks, separated solutions, and primary-source links. Intentionally broken or credential/publishing workflow examples use `.yml.txt` and cannot run as GitHub workflows.

## The 4h45 route (285 minutes)

Use a timer. At the end of every block, close the file and answer the prompt from memory before looking at the solution. That retrieval step and the alternating domains are deliberate learning strategy, not a technical source; see [Exam strategy](docs/EXAM_STRATEGY.md).

| Clock | Minutes | Do / retrieve |
| --- | ---: | --- |
| 00:00–00:10 | 10 | [00 blueprint recall](examples/00-blueprint-recall/README.md): write weights/objectives before checking. |
| 00:10–00:35 | 25 | [01 triggers and contexts](examples/01-triggers-contexts/README.md): typed dispatch, filters, expressions, safe contexts, anchors. |
| 00:35–00:55 | 20 | [02 outputs, matrix, services](examples/02-outputs-matrix-services/README.md): edit the inactive workflow and run the matrix check. |
| 00:55–01:05 | 10 | [03 author/manage retrieval](examples/03-author-manage-retrieval/README.md): seeded quiz plus free recall. |
| 01:05–01:15 | 10 | Break: stand up, water, no scrolling. |
| 01:15–01:40 | 25 | [04 consume/troubleshoot](examples/04-consume-troubleshoot/README.md): diagnose simulated run evidence and reuse choices. |
| 01:40–02:00 | 20 | [05 custom actions](examples/05-custom-actions/README.md): runnable local composite/JS work and safe Docker metadata. |
| 02:00–02:10 | 10 | [06 interleaved debugging](examples/06-interleaved-debugging/README.md): five cross-domain decisions without notes. |
| 02:10–02:20 | 10 | Break and write three confusing distinctions on paper. |
| 02:20–02:45 | 25 | [07 policy and runners](examples/07-enterprise-policy-runners/README.md): runner groups, hosted/self-hosted, allow policy, IP decisions. |
| 02:45–03:10 | 25 | [08 scopes and APIs](examples/08-enterprise-secrets-api/README.md): secrets/vars, retention endpoints, image migration. |
| 03:10–03:20 | 10 | [09 enterprise retrieval](examples/09-enterprise-retrieval/README.md): seeded quiz plus governance recall. |
| 03:20–03:30 | 10 | Break. |
| 03:30–03:55 | 25 | [10 security and identity](examples/10-security-identity/README.md): permissions, injection, OIDC, SHA pinning, environments. |
| 03:55–04:15 | 20 | [11 supply chain](examples/11-cache-artifacts-attestations/README.md): cache/artifact/package/retention and safe attestation simulation. |
| 04:15–04:30 | 15 | [12 final capstone](examples/12-final-capstone/README.md): mixed quiz plus repair the cross-domain workflow. |
| 04:30–04:40 | 10 | [12 solution review](examples/12-final-capstone/README.md#10-minute-review): inspect only misses, then targeted cheat-sheet recall. |
| 04:40–04:45 | 5 | [12 oral close](examples/12-final-capstone/README.md#5-minute-oral-close): explain five distinctions without notes. |

## Labs and quiz

The numbered `examples/` tree is the main 4h45 route. Each `labs/0*/README.md` is a domain index into those modules for targeted repetition. Run `npm run validate:content` to check route/module integrity. Quiz flags: `--count N`, `--domain TAG`, `--seed TEXT`, `--review-wrong`, `--list-domains`, `--validate`.

## Emergency 3-hour compression

Spend 10 minutes on [00](examples/00-blueprint-recall/README.md); 35 minutes each across [01–02](examples/01-triggers-contexts/README.md), [07–08](examples/07-enterprise-policy-runners/README.md), and [10–11](examples/10-security-identity/README.md); 20 minutes each on [04](examples/04-consume-troubleshoot/README.md) and [05](examples/05-custom-actions/README.md); then take a 25-question mixed quiz (15 minutes), review misses (15 minutes), and use [12](examples/12-final-capstone/README.md) for the close. Preserve two five-minute breaks.

Primary sources: [GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200), [GitHub Actions documentation](https://docs.github.com/actions). Source roles and learning-method evidence are separated in [SOURCES.md](docs/SOURCES.md).
