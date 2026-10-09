# Session Handoff

## Practice simplification — active local record (2026-10-09 UTC)

- Removed the Practice **Review mistakes** control and correct/answered score line; the focus-area filter, question flow, retry, paging, keyboard behavior, answers, and exact **Source** links remain.
- Legacy saved `reviewWrong`/`reviewQueue` state now normalizes off during load, preventing an empty trapped practice view while preserving saved answers, filter, and safe index clamping.
- Fresh evidence: `/tmp/gh200-practice-no-review-browser.log` and `/tmp/gh200-practice-no-review-check.log` both exited 0. Canonical selected-tree fingerprint excluding this handoff: `5c80a2faa316dae4110623e8ff39d13d918fff95a6378575ba9210b01d2fb031` (317 files). A/B bounded independent reviews passed at 360/1440 including legacy-review migration. Published `main` commit: `83233d1`; Pages commit: `fcd54c75d99ee96995ce48c95d3021e06161d6bd`. Live app assets are byte-exact and a headless mobile Practice smoke passed filter-only UI and correct-answer flow. Pages job `37863209798` was still in progress at last check; completion is not claimed here.

## Practice and References refinement — current authoritative release record (2026-10-09 UTC)

- Scope/owner: `/root/reference_ui_redesign` owns the frozen Practice and References presentation refinement in `visual/web/app.js`, `visual/web/styles.css`, and browser coverage. The previously released roadmap baseline is `dcae1de` on `main`; Pages commit `4440f27` deployed successfully in job `37861054062`.
- Product contract: Practice has a spaced filter and review control, with muted score on its own row; question metadata has real flex spacing; feedback renders inline code safely; source links read exactly **Source**. Filtering, review queues, keyboard selection, persistence, answer states, and paging are unchanged. References renders 16 catalog destinations as title links only—no badges, details, offline readers, download controls, cheat-sheet, or coverage blocks. Underlying catalog and offline data remain intact; external banks remain links only.
- Frozen canonical selected-tree fingerprint (handoff excluded): `0b5a3b509cbf73beea981db8cd8082257974e8f7959a5c69b27d5999f2358723` across 317 files. Protected `.practice/01-first-workflow/workflow.yml` remains SHA-256 `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.
- Fresh primary evidence: `/tmp/gh200-practice-fixed-primary-check.log`, `/tmp/gh200-practice-fixed-primary-browser.log`, and `/tmp/gh200-practice-fixed-primary-hands-on.log` all exited 0 (47 tests plus validators, browser regression, and hands-on 17/17). The exact-source Check handler and final responsive `@media` syntax were rechecked after their interim regressions. Screenshots: `/tmp/gh200-practice-final-{correct,refs}-{360,1440}.png`.
- Review status: A and B both passed exact-hash isolated, connected, and final-cohesion review. A inspected initial, wrong, correct, review-empty, and References states at 360/768/1440 and ran a fresh 12.827s zero-failure suite; B passed with fresh 13.3s browser evidence. Monitor freshness/scope passed and the final ledger is resolved.
- Release receipt: committed and pushed to `main` as `e5d3d39d22b0189b5873e8d8bce14b9a28ecb405`; visual `gh-pages` fast-forward is `6708625adbfd947eb938860a5152bdaa12a7415a`. Pages job `37861941529` succeeded. Live `index.html`, `web/app.js`, `web/styles.css`, and `web/course-runtime.js` are byte-exact to local. A headless live mobile smoke passed roadmap 17-branch Back, wrong/correct/retry, exact **Source**, reload persistence, and 16 references with obsolete controls absent, with zero errors; capture: `/tmp/gh200-published-reference-links.png`. No learner or CI workflow was dispatched. The `gh200-course` tmux server on 4173 was restarted after environment rotation.

## Reference-roadmap redesign — historical released record (2026-10-09 UTC)

- The published circles, lavender/cream palette, and stacked-card interpretation were explicitly rejected. `/root/reference_ui_redesign` owns a reference-led local visual replacement across `visual/` and the browser regression only; curriculum, runtime data, hands-on, workflows, package dependencies, commits, publication, CI, and learner jobs remain out of scope.
- Design direction: roadmap.sh-like light canvas and compact navy chrome; black-bordered yellow chapter rectangles, pale-yellow lesson rectangles, solid blue trunk lines, dotted blue branches, and generous intentional whitespace. One root map contains the fixed four-chapter trunk and all 17 direct lesson buttons; chapter headings are non-interactive and every lesson Back returns to the same map.
- Product contract: one root map holds four non-interactive chapter headings and all 17 direct lesson branches; no intermediate chapter menu or progress text exists. Incomplete nodes/headings are yellow; completed ones are green with a tick. Back returns to the originating branch, with context-safe focus and visibility on mobile. Unreachable legacy `stageView`/`selectStage` helpers are accepted nonblocking because no UI route reaches them.
- Canonical selected-tree fingerprint (handoff excluded): `e63135cc4cb50f1ddf6ee5406c35072acfcf9c749466d4746fc1c7e851270b09` across 317 files. Protected `.practice/01-first-workflow/workflow.yml` SHA-256 remains `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.
- Fresh primary gates passed: `/tmp/gh200-release-primary-check.log` (47 tests plus validators), `/tmp/gh200-release-primary-browser.log`, and `/tmp/gh200-release-primary-hands-on.log` (17/17). The browser suite covers SVG/mobile rendering distinctions, pairwise map non-overlap, all 17 mobile lesson/Back cycles, return focus, storage recovery, completion/invalidation color changes, quizzes, references, and downloads. Independent viewport-bound probes confirmed all returned mobile branches are visible with at least 11.59px bottom margin; this is independent evidence, not a suite assertion.
- Independent reviews are complete: A (`/root/reference_visual_review`) passed fresh exact-hash isolated, connected, and final-cohesion review; B (`/root/reference_integration_review`) passed fresh exact-hash isolated, connected, and cohesion review; the monitor independently confirmed scope, hash, and evidence. Current visual captures are `/tmp/gh200-rereview-root-{360,768,1440}-{initial,part,all}.png`.
- Release status: **READY**. Only the primary may commit, push, and make the Pages decision. No commit, push, deployment, CI dispatch, or learner job has occurred in this redesign record. All records below are historical and subordinate to this section.

## Bubble release gate — historical/superseded record (2026-10-09 UTC)

- Frozen canonical tree fingerprint is `02ecaa96e3ddf9ec40d3ca19e3c5fd3cef44700176de31cf31b57c8ca3644f19` across 317 selected files; this handoff is excluded. Protected `.practice/01-first-workflow/workflow.yml` remains SHA-256 `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.
- Primary fresh local evidence passed: 47 tests (30 main + 17 learning) in `/tmp/gh200-bubbles-primary-check.log`; browser regression in `/tmp/gh200-bubbles-primary-browser.log`; hands-on verifier 17/17 in `/tmp/gh200-bubbles-primary-hands-on.log`. The local `gh200-course` tmux server on port 4173 serves the corrected `visual/` route.
- Reviewers A and B both passed fresh isolated, connected, and aesthetic review against the canonical tree. B also passed final connected cohesion/polish across roadmap, topic, lesson, practice, and references; it exercised all 17 links/back routes at 360, 768, and 1440px with zero errors. The distinct `/root/bubble_release_monitor` independently passed source, fingerprint, capture, and primary-log freshness review. All local quality gates are resolved.
- Staged-diff audit found only the pre-existing accepted EOF blank-line difference in `_internal/examples/01-triggers-contexts/events.json`; its original content already has the same blank line. `playwright-interactive` was updated outside this repository and validated previously; no Codex configuration changed.
- Product and layout changes are committed and pushed to `main` as `38ecf82ca44578803e6758de5f84a13c2cf145b6` (`[skip ci]`). The visual-only `gh-pages` release `271f16c10429bdf586fe24d3bfa808a729f60359` is pushed and live at `https://thegm26.github.io/gh-200-github-actions/`; Pages reports built from `gh-pages/`, and the built-in `pages-build-deployment` completed successfully.
- Live fetches are byte-exact to local for `index.html`, `web/app.js`, `web/styles.css`, and `web/course-runtime.js`. A headless live-browser smoke passed root/topics, starter rejection, solution acceptance, mark-done auto-next, reload persistence, practice, references, and back navigation with zero errors; capture: `/tmp/gh200-published-roadmap.png`.
- No learner or CI run was created. The latest non-Pages run remains the historical CI run at `11910e9`; the only later deployment activity is the successful Pages build. The remaining primary action is to commit this receipt update with `[skip ci]`.
- All records below this section are historical/superseded where they conflict with this canonical fingerprint, current evidence, or gate status.

## Historical roadmap bubble correction record (superseded — 2026-10-09 UTC)

- The rejected stacked rectangle roadmap was replaced locally with a compact, centred vertical path of circular topic nodes in the required order: Foundations, Connect jobs, Reuse and debug, Secure delivery. Topic lesson maps use the same circle-and-line treatment, with no visible numeric counters, lesson badges, or connector arrows. Navigation, browser-local persistence, completion, and automatic next-lesson routing remain intact.
- Browser regression now asserts circle target size and shape, centred connector endpoints, containment, topic order, omitted visible numeric counters, every topic/back route, and existing all-lesson completion flows. Fresh headless evidence passed: `/tmp/gh200-roadmap-bubble-check.log` (`npm run check`) and `/tmp/gh200-roadmap-bubble-browser.log` (`GH200_BROWSER_EXECUTABLE=/opt/brave.com/brave/brave npm run test:browser`); root/topic captures at `/tmp/gh200-roadmap-{root,topic}-{360,768,1440}.png` were reviewed. Independent Sol re-review is pending. No commit, push, publication, GUI launch, configuration, or remote action occurred in this correction.

## UI finish — historical record (2026-10-09 UTC)

- Owner `/root/ui_finish` completed the bounded visual/hands-on correction. No commit, push, Pages publication, Actions dispatch, GUI launch, or Codex configuration change occurred.
- Lesson layout keeps Learn / editor / goal as three desktop columns, with the editor dominant (440px minimum), all feedback/hints/completion controls nested in the editor column, nowrap YAML with editor scrolling, and a two-column tablet fallback. The lesson parent now expands with its wide main content; grid-child and header containment is asserted at 360, 700, 720, 740, 760, 768, 1024, 1180, 1200, and 1440px. The grid becomes single-column through 740px, preventing its two-column minimum tracks from overflowing. Lesson-only header spacing is compact so the desktop editor begins at 263px with a 32px heading. Fresh lesson captures are `/tmp/gh200-ui-finish-lesson-{360,1440}.png`; all current captures have no horizontal overflow. At 1440px the filter select, review toggle, and quiet count share one aligned control row.
- Practice keeps all 86 questions and the existing accessibility semantics. Initial **Check answer** and first-question **Previous** are both semantically and visually disabled; regression coverage asserts those states.
- Hands-on case 08 now repairs the Python socket target (`6380` to `6379`) while preserving the correct `6379:6379` mapping, adds the explicit Redis health option, and sends real CRLF bytes. The Node-only semantic regression evaluates the restricted bytes literal as `50494e470d0a`; it adds no Python dependency. Case 17 now returns only to the hands-on setup route.
- Fresh local evidence: `/tmp/gh200-ui-finish-check.log` (`npm run check`, 17 tests plus learning/content/reference/workflow validation), `/tmp/gh200-ui-finish-hands-on.log` (`17/17`), `/tmp/gh200-ui-finish-browser.log` (file/HTTP/mobile/lessons/practice/references/downloads/storage and lesson containment), `/tmp/gh200-ui-finish-hands-on-test.log` (focused semantic suite), `/tmp/gh200-ui-finish-captures.log`, and `/tmp/gh200-ui-finish-lesson-captures.log`.
- Protected `.practice/01-first-workflow/workflow.yml` remains SHA-256 `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.
- Release status: the tree is frozen pending the two independent Sol UI reviews and the primary Pages release decision. Earlier review counts and pre-UI evidence are not final evidence for this tree.

## Layout simplification kickoff (historical — 2026-10-09 UTC)

- Acceptance/owner: `/root/simplify_layout` owns the coupled local layout migration: learner entry points become `visual/` and `hands-on/`; maintenance material moves under `_internal/`; `.github/` and protected root `.practice/` remain. Baseline is clean `b712e33`; release remains pending.
- Required evidence: preserve the `.practice/01-first-workflow/workflow.yml` SHA-256 `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`; inspect all live routes; run `npm run check`, `npm run test:browser`, and `npm run verify:hands-on` with logs under `/tmp/gh200-layout-*.log`.
- Policy: headless tests and captures are allowed; no GUI. Only the primary may commit, push, or publish Pages after reviews. Pages publication is newly authorized for the static `visual/` subtree, but no learner or CI dispatch is authorized.
- Release matrix: layout/navigation implementation is active; isolated and connected review, full evidence, final cohesion review, and primary release decision are pending.

### Layout implementation evidence (awaiting independent review)

| Acceptance surface | Evidence | Status |
| --- | --- | --- |
| Root shape | Root exposes `visual/`, `hands-on/`, `.github/`, conventional package/license files; all prior source trees are under `_internal/`; `.practice` untouched | pass |
| Two entry routes | Root README is 10 lines with only live Pages visual guidance and fork/VS Code hands-on guidance; visual lessons contain no hosted-repo links | pass |
| Static/browser route | `visual/` has relative self-contained assets and `.nojekyll`; `file://`, localhost `/`, and localhost `/gh-200-github-actions/` regression coverage pass | pass |
| Maintainer contracts | Package commands retain public names; Docker, CI checks, source imports, reference hashes, strict static allowlist, and inactive templates use moved paths | pass |
| Hands-on continuity | 17 templates verify unchanged/safe; concise setup and per-case back/next navigation remain rooted at `hands-on/` | pass |
| Release boundary | No commit, push, deploy, Pages configuration, learner dispatch, or CI dispatch by this owner; primary alone may publish `visual/` after gates | pending primary |

- Fresh local evidence: `/tmp/gh200-layout-check.log` (`npm run check`, 28 main + 16 learning tests and validators), `/tmp/gh200-layout-browser.log` (`GH200_BROWSER_EXECUTABLE=/opt/brave.com/brave/brave npm run test:browser`), `/tmp/gh200-layout-hands-on.log` (`npm run verify:hands-on`, 17/17), plus strict server smoke for `/`, `/web/app.js`, and `/gh-200-github-actions/` in `/tmp/gh200-layout-server.log`.
- Current selected-tree fingerprint: `3d6ea17a3ebfab556932471f4fdc26238d126aecb6833a5e785e0b959376be16` (315 files; `visual`, `hands-on`, `_internal`, `.github`, root package/license/Docker/README). Protected `.practice/01-first-workflow/workflow.yml` remains `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.

## Final local delivery record (current — 2026-10-09 UTC)

- Acceptance is locally complete: independent Sol reviewer `/root/delivery_review` passed entry-CI isolated and connected review, curriculum isolated and connected review, hosted isolated and connected review, and final cohesion/polish review. The final release gate is local-only; no GitHub Actions dispatch occurred and no hosted run result is claimed.
- Primary fresh evidence: `npm run check` passed 28 main plus 16 learning tests (44 total); all 17 starters reject, all 17 solutions pass, and all 17 mutations reject. Reference/catalog validation covers 16 entries, course/content covers 86 questions, workflow validation covers 3 workflows, and hands-on coverage is 4/4 with verifier coverage for all 17 canonical exercises.
- Evidence logs: `/tmp/gh200-final-delivery-check.log` and `/tmp/gh200-final-delivery-browser.log`. Browser regression passed file/HTTP/mobile/lessons/practice/references/downloads/storage; fresh 360px and 1440px screenshots at `/tmp/gh200-delivery-360.png` and `/tmp/gh200-delivery-1440.png` received primary visual review with no overflow.
- Current-tree fingerprint: `f752d236d387a3c7d58922f086273b83d74a24423a500f699464f3207b8d8898` across 207 explicitly selected files (web, learning, exercises, hands-on, quiz, scripts, test, references, README, index, GitHub/package files, and current user docs). This handoff and the question ledger are excluded by selection. Protected `.practice/01-first-workflow/workflow.yml` remains `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.

```sh
python3 /home/gm26/.codex/skills/review-driven-delivery/scripts/tree_fingerprint.py /home/gm26/gh-200-github-actions --include web --include learning --include exercises --include hands-on --include quiz --include scripts --include test --include references --include README.md --include index.html --include .github --include package.json --include package-lock.json --include docs/START_HERE.md --include docs/BLUEPRINT.md --include docs/EXTRA_EXERCISES.md
```
- Ownership: `hosted_finish` owns final hands-on, verifier, and tests; `quiz_finish` owns quiz repair and ledger; `curriculum_depth` owns entry-CI. All learner templates remain inactive. Exercise 03 is opt-in push to a specific branch; Exercise 14 demonstrates job OIDC permission presence only, with no token request or cloud exchange; Exercises 12, 13, and 15 are safe policy models.
- External question banks remain links only: GHCertified is linked, ExamTopics marketing is unverified, and neither is imported, scraped, or an answer authority. Final evidence monitor `/root/delivery_monitor` independently confirmed the source fingerprint, fresh local gates, unchanged protected practice file, and release constraints. The prior authorization permits the primary alone to commit and push `main` with `[skip ci]`; this avoids Actions execution under the verified official skipping mechanism.

## Archived hosted fork-to-fix entry mode (2026-10-09 UTC)

- Entry mode now exposes two deliberately separate learner routes: the offline `file://` browser course requires no account or install; the optional hosted route asks the learner to fork their own repository, clone it, open it with `code .`, and follow `hands-on/README.md` plus the matching `hands-on/<id>/README.md`.
- Every browser lesson contains a secondary **Work in VS Code** link to the upstream `main` guide. The link is intentionally external, opens in a new tab with `noreferrer`, and remains inert/offline-safe until the learner chooses it.
- `ci.yml` guards all three jobs (`test`, `risk`, `integration`) with `github.repository == 'Thegm26/gh-200-github-actions' || github.event_name == 'workflow_dispatch'`. Upstream push/PR automation remains intact. A fork push can show a skipped CI entry but executes no maintainer jobs; learner lab templates are copied into the fork and started manually from its default branch.
- `scripts/verify-workflows.mjs` and runtime mutation coverage enumerate every CI job and enforce that exact guard; `npm run verify:hands-on` is exposed and `test:learning` includes the hands-on suite. Ownership is bounded: `entry_mode` owns this entry route/guard/browser coverage, `hosted_labs` owns `hands-on/**` and its verifier/tests, and `curriculum_depth` owns quiz/drills/references. No GitHub dispatch, push, commit, cloud configuration, or hosted-run observation was performed by agents. Runtime outcomes are local validation evidence only; expected hosted outcomes in learner material are not observed evidence.
- Local evidence for this component: `npm run build:course`, `npm run verify:hands-on`, `npm run validate:workflows`, `node --test test/runtime/workflows.test.js`, and browser regression with the supplied Chromium executable passed. Full integration/review/release gates remain pending with the primary.

## Archived hosted fork-to-fix planning record (2026-10-08 UTC)

- User-approved objective: extend the existing offline browser practice library with a complete hands-on learner path: fork the repository, open in VS Code, make a real workflow failure in GitHub Actions, inspect logs, fix it, and confirm a new successful run. This runs alongside—not instead of—the current browser experience. Add deeper objective-aligned drills and plausible quiz distractors.
- Current baseline: `HEAD` is `11910e9`. Preserve existing user-owned dirty toolbar-cleanup work in `web/app.js`, `web/styles.css`, and `test/browser/ui-regression.mjs`; do not overwrite or claim it. Preserve `.practice/01-first-workflow/workflow.yml` SHA-256 `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.
- Historical safety/ownership note: learner workflows remain inactive outside `.github/workflows` until a learner opts in. `hosted_labs` owns hands-on material and its verifier/tests; `curriculum_depth` owns quiz/drills/references; `entry_mode` owns the top-level/browser route, CI guard, and focused tests; the primary owns integration and final verification. This record is not a claim of hosted execution.

| Acceptance surface | Required observable gate |
|---|---|
| All 17 canonical exercises | Each maps to a hosted case, or documents an explicit privilege/platform limit plus a working safe alternative. |
| Hosted failure/fix truth | Broken and fixed paths have runtime-evidence assertions; a static checker alone must not be presented as hosted-runtime proof. |
| Learner route | Documentation covers fork, VS Code edit, default branch, manual run, logs, fix, new run, and cleanup. |
| Browser continuity | Every lesson exposes an entry into the hosted learning mode while retaining browser practice. |
| Fork CI safety | A maintainer guard proves every job is upstream-only or `workflow_dispatch`; fork pushes execute no jobs (skipped run entries are acceptable and documented), while upstream automatic CI is unchanged. |
| Curriculum depth | Drills match their learning objectives; quiz distractors represent plausible misconceptions. |
| Delivery gate | Full local tests, browser regression, independent isolated/connected reviews, and final cohesion review pass. Live hosted validation remains intentionally not performed. |

### Resume order

1. Preserve the stated dirty toolbar files and protected practice hash; inspect bounded changes only.
2. Complete the three owned components, keeping all learner workflows inactive outside `.github/workflows` until opt-in.
3. Run focused checks, then full local and browser suites; primary integrates without push/remote execution.
4. Obtain the required independent Sol monitor and isolated/connected/final cohesion reviews before any later commit decision.

## Archived visual practice-library app record (2026-10-08 UTC)

- Objective: add a clickable, offline `file://` practice library with all 17 canonical exercises, readable YAML editing, local browser checks, explanations, quiz questions, primary/secondary references, cheat-sheet and coverage views, progress persistence, and an optional localhost server. The primary start path is opening `index.html`; learners must not need `npm install`, a CDN, `fetch`, or browser ESM support.
- Ownership: `/root/visual_engine` completed the runtime contract, bundle/build verification, and browser-engine tests; `/root/source_curriculum` completed the frozen catalog, local reference content, coverage, and quiz source questions; `/root/practice_library_ui` completed `index.html`, `web/app.js`, and `web/styles.css`. The primary owns final review, commit, and push coordination.
- Stable browser contract: `window.GH200Course = { lessons, check, questions, references, cheatSheet, coverage }`. `lessons` retains ordered exercise records and `check(id, source)` returns `{ passed, errors }`; questions retain quiz fields; references retain catalog fields plus embedded local `content`; cheatSheet and coverage are `{ title, content }`. Stages are Foundations (01–04), Connect jobs (05–08), Reuse and debug (09–11), and Secure delivery (12–17).
- Content must derive from immutable `learning/starters`, `learning/solutions`, exercise READMEs, and manifest metadata—not mutable `exercises/*` learner YAML. The shared YAML validation semantics live in browser-safe `scripts/learning-checks.mjs` and are consumed by the Node learning library and generated browser runtime.
- Required gates: reproducible `npm run build:course`, non-rewriting `npm run verify:course`, check parity for all starter/solution/mutation cases, source/reference integrity, legacy tests, browser regression, and `npm run check` including course verification. Generated runtime is tracked, bundled with a pinned maintainer dependency and license notice. Commit/push is authorized after validations; no deployment or hosting action is authorized.
- Evidence status: frozen source delivery contains 17 lessons, 86 original reviewed questions, 16 catalog entries, 53 coverage rows, 4 pinned CC-BY source snapshots, and 10 supplemental drills. `/tmp/gh200-primary-final-check.log` records 27 main plus 12 learning tests passing, 17/17 starter rejection, 17/17 solution acceptance, 17/17 mutation rejection, and passing course/content/reference/workflow validators; `/tmp/gh200-primary-final-browser.log` records file/HTTP/mobile/lessons/practice/wrong-answer retry/keyboard/download/storage/offline PASS. All 86 isolated reviews passed (`/root/visual_review` for AM/CT/AA and `/root/quiz_review_b` for 31 EN/SO items); all connected curriculum/reference/UI-engine reviews passed, and Sol final connected cohesion passed on stable fingerprint `56f5d5000f6ad1fc8675b2d1bb5fb3366a13cb41a68113fec1336e83a5ec5bc8` (243 files; excludes `node_modules`, `.practice`, this handoff, question review, and helper defaults). Serious findings, including SO10's drill-10 matrix breadth/concurrency-cost mapping, are resolved. The primary independently verified eight replacement links through the web; the bulk link check received HTTP 429 and is incomplete, not passed. User chose to keep external question banks as links only: GHCertified is linked, ExamTopics marketing is unverified, neither is imported, and no actual past papers are claimed.

| Acceptance surface | Owner / observable gate |
|---|---|
| Intro, four stages, 17 connected clickable lesson boxes | UI `/root/practice_library_ui`; browser interaction test |
| Plain-language lesson title, summary, and explanation of what/why/task | Engine `/root/visual_engine`; complete `course-copy.mjs` guard and generated-course test |
| Per-lesson ordered edit instructions and plain completion condition | Engine `/root/visual_engine`; all-17 `courseInstructions`/`courseOutcomes` guard and browser-contract test |
| Test → mark done → Continue and per-lesson draft/progress restore | UI `/root/practice_library_ui`; browser interaction test |
| Offline `file://`, optional HTTP, no learner install | Engine `/root/visual_engine`; classic bundle and `serve-course.mjs` allowlist test |
| Validator parity and malformed YAML safety | Engine `/root/visual_engine`; starter/solution/mutation and browser bundle tests |
| Questions, catalog references, local reference text, cheat sheet, and blueprint coverage bundled offline | Source `/root/source_curriculum` + engine `/root/visual_engine`; content-integrity and generated-runtime tests |
| Practice library navigation and accessible reference/quiz/coverage views | UI `/root/practice_library_ui`; browser interaction regression |
| Integration, release decision, local commit/push after gates | Primary `/root`; no hosting action |
| Acceptance monitor | Sol `/root/visual_monitor`; evidence-only |

- Local release gates are both `npm run check` and the separately provisioned `npm run test:browser`; browser Chromium is intentionally not added to `npm run check` because CI does not provision it. The engine bundles catalog metadata transparently, including `category`, `access`, `contentType`, `license`, `retrievedAt`, `version`, and normalized `sourceVersion`.
- Baseline `463aa70` and the protected `.practice` SHA remain unchanged. The tree is ready for release processing, pending the primary monitor, Git identity/diff check, authorized commit/push, and remote CI; it is not already released. No deployment is authorized.
- Final Sol milestone monitor `/root/source_milestone_monitor` reports readiness PASS with no serious drift. Its accepted minor is the blank EOF byte in `references/snapshots/reusing-workflow-configurations.md`, preserved as an exact raw upstream snapshot; the staged diff excluding raw snapshots is clean. Product scope and fingerprint remain unchanged by these metadata updates.

## Archived direct-exercise correction (2026-10-08 UTC)

- Current learner path: open an `exercises/<id>/README.md`, edit its adjacent `workflow.yml` or `action.yml`, then run that folder's direct `node exercises/<id>/check.mjs`. No timer, doctor, workspace-manager, start, reset, or learner-CLI step is required or promoted. Existing compatibility commands and their safety coverage remain intact.
- The 17 check wrappers are formatted and readable. Checkers inspect only the adjacent exercise directory; they do not overwrite a learner file or grade cosmetic YAML formatting. SHA-pin validation accepts only the documented approved checkout SHA and rejects an all-zero 40-character value.
- Maintainer regression: a temporary mirror copies the immutable starters, writes only inside the mirror, creates `node_modules` as a directory (directory symlink on POSIX; Windows junction with copy fallback), verifies every starter is red and every solved exercise is green, and includes a hand-written valid Exercise 01 solution independent of fixtures.
- Final local evidence: `npm run check` passed 24 main plus 8 learning tests and `npm run verify:learning` confirmed 17/17 starters reject, 17/17 solutions pass, and 17/17 mutations reject (`/tmp/gh200-direct-final.log`). The full primary-link gate passed with 94 links (`/tmp/gh200-direct-final-links.log`).
- Baseline: `463aa70` with green CI run `37835997576`. Preserve `.practice/01-first-workflow/workflow.yml` hash `406479bd330fc144bc86081d4d984de87f14696e474ce24906f23522dd718435`.
- Stable current-tree fingerprint: `c384a988ec290237dc2c20eac041e60ee9a78353fa967995bd0a1ddd635cf0d2` (216 files; excludes `node_modules`, `.practice`, this handoff, and helper defaults).
- Owner: `/root/finish_direct` (Terra) completed the bounded correction. Reviewer: independent Sol `/root/direct_review` passed isolated, connected, and final-cohesion review after the corrected tree and full check, including solved Exercise 01 in a safe mirror. Monitor: independent Sol `/root/direct_monitor` passed acceptance, scope, and evidence review. Source was unchanged after those gates.
- The primary is authorized to commit, push, and confirm the newly triggered CI run. New CI is pending; do not call this dirty tree remotely validated until that run is green.

### Archived historical record

Everything from **Objective and constraints** onward is pre-refactor historical release/session evidence only. Its owners, timers, reviews, baseline `06edcf0`, and remote CI results do not describe the current dirty integrated tree or supersede the current section above.

## Objective and constraints

- Objective: Build a highly intensive 4–5 hour hands-on GH-200 GitHub Actions exam-prep repository, aligned to the January 2026 Microsoft blueprint. It includes a small runnable microservice, real workflows/actions, deliberate broken labs, hard scenario questions with explanations, a CLI study flow, and direct-study numbered examples for the entire 4.5-hour route.
- User/product constraints: Exam is in about 24 hours; use CLI/VS Code; prioritize practical, difficult work without a slow one-question chat loop. The user clarified that the repository's purpose is direct study and requested examples folders for the whole 4.5-hour roadmap. Integrate official Microsoft/GitHub guidance and clearly label any reputable study-strategy or exam-experience takeaways.
- Project instructions read: `/home/gm26/AGENTS.md`; `review-driven-delivery` session-handoff template. Requirements monitor has pinned the official Microsoft GH-200 study guide: skills measured January 2026; page last updated 2026-02-05; <https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200>.
- Authorization limits (Git/release/external/GUI): Local edits, tests, commit, and push to `origin/main` are authorized. No releases, deployments, account-setting mutations, or GUI/mouse use. A GitHub Actions run caused by the authorized push is expected.
- Configured Git/build/export/package gate: Current branch `main`; pushed commits `42de98c` and `5c571a0` exist and `origin` is configured. Required identity: `Thegm26 <georgios.michalakis26@gmail.com>`. `npm run check` is the full local gate.
- Visual-evidence policy (allowed capture or data-only limitation): Data-only; screenshots are not required.
- Runtime/PlayMode test policy and fallback: Run local headless Node tests and CLI checks, then inspect the GitHub Actions result after push. No PlayMode/Unity work applies.

## Current milestone

- State: `green remote baseline; runtime/security and curriculum corrections dirty; not release-ready`.
- Baseline: `HEAD` and `origin/main` are both `06edcf0782ba29f68e81cdaad04af282e827c297`.
- Live evidence: GitHub Actions run `37137253358` at that exact SHA completed successfully: Node 20 Ubuntu, Node 22 Ubuntu, Node 20 Windows, reusable-risk, and integration (service container, artifact upload/download, smoke test, composite summary) all passed.
- Immediate next action: Merge the current correction evidence into this ledger, obtain fresh required reviews, commit and push the authorized changes, then watch the new CI run.
- Stop/block condition: Do not claim current dirty corrections have remote evidence or that the repository is release-ready until the post-correction commit has a successful live run and fresh connected reviews.
- Milestone monitor/model/status: `/root/requirements_monitor` (gpt-5.6-sol) initially reported NOT LOCKED because assignments and acceptance checks were absent. Those ownership and acceptance-ledger gaps were addressed during implementation and this handoff update.

## Ownership and dependencies

| Component | Owner/model | Bounded paths | Dependencies/integration owner | Status |
|---|---|---|---|---|
| App/runtime + live workflows/custom actions | `/root/runtime_workflows` (gpt-5.6-terra) | `package.json`, `package-lock.json`, `src/**`, `test/runtime/**`, `Dockerfile`, `.dockerignore`, `.gitignore`, `.github/workflows/**`, `.github/actions/**`, `scripts/verify-workflows.mjs` | Owns shared command/workflow contracts; integrates with curriculum examples | Completed |
| Curriculum/labs/question bank/CLI quiz | `/root/curriculum_quiz` (gpt-5.6-terra) | `README.md`, `docs/**` except `docs/SESSION_HANDOFF.md`, `labs/**`, `quiz/**`, `scripts/quiz.mjs`, `scripts/validate-content.mjs`, `test/curriculum/**`, `LICENSE` | Consumes runtime contracts; owns corrections in its bounded paths | Completed |
| Shared command/workflow contracts | `/root/runtime_workflows` (gpt-5.6-terra) | Within runtime owner's bounded paths | Primary coordinates only; curriculum owner corrects its own paths | Completed |
| Full-route numbered examples | `/root/roadmap_examples` (gpt-5.6-terra) | `examples/**`, `README.md`, related content validation/tests within its assigned paths | Extends the existing route and curriculum contracts | Completed |
| Runtime/security correction | Terra | Runtime action/workflow/server/validation paths currently dirty | Corrects review findings after the green baseline | Local correction complete; no commit or remote evidence yet |
| Curriculum correction | Terra | Curriculum/study paths | Corrects independent curriculum-review findings | Active; not yet reviewed |
| Handoff ledger | `/root/release_handoff` (gpt-5.6-terra) | `docs/SESSION_HANDOFF.md` only | Records assignments, evidence, and gates; no implementation ownership | Completed |
| Milestone/component/final reviews | Sol (evidence-only) | No edits | Reviews current source, diff, and fresh evidence | Runtime, curriculum, and final reviews attempted; unavailable due account usage limit |

## Decisions and dirty state

- Key decisions/contracts: Technical truth sources are the Microsoft GH-200 study-guide skills measured January 2026 (official guide last updated 2026-02-05 at the pinned URL above) and GitHub Docs. Secondary preparation sources may inform emphasis only and must be labeled as secondary; learning-strategy or exam-experience guidance must disclose its primary-vs-secondary status. Intentionally broken YAML must remain inactive and safe. Labs must span all five blueprint domains, including enterprise concepts. The question bank target is at least 60 questions, with approximate official domain weighting and minimum per-domain targets of 15/11/11/15/8 (domains 1–5).
- Existing uncommitted work and ownership: Runtime/security correction is dirty in action/workflow/server/test/validator paths. It uses a safe environment bridge for the composite-action input, returns JSON `413` for oversized requests, removes unused active permissions and `run_extended`, and makes matrix artifacts unique with assertions. A separate Terra curriculum correction is active. Preserve both; do not overwrite concurrent work.
- Current branch/commit/remote divergence: `main` and `origin/main` match at `06edcf0782ba29f68e81cdaad04af282e827c297`; current working tree contains uncommitted corrections with no remote evidence.
- CI history retained: `42de98c` triggered failed run `37128468279` (invalid setup-node SHA and local JS-action input/runtime). `5c571a0` triggered run `37137057810` (Node 22 Ubuntu failed because `node --test test` was not portable; Node 20 Ubuntu/Windows passed; integration skipped). The subsequent correction reached green run `37137253358` at `06edcf0`.
- Selected source paths and source fingerprint: Current runtime/security correction fingerprint: `a34e865b09f8e43ab97d6b8d28eccbea7a7086592ec329555b781d7b5a6b4271`.
- Mirror path/fingerprint/equality result (if used): No mirror used.
- Post-test source fingerprint/equality result: No post-test fingerprint/equality result recorded.

## Acceptance and evidence

| Requirement | Evidence/command | Source fingerprint/result/artifact path | Fresh for current tree? | Gate |
|---|---|---|---|---|
| Clean VS Code opening; README exact start command and 4.5-hour route | Content validation | README has 18 blocks totaling 285 minutes; every active block links to an example | Yes, local | Local evidence complete |
| Runnable microservice and tests | Local headless Node tests | Runtime/security focused checks passed 8/8; full checks passed 16/16 at fingerprint `a34e865b09f8e43ab97d6b8d28eccbea7a7086592ec329555b781d7b5a6b4271` | Yes, local; current dirty runtime tree | Local evidence complete; remote evidence pending |
| Active workflows: CI, matrix, cache, artifacts, service container, outputs/job summary, reusable workflow, custom action, security permissions | Workflow validation and live run | Run `37137253358` at `06edcf0` passed all five jobs (Node20 Ubuntu, Node22 Ubuntu, Node20 Windows, reusable risk, integration) | Yes for committed baseline | Green baseline; current dirty correction needs new live evidence |
| Labs cover five blueprint domains and enterprise concepts | Content validation | Full content validation reported 5 labs | Yes, local | Local evidence complete |
| ≥60 hard scenario questions with explanations and domain tags, weighted approximately to official ranges | Content validation | Full content validation reported 60 questions | Yes, local | Local evidence complete |
| CLI quiz filters, counts, and scores | Quiz validation and domain listing | `quiz --validate` and `quiz --list-domains` passed | Yes, local | Local evidence complete |
| Broken challenge material is safe and inactive | Content/workflow validation | Broken and credential examples are inactive `.txt`; content validation reported inactive YAML and workflow validation reported 3 active workflows | Yes, local | Local evidence complete |
| Technical content traceable to primary sources | Content validation | `npm run check` content validation passed | Yes, local | Local evidence complete |
| Learning-strategy/exam-experience guidance clearly distinguishes primary from secondary material | Content validation | `npm run check` content validation passed | Yes, local | Local evidence complete |
| Official Microsoft guide version is pinned and traceable | Content validation | `npm run check` content validation passed | Yes, local | Local evidence complete |
| Minute-by-minute route is complete, totals 4h45, and maps exercises to route segments | Content validation and README audit | 18 blocks total 285 minutes; every active block links to one of 13 numbered modules (`00`–`12`) | Yes, local | Local evidence complete |
| Direct-study examples cover the entire route and requested GH-200 areas | Module content audit | 13 modules each include timing, objective/domain, files/tasks, observable result, verification, separated solution, and official links; starter exercises intentionally retain TODO/incomplete states until learner edits | Yes, local | Local evidence complete |
| Focused/full runtime checks | Recorded commands and results | Focused 8/8 and full 16/16 passed for the current runtime/security correction at fingerprint `a34e865b09f8e43ab97d6b8d28eccbea7a7086592ec329555b781d7b5a6b4271` | Yes, local | Fresh connected review and live run pending |
| Authorized push verified | Commit/run evidence and Actions result | `06edcf0`/run `37137253358` passed all jobs. Current corrections are not committed or pushed | Yes for baseline only | Pending for dirty corrections |

## Reviews and corrections

| Scope | Reviewer/model | Isolated pass | Connected pass | Findings/severity | Correction/fresh re-review |
|---|---|---|---|---|---|
| Runtime/workflows/custom actions | Sol (independent reviewer) | PASS | FAIL only because this handoff was stale | Original findings corrected locally: composite input shell injection, oversized request handling (must return JSON `413`), unused active OIDC/attestation permissions, unused `run_extended`, and matrix artifact overwrite/assertions | Refresh handoff, then fresh connected review after final correction |
| Curriculum/labs/questions/CLI | Sol (independent reviewer) | FAIL | FAIL | Six serious defects: all quiz answers option A; invalid `run-defaults` solution; service containers combined with a Windows matrix; official links returning 404; capstone timing/solution inconsistent with tasks; 3-hour compression schedule over-allocates. Minors: custom-action verifier can falsely pass incomplete work; inactive security solution teaches unused broad permissions. | Terra curriculum correction active; needs fresh isolated and connected review |
| Repository integration | Sol (independent reviewer) | Not recorded | Not recorded | No independent integration review produced | Pending independent review |
| Final cohesion/polish | Sol (independent reviewer) | Attempted; unavailable | Attempted; unavailable | Account usage limit; no review produced | Pending independent review |
| First live CI failure and correction | `/root/ci_correction` (gpt-5.6-terra) | Local validation passed | Partially validated by run `37137057810` | Run `37128468279` failed on invalid `setup-node` SHA and local JS-action input/runtime. Correction pins checkout v6.1.0 (`d23441...`), setup-node v6.5.0 (`249970...`), uses node24 and underscore-safe `sample_size`, and adds regression test/validator; the next run reached pinned actions and fixed the local JS action | Second correction is required for the Node22 test invocation |
| Second live CI failure and correction | `/root/ci_correction` (gpt-5.6-terra) | Local checks passed | Live PASS | Run `37137057810` on Node 22.23.3 Ubuntu treated `node --test test` as a missing module. The portable explicit-file correction led to run `37137253358` at `06edcf0`, which passed all jobs. | Complete |

## Pending gates and release

- Required focused/full tests: Current runtime/security focused checks 8/8 and full checks 16/16 passed at the recorded fingerprint. Run `git diff --check` after integrating all current changes. Curriculum correction must run its affected content/quiz checks plus full checks.
- Required reviews: Runtime isolated re-review passed; its connected review must be rerun now that this handoff is current. Curriculum has six serious and two minor findings requiring Terra correction, then fresh Sol isolated and connected review. Final connected cohesion/polish review remains required.
- Required milestone monitor reports: Initial independent Sol requirements monitor completed; its ownership and acceptance gaps were addressed. Further independent review reports are unavailable as noted above.
- Git constraints, identity, intended files, excluded artifacts: Verify author and committer identity before commit; user explicitly authorized commit and push to `origin/main`. Do not claim the current dirty runtime/security or curriculum corrections have remote evidence before a newly triggered run succeeds.
- Build/export/editor constraints: Headless local Node/CLI validation; VS Code-ready repository; no GUI/mouse; no deployment or release.

## Recovery notes

- Interrupted agents/work preserved: Runtime, curriculum, roadmap-examples, and CI-correction owners completed their assigned local work; no interruption is recorded.
- Exact commands to resume: `cd /home/gm26/gh-200-github-actions`; inspect current diffs and this handoff; wait for/merge the active Terra curriculum correction; run `git diff --check`, affected tests, and full checks; obtain fresh connected reviews; verify Git identity; commit/push authorized changes; watch the newly triggered CI.
- Known risks/blockers: The committed baseline is green, but the current runtime/security correction has local-only evidence and the curriculum has six serious review findings under active correction. No current dirty correction has remote evidence. Final connected cohesion/polish review and post-correction live CI remain gates.
