# Exam strategy: choose the smallest safe answer

Technical authority remains [the Microsoft GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) and GitHub Docs. This document is learning strategy, not a source of GitHub technical behavior.

1. Read the last sentence first: it usually supplies the constraint (central maintenance, no long-lived secret, only selected repos, preserve artifacts).
2. Mark the noun: **workflow**, **action**, **template**, **runner**, **token**, **artifact**, or **attestation**. Eliminate answers for the wrong abstraction before comparing syntax.
3. Prefer least privilege, full-SHA pins, scoped events, environment gates, and documented GitHub-native controls. A broad PAT, `@main`, or arbitrary shell interpolation is rarely the best answer.
4. For YAML, trace evaluation boundaries: trigger → job `if` → matrix expansion → step; then identify the context that exists there. For a failed matrix, map its job name back to axes before changing all variants.
5. Say why each distractor fails, then retrieve the distinction without notes. Do not merely reread an explanation.

## Use the last day deliberately

Use short retrieval rounds (write or answer before opening the cheat sheet), then interleave domains rather than completing all workflow questions together. Alternate a worked example (copy/build a correct small workflow) with a near-transfer problem (diagnose a similar broken one). These recommendations are grounded in learning research, not exam insider knowledge: [retrieval practice review](https://www.purdue.edu/retrievalpractice/assets/pdf/Koedinger_etal_2016.pdf), [interleaving review](https://www.apa.org/ed/precollege/psychology-teacher-network/introductory-psychology/2012/09/learning-strategies), and [worked-example effect overview](https://www.education.com/reference/article/worked-example-effect/).

Take brief movement/water breaks roughly each hour, protect a normal sleep opportunity, and stop cramming when you can accurately explain the five core distinctions in LAST_HOUR. This is general study/wellbeing guidance, not a promise about test performance.

## Secondary-source policy

If you encounter community exam reports, treat them as **anecdotal exam-experience sources only**: they can suggest formats or topics to revisit but cannot establish product behavior, weighting, or what will appear. Do not memorize alleged items; use primary documentation to resolve every technical claim.
