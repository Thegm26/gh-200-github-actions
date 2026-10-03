# Retrieval key

- Step writes `name=value` to `GITHUB_OUTPUT`; step has `id`; job maps `${{ steps.id.outputs.name }}`; dependent job declares `needs`; consumer reads `${{ needs.job.outputs.name }}`.
- Rows: Ubuntu/20, Ubuntu/22, Windows/20, included Ubuntu/24 experimental.
- `fail-fast: false` prevents cancellation of sibling matrix jobs after failure. `max-parallel: 2` limits simultaneous matrix jobs without deleting combinations.
- Branch and path filters on the same event must both match.
- `inputs.deploy` preserves Boolean type for `workflow_dispatch`; compare to `true`, not the string `'true'`.

