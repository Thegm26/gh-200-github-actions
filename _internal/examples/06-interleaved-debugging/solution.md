# Scenario key

1. Promote the producing step output to a job output and read it through `needs`; `GITHUB_ENV` cannot cross jobs.
2. Set `strategy.fail-fast: false`; `continue-on-error` changes failure treatment rather than sibling cancellation.
3. Use a reusable workflow with `workflow_call`, invoked at job level; a composite action cannot model multiple jobs.
4. Use a composite action, invoked as a step; a reusable workflow cannot be inserted among a job's steps.
5. Use a starter workflow; a reusable workflow would remain centrally referenced instead of becoming an independent copy.

