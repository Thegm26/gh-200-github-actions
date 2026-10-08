# Question review ledger

Every item is original practice content. Its exact primary source URLs live with the item in [`quiz/questions.json`](../quiz/questions.json); the catalog and objective mapping are in [`references/catalog.json`](../references/catalog.json) and [`references/coverage.json`](../references/coverage.json). Commercial resources are never answer authorities.

| Reviewed IDs | Scope checked | Status at this revision |
| --- | --- | --- |
| AM01–AM24, CT01–CT16, AA01–AA15 | Independent reviewer A (`/root/visual_review`) checked every author/manage, consume/troubleshoot, and author/actions item (55 IDs): stem, answer, explanation, and primary-source alignment. | **Isolated PASS and connected PASS.** Corrections to AM07, AM13, CT07, CT11, AA05, AM17, CT16, and AA13–AA15 were rechecked against the final mapping and sources. |
| EN01–EN19, SO01–SO12 | Independent reviewer B (`/root/quiz_review_b`, 31 IDs) checked every enterprise and secure/optimize item: semantics, answer, explanation, and primary-source alignment. | **Isolated PASS and connected PASS.** Corrections to EN09, EN14, EN18–EN19, SO07, SO09, SO10, and SO12 were rechecked against the final mapping and sources. |

The connected review found curriculum-mapping defects rather than question-answer defects: AM12 needed a real editor-tooling drill; AA02 and AA04 needed to point at the custom-actions Tasks 1, 2, and 5; SO10 needed the matrix breadth/concurrency-cost drill and accurate runner-minute model; and snapshot attribution had to live in the catalog/SOURCES rather than the byte-exact raw files. Those corrections are applied and all connected curriculum, reference, and UI-engine reviews now pass. Evidence is recorded in `/tmp/gh200-primary-final-check.log` and the final connected cohesion review on fingerprint `56f5d5000f6ad1fc8675b2d1bb5fb3366a13cb41a68113fec1336e83a5ec5bc8`.

The offline bank contains 86 original reviewed questions. GHCertified is linked only; ExamTopics marketing is unverified and neither source is imported, scraped, or used as an answer authority. This course does not claim to contain actual past exam papers. The ledger records review state rather than claiming an exam-writing authority.
