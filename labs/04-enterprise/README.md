# Lab 04 — manage Actions for the enterprise (50 min)

Sources: [enterprise Actions administration](https://docs.github.com/enterprise-cloud@latest/admin/managing-github-actions-for-your-enterprise) · [runner groups](https://docs.github.com/actions/how-tos/manage-runners/self-hosted-runners/managing-access-to-self-hosted-runners-using-groups) · [secrets](https://docs.github.com/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions).

This public repository cannot expose enterprise settings. Treat `starter/enterprise-decisions.md.txt` as the organization simulation and record decisions before checking `solution/decisions.md`.

1. (10m) Assign repositories to runner groups. Explain why a runner group is not an action-allow policy.
2. (10m) Build an allow policy that permits trusted actions and a reusable workflow but blocks arbitrary Marketplace use; include immutable full-SHA consumer guidance.
3. (10m) Decide outbound network/IP allow-list behavior for hosted versus self-hosted runners and troubleshoot an unavailable self-hosted runner.
4. (10m) Scope `DEPLOY_KEY`, `REGION`, and `NPM_TOKEN` at org/repository/environment levels; identify the required approval gate.
5. (10m) Give REST automation targets for variables/secrets and retention; plan runner-image migration/tool installation without assuming `*-latest` is fixed.

Verification: your decisions respect least access, use environment protection for production, distinguish policies from runner allocation, and name a primary source for changing runner images. Hard scenarios: only finance deployments need a static egress; organization templates must reach private repos; a new Windows image changes a compiler; only production needs approvers.
