/** Browser-safe rules shared by the command-line and offline course runtimes. */
export const MAX_YAML_BYTES = 200_000;

const text = (value) => typeof value === 'string' ? value : '';
const mapping = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const jobs = (data) => mapping(data?.jobs) ? data.jobs : {};
const permissionsMatch = (value, expected) => {
  if (!mapping(value)) return false;
  const actualKeys = Object.keys(value).sort(); const expectedKeys = Object.keys(expected).sort();
  return actualKeys.length === expectedKeys.length && actualKeys.every((key, index) => key === expectedKeys[index] && value[key] === expected[key]);
};

export function validateLearningSource(lab, source, parseYaml) {
  if (!lab || typeof source !== 'string') return ['Enter YAML text for a known exercise.'];
  if (source.length > MAX_YAML_BYTES) return [`YAML is too large; keep it below ${MAX_YAML_BYTES} characters.`];
  let data;
  try { data = parseYaml(source) || {}; } catch (error) { return [`YAML parse error: ${error instanceof Error ? error.message : 'invalid YAML'}`]; }
  if (!mapping(data)) return ['YAML must describe a mapping.'];
  const allJobs = jobs(data); const j = (name) => allJobs[name] || {}; const steps = (name) => Array.isArray(j(name).steps) ? j(name).steps : [];
  const checks = {
    'workflow_dispatch': () => data.on && typeof data.on.workflow_dispatch === 'object' && data.on.workflow_dispatch !== null,
    'build-ubuntu': () => j('build')['runs-on'] === 'ubuntu-latest',
    'push-filter': () => data.on?.push?.branches?.includes('main') && data.on?.push?.paths?.includes('src/**'),
    'safe-env': () => steps('inspect').some((s) => text(s.env?.EVENT_TEXT).includes('github.event') && /"\$EVENT_TEXT"/.test(text(s.run))) && !steps('inspect').some((s) => /github\.event/.test(text(s.run))),
    'job-output': () => text(j('prepare').outputs?.version) === '${{ steps.version.outputs.version }}' && steps('prepare').some((s) => s.id === 'version' && /version=.+>>\s*["']?\$GITHUB_OUTPUT["']?/.test(text(s.run))),
    'needs-output': () => j('report').needs === 'prepare' && steps('report').some((s) => text(s.run).includes('needs.prepare.outputs.version')) && text(j('prepare').outputs?.version) === '${{ steps.v.outputs.version }}' && steps('prepare').some((s) => s.id === 'v' && /version=.+>>\s*["']?\$GITHUB_OUTPUT["']?/.test(text(s.run))),
    'node-matrix': () => { const node = j('test').strategy?.matrix?.node; return Array.isArray(node) && node.includes(20) && node.includes(22); },
    'healthy-redis': () => j('test')['runs-on'] === 'ubuntu-latest' && j('test').services?.redis?.image === 'redis:7' && /health-cmd/.test(text(j('test').services.redis.options)),
    'reusable-call': () => j('risk').uses === './.github/workflows/reusable-risk.yml' && j('risk').with?.sample_size === 3 && !j('risk')['runs-on'],
    composite: () => data.runs?.using === 'composite' && Array.isArray(data.runs.steps) && data.runs.steps.some((s) => s.shell === 'bash' && /echo hello/.test(text(s.run))),
    'failure-evidence': () => steps('test').some((s) => /^\$?\{?\{?\s*always\(\)\s*\}?\}?$/.test(text(s.if).trim()) && />>\s*["']?\$GITHUB_STEP_SUMMARY["']?/.test(text(s.run))),
    'runner-policy': () => Array.isArray(j('scan')['runs-on']) && j('scan')['runs-on'].length === 2 && j('scan')['runs-on'].includes('self-hosted') && j('scan')['runs-on'].includes('approved'),
    'least-privilege': () => permissionsMatch(data.permissions, { contents: 'read' }) && Object.values(allJobs).every((job) => !job.permissions || permissionsMatch(job.permissions, { contents: 'read' })),
    'oidc-deploy': () => permissionsMatch(data.permissions, { contents: 'read' }) && j('deploy').environment === 'production' && permissionsMatch(j('deploy').permissions, { 'id-token': 'write', contents: 'read' }) && Object.entries(allJobs).every(([name, job]) => name === 'deploy' || !job.permissions || permissionsMatch(job.permissions, { contents: 'read' })),
    'checkout-sha': () => steps('build').some((s) => text(s.uses) === 'actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683'),
    artifact: () => steps('build').some((s) => s.uses === 'actions/upload-artifact@v4' && s.with?.name === 'build-output' && s.with?.path === 'dist'),
    'deploy-gate': () => j('deploy').needs === 'build' && j('deploy').permissions?.contents === 'read' && !Object.values(j('deploy').permissions || {}).includes('write'),
  };
  const triggerValid = typeof data.on === 'string' ? data.on.trim().length > 0 : Array.isArray(data.on) ? data.on.length > 0 && data.on.every((trigger) => typeof trigger === 'string' && trigger.trim()) : mapping(data.on) && Object.keys(data.on).length > 0 && Object.values(data.on).every((trigger) => trigger === null || mapping(trigger));
  const jobsValid = Object.values(allJobs).every((job) => {
    if (!mapping(job)) return false;
    if (text(job.uses).trim()) return !job['runs-on'] && !job.steps;
    return Boolean(job['runs-on']) && Array.isArray(job.steps) && job.steps.length > 0 && job.steps.every((step) => mapping(step) && (Boolean(text(step.run).trim()) !== Boolean(text(step.uses).trim())));
  });
  if (lab.file === 'workflow.yml' && (!triggerValid || !Object.keys(allJobs).length || !jobsValid)) return ['Workflow baseline needs a non-empty trigger map and non-empty jobs: reusable jobs use only uses; other jobs need runs-on and exactly one of run or uses.'];
  return lab.rules.filter((rule) => {
    try { return !checks[rule]?.(); } catch { return true; }
  }).map(() => `Not yet: ${lab.success} (${lab.hint})`);
}
