# 01 — triggers, inputs, filters, contexts, expressions, and anchors

## Prerequisites and focused goal

Complete canonical labs 01–04 first. Make one inactive workflow choose events and handle context data safely.

## Objective and domain

Author and manage workflows: choose the correct trigger, preserve typed manual inputs, combine filters, use contexts at the right boundary, and expand YAML anchors.

## Files to inspect or edit

- Edit `starter.workflow.yml.txt`; it is inactive by design.
- Use `events.json` as the test table.
- Compare with `solution.workflow.yml.txt` and `solution.md` afterward.

## Tasks

1. Replace the invalid trigger with `push` on `main` limited to `_internal/src/**`, plus manual dispatch inputs `deploy` (Boolean) and `target` (choice).
2. Add a job condition that accepts either a matching push or a manual run with `deploy == true`.
3. Pass the untrusted PR/title sample through `env` and quote it in the shell; never interpolate it directly into `run:`.
4. Define a file-local anchor for `shell: bash` and `working-directory: .`, merge it into `defaults.run`, and explain which explicit key wins after a merge.
5. Predict which rows in `events.json` run automatically and which require the manual Boolean.

## Expected observable result

The workflow has two trigger families, typed dispatch inputs, AND semantics between `branches` and `paths`, a Boolean comparison, safe untrusted-data handling, and one anchor/alias pair.

## Verification commands or checklist

```bash
node _internal/examples/01-triggers-contexts/check.mjs _internal/examples/01-triggers-contexts/starter.workflow.yml.txt
```

Then confirm: matching push = run; `main` docs-only push = skip; feature `src` push = skip; manual `deploy: true` = run.

## Answer or solution location

Use [`solution.workflow.yml.txt`](solution.workflow.yml.txt) and [`solution.md`](solution.md) only after the checker reports what is missing. The legacy checker is structural; also explain filters, typed inputs, and why its YAML anchor example does not establish GitHub support for YAML merge keys.

## Primary official links

- [Triggering a workflow](https://docs.github.com/actions/using-workflows/triggering-a-workflow)
- [Workflow syntax: `workflow_dispatch`](https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs)
- [Contexts](https://docs.github.com/actions/learn-github-actions/contexts)
- [Expressions](https://docs.github.com/actions/learn-github-actions/expressions)
- [YAML anchors and aliases](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#yaml-anchors-and-aliases)
