# Persistence and trust key

| Scenario | Choice | Reason |
| --- | --- | --- |
| Reuse npm downloads | cache | keyed performance optimization; restore prefix may yield an older compatible cache |
| Move `dist.tgz` between jobs | artifact | run output transferred/downloaded with retention controls |
| Distribute versioned library | package registry | consumer-facing versioned distribution; publication needs `packages: write` with `GITHUB_TOKEN` |
| Prove provenance/digest | generate then verify attestation | generation alone is insufficient; verifier constrains expected repository/identity and checks subject digest |

Cache writes from untrusted contexts can influence later restore behavior, so scope keys and trust boundaries carefully and never store secrets in cache. Artifact `retention-days` applies to an upload; organization/repository retention policy uses settings/API and can cap behavior. A local checksum proves byte consistency only; GitHub artifact attestations add signed provenance/identity that must still be verified.

