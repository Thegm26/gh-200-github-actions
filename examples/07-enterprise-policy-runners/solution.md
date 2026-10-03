# Decision reasoning

- A runner group controls which repositories/organizations may schedule on its self-hosted runners. It does not decide which actions are permitted.
- An enterprise/organization Actions policy controls allowed actions and reusable workflows. Prefer selected, reviewed sources and full-SHA consumer references when supported.
- Standard GitHub-hosted runners are ephemeral and GitHub-maintained, but broad hosted address ranges are not the same as a dedicated static egress design. A self-hosted runner/network can supply controlled egress at the cost of patching, isolation, scaling, and incident-response ownership.
- For a queued self-hosted job, check the exact `runs-on` labels/group, repository access to that group, online/busy state, runner service/diagnostics, outbound connectivity to GitHub, and concurrency/capacity.
- An IP allow list governs access paths; runner labels only route jobs.

