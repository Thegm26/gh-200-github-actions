# GH-200 Blueprint → practice map

Authority: [Microsoft GH-200 study guide, skills measured January 2026](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200). The listed bullets are the official skills, condensed only for navigation; follow the study guide for the authoritative wording.

| Domain / weight | Official objective clusters | Practice evidence |
| --- | --- | --- |
| Author and manage workflows, 20–25% | triggers/events; `workflow_dispatch` and `workflow_call` inputs/secrets; jobs/conditions/dependencies; commands/env; services; matrix; YAML anchors; contexts/expressions/immutable actions; editor tooling; cache/artifacts/retention APIs; outputs/environment files; summaries; badges/protections | [Lab 01](../labs/01-author-manage/README.md), questions `author-manage` |
| Consume and troubleshoot workflows, 15–20% | interpret triggers/logs/history; expand anchors; matrix diagnosis/selective rerun; locate/download artifacts and logs via UI/API; organization/reusable/non-public templates; starter vs reusable vs composite; disable vs delete | [Lab 02](../labs/02-consume-troubleshoot/README.md), questions `consume-troubleshoot` |
| Author and maintain actions, 15–20% | JavaScript/Docker/composite action types; immutable actions; action errors; structure/metadata/commands; public/private/Marketplace distribution; releases/versioning | [Lab 03](../labs/03-author-actions/README.md), questions `author-actions` |
| Manage Actions for the enterprise, 20–25% | reusable components/templates/access/policy; GitHub-hosted and self-hosted runners; IP/networking; runner groups/issues; hosted images/toolcache/runtime installation; organization/repository/environment secrets and variables; REST management | [Lab 04](../labs/04-enterprise/README.md), questions `enterprise` |
| Secure and optimize automation, 10–15% | environment approvals; trustworthy Marketplace actions; injection mitigation; token/PAT/permissions; OIDC; full-SHA action pinning and immutable actions; policy/reviewers; attestations; caching, retention and scaling | [Lab 05](../labs/05-secure-optimize/README.md), questions `secure-optimize` |

Coverage rule: every objective has an edit, diagnosis, or decision exercise plus retrieval questions. Current-topic drills include YAML anchors, runner image migrations, immutable actions, retention REST endpoints, and artifact attestation verification.
