# 07 — enterprise policy, runner groups, and networking

## Exact target time

25 minutes (02:20–02:45).

## Objective and domain

Manage Actions for the enterprise: distinguish action policy from runner allocation, select hosted/self-hosted execution, reason about IP allow lists, and troubleshoot runner routing.

## Files to inspect or edit

- Inspect `scenario.json`.
- Edit `decision.json` without copying the solution.
- Compare with `solution.json` and `solution.md` afterward.

## Tasks

1. Assign `finance-api`, `web`, and `contractor-sandbox` to eligible runner groups.
2. Write an action policy allowing GitHub-authored actions plus `Northstar/shared-release`, while denying arbitrary Marketplace actions.
3. Choose hosted or self-hosted for static egress and explain the operational tradeoff.
4. Diagnose an offline self-hosted runner using labels, group/repository access, service status, network reachability, and queue evidence.
5. Decide where an IP allow list applies; never claim that runner labels create a firewall rule.

## Expected observable result

Only finance can target the restricted production group; web can use hosted runners; contractors cannot use production runners. Action policy and runner group are separate controls.

## Verification commands or checklist

```bash
node examples/07-enterprise-policy-runners/check.mjs
```

Checklist: least repository access; static-egress rationale; explicit self-hosted maintenance responsibility; action allow policy separate from runner selection.

## Answer or solution location

Use [`solution.json`](solution.json) and [`solution.md`](solution.md) after the checker.

## Primary official links

- [Enforcing policies for GitHub Actions](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise)
- [Managing access to self-hosted runners with groups](https://docs.github.com/actions/how-tos/manage-runners/self-hosted-runners/managing-access-to-self-hosted-runners-using-groups)
- [Choosing the runner for a job](https://docs.github.com/actions/using-jobs/choosing-the-runner-for-a-job)
- [About IP allow lists](https://docs.github.com/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-network-traffic-to-your-enterprise-with-an-ip-allow-list)

