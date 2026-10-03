# Enterprise retrieval key

- Runner group: which repositories/organizations can use a self-hosted runner pool. Policy: which actions/reusable workflows may run.
- GitHub manages hosted runner images/lifecycle; you manage self-hosted patching, isolation, capacity, networking, and cleanup. Static egress commonly requires an intentional larger-runner or self-hosted/network design, not an arbitrary label.
- Variable: non-sensitive `REGION`. Repository secret: narrowly scoped `NPM_TOKEN`. Protected environment secret: production-only credential.
- Queued job: exact labels/group, repository access, runner online/busy/service state, outbound connectivity, and capacity.

