# Identity decision key

| Need | Choice | Reason / risk |
| --- | --- | --- |
| Read current repository during one run | `GITHUB_TOKEN` with `contents: read` | ephemeral, repository-scoped, automatic; set minimum permissions |
| Call a cloud provider without stored cloud key | OIDC plus provider trust and `id-token: write` | exchanges a short-lived signed identity; permission alone grants no cloud access |
| Cross-repository GitHub operation beyond `GITHUB_TOKEN` scope | narrowly scoped GitHub App token or PAT if necessary | credential must be stored/rotated; avoid classic broad PAT when a narrower mechanism works |

