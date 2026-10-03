# Lab 03 — author and maintain actions (35 min)

Sources: [creating actions](https://docs.github.com/actions/sharing-automations/creating-actions) · [metadata syntax](https://docs.github.com/actions/sharing-automations/metadata-syntax-for-github-actions) · [Marketplace](https://docs.github.com/actions/sharing-automations/creating-actions/publishing-actions-in-github-marketplace).

1. (10m) Inspect `starter/action.yml.txt`; repair required metadata and decide whether its task requires composite, JavaScript, or Docker.
2. (8m) Copy the composite solution to a scratch action directory and invoke it from a workflow step with an input/output.
3. (8m) Design distribution: private internal action versus public Marketplace action; choose a SemVer release/tag strategy and explain why consumers pin full SHAs.
4. (9m) Diagnose an action path error, an undeclared input, and a Docker-only dependency. Include immutable action constraints in the answer.

Verification checklist: `action.yml` at action root; `name`, `description`, `runs` are present; inputs/outputs have intentional contracts; action type matches runtime need; Marketplace public release uses an action tag. Hard scenarios: a tool requires Node APIs → JavaScript; a multi-command portable sequence → composite; a hermetic custom OS dependency → Docker.
