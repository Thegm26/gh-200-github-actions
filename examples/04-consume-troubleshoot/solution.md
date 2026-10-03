# Diagnosis key

- Failure: `ubuntu-latest / Node 22`. Inspect its log and selectively rerun the failed job (plus dependencies if required), rather than assuming every matrix row is broken.
- Merge: `timeout-minutes: 10`; explicit `shell: pwsh` overrides the merged `bash` value.
- Command stderr → logs. Binary/report → artifact. Automated inventory across runs → REST API or `gh api`.
- Copied new-repo scaffold → starter workflow. Centrally maintained job graph → reusable workflow called at job level. Reusable step sequence → composite action called at step level.
- Disable preserves the workflow file/history and permits later enabling. Deleting the workflow file is source removal, not an operational pause.

