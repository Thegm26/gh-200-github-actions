# Question review ledger

Every item is original practice content. Its exact primary source URLs live with the item in [`quiz/questions.json`](../quiz/questions.json); the catalog and objective mapping are in [`references/catalog.json`](../references/catalog.json) and [`references/coverage.json`](../references/coverage.json). Commercial resources are never answer authorities.

## Current final semantic review — 2026-10-09 UTC

Independent Sol review passed the semantic isolated and connected gates for all 86 questions after the cumulative distractor and bounded ambiguity corrections. This records question quality only; it does not claim hosted execution. GHCertified remains link-only, ExamTopics marketing remains unverified, and neither resource was imported, scraped, or used as an answer authority.

## Archived earlier review record

| Reviewed IDs | Scope checked | Status at this revision |
| --- | --- | --- |
| AM01–AM24, CT01–CT16, AA01–AA15 | Independent reviewer A (`/root/visual_review`) checked every author/manage, consume/troubleshoot, and author/actions item (55 IDs): stem, answer, explanation, and primary-source alignment. | **Isolated PASS and connected PASS.** Corrections to AM07, AM13, CT07, CT11, AA05, AM17, CT16, and AA13–AA15 were rechecked against the final mapping and sources. |
| EN01–EN19, SO01–SO12 | Independent reviewer B (`/root/quiz_review_b`, 31 IDs) checked every enterprise and secure/optimize item: semantics, answer, explanation, and primary-source alignment. | **Isolated PASS and connected PASS.** Corrections to EN09, EN14, EN18–EN19, SO07, SO09, SO10, and SO12 were rechecked against the final mapping and sources. |

The connected review found curriculum-mapping defects rather than question-answer defects: AM12 needed a real editor-tooling drill; AA02 and AA04 needed to point at the custom-actions Tasks 1, 2, and 5; SO10 needed the matrix breadth/concurrency-cost drill and accurate runner-minute model; and snapshot attribution had to live in the catalog/SOURCES rather than the byte-exact raw files. Those corrections are applied and all connected curriculum, reference, and UI-engine reviews now pass. Evidence is recorded in `/tmp/gh200-primary-final-check.log` and the final connected cohesion review on fingerprint `56f5d5000f6ad1fc8675b2d1bb5fb3366a13cb41a68113fec1336e83a5ec5bc8`.

The offline bank contains 86 original reviewed questions. GHCertified is linked only; ExamTopics marketing is unverified and neither source is imported, scraped, or used as an answer authority. This course does not claim to contain actual past exam papers. The ledger records review state rather than claiming an exam-writing authority.

## Archived curriculum-depth audit — 2026-10-08

All 86 items were read again as learner-facing scenarios, with the answer index, domain, objective, and primary URL retained. This is an implementer audit. The subsequent independent Sol review found category-mismatch distractors, which were corrected and later passed the final semantic isolated and connected review recorded above. The structural quiz test cannot judge whether a distractor is plausible and is intentionally named only for what it checks: four distinct options and balanced answer positions.

The revision replaced category-nonsense distractors in the highest-risk clusters with same-topic near misses and made their explanations identify the misconception: AM01/AM08 distinguish typed `inputs` from string event inputs and copied env values; AM04 distinguishes health/readiness, host ports, and job scope; AM05–06/AM12/CT01 distinguish matrix controls, image drift, and a transient single-job rerun; AM14 distinguishes minimum token scope from unrelated OIDC or contents authority; EN01–EN04/EN14 distinguish runner-group access, action allow policy, labels, and network capability; SO12 distinguishes action policy/review from matrix and retention settings.

The same-topic pass also covered AM17–AM24, CT12, AA08, AA12–AA13, EN17, and SO02/SO05: typed input contracts, cross-job/reusable output boundaries, authoring aids, approval controls, run-history evidence, action release/packaging, network controls, and OIDC alternatives. No external question bank was imported. Two deep drills now provide bounded evidence for the broad objective gaps: drill 7 separates selected-actions policy from runner routing, and drill 10 requires include/exclude, `fail-fast`, `max-parallel`, moving-image review, and selective-rerun reasoning. Both state the local/manual/hosted boundary rather than claiming a local file proves enterprise or hosted behavior.

The repair specifically replaced the remaining off-topic alternatives in CT02–CT03, CT06, CT08–CT11; AA03, AA05, AA07, AA09–AA10, and AA14; EN08, EN10–EN13, EN15, and EN18; plus SO07–SO09 and SO12. SO07 tests the complete attestation-generation permission set, and SO12 distinguishes action-source policy/review from runner routing, SHA-reference policy, and environment approval. Explanations were reconciled with the current choices; source URLs, IDs, domains, and objective mapping were retained.

## Archived bounded Sol re-review correction — 2026-10-09

The re-review identified nine residual ambiguity or giveaway issues. This bounded correction updates only AM11, CT08, AA09, EN05, EN15, EN18, SO06, SO07, and SO08. It makes CT08's trigger filtering answer unique, assumes successful checkout in AA09 before testing metadata discovery, separates online/label/group claims in EN05, and requires an explicitly selected compatible tool version in EN15. SO06 and SO08 now use supply-chain and cache/artifact tradeoffs as their alternatives. SO07's correct answer is the complete `contents: read`, `id-token: write`, and `attestations: write` set at option 0; every other option omits one distinct scope. The subsequent independent Sol semantic isolated and connected review passed.
