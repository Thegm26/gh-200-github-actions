# Reasoning key

- Branch and path filters on one event are conjunctive: both must match.
- `inputs.deploy` retains Boolean type; `github.event.inputs.deploy` is the string-shaped event payload form.
- Context interpolation into shell source can become code. Mapping to an environment variable keeps event text as data; shell quoting still matters.
- Anchors reuse YAML inside one file. A value explicitly supplied at the merge destination overrides the merged value.

