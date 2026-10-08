import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const learningRoot = path.join(root, 'learning');
export const manifest = JSON.parse(fs.readFileSync(path.join(learningRoot, 'manifest.json'), 'utf8'));
export const workspaceRoot = path.join(root, manifest.workspace);
export const labById = (id) => manifest.labs.find((lab) => lab.id === id);
export function safeLab(id) { const lab = labById(id); if (!lab) throw new Error(`Unknown lab '${id}'. Run: npm run learn -- list`); return lab; }
function safeDirectory(base, lab) { const resolved = path.resolve(base); if (fs.existsSync(resolved) && fs.lstatSync(resolved).isSymbolicLink()) throw new Error('Refusing a symbolic-link workspace root.'); const target = path.resolve(resolved, lab.id); if (!target.startsWith(`${resolved}${path.sep}`)) throw new Error('Unsafe workspace path.'); return target; }
export function copyStarter(lab, base = workspaceRoot) { const target = safeDirectory(base, lab); if (fs.existsSync(target)) throw new Error(`Workspace already exists: ${path.relative(root, target)}. Use reset ${lab.id} --yes to replace it.`); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.cpSync(path.join(learningRoot, 'starters', lab.id), target, { recursive: true, errorOnExist: true }); return target; }
export function resetStarter(lab, base = workspaceRoot, confirmed = false) { if (!confirmed) throw new Error(`Reset refused. Re-run: npm run learn -- reset ${lab.id} --yes`); const target = safeDirectory(base, lab); if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('Refusing to reset a symbolic-link lab directory.'); if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true }); return copyStarter(lab, base); }
function text(value) { return typeof value === 'string' ? value : ''; }
function mapping(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function jobs(data) { return mapping(data?.jobs) ? data.jobs : {}; }
function permissionsMatch(value, expected) {
  if (!mapping(value)) return false;
  const actualKeys = Object.keys(value).sort(); const expectedKeys = Object.keys(expected).sort();
  return actualKeys.length === expectedKeys.length && actualKeys.every((key, index) => key === expectedKeys[index] && value[key] === expected[key]);
}
export function validateLab(lab, directory = safeDirectory(workspaceRoot, lab)) {
  const file = path.resolve(directory, lab.file); if (!file.startsWith(`${path.resolve(directory)}${path.sep}`) || !fs.existsSync(file)) return [`Missing learner file: ${lab.file}`];
  let document; let data;
  try { document = parseDocument(fs.readFileSync(file, 'utf8'), { merge: true }); } catch (error) { return [`YAML parse error: ${error.message}`]; }
  if (document.errors.length) return [`YAML parse error: ${document.errors[0].message}`];
  try { data = document.toJS({ merge: true }) || {}; } catch (error) { return [`YAML parse error: ${error.message}`]; }
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
  const triggerValid = typeof data.on === 'string' ? data.on.trim().length > 0
    : Array.isArray(data.on) ? data.on.length > 0 && data.on.every((trigger) => typeof trigger === 'string' && trigger.trim())
      : mapping(data.on) && Object.keys(data.on).length > 0 && Object.values(data.on).every((trigger) => trigger === null || mapping(trigger));
  const jobsValid = Object.values(allJobs).every((job) => {
    if (!mapping(job)) return false;
    if (text(job.uses).trim()) return !job['runs-on'] && !job.steps;
    return Boolean(job['runs-on']) && Array.isArray(job.steps) && job.steps.length > 0 && job.steps.every((step) => {
      if (!mapping(step)) return false;
      const hasRun = Boolean(text(step.run).trim()); const hasUses = Boolean(text(step.uses).trim());
      return hasRun !== hasUses;
    });
  });
  if (lab.file === 'workflow.yml' && (!triggerValid || !Object.keys(allJobs).length || !jobsValid)) return ['Workflow baseline needs a non-empty trigger map and non-empty jobs: reusable jobs use only uses; other jobs need runs-on and exactly one of run or uses.'];
  const errors = [];
  errors.push(...lab.rules.filter((rule) => !checks[rule]?.()).map(() => `Not yet: ${lab.success} (${lab.hint})`));
  return errors;
}
/** Validate a checked-in exercise without creating or touching a learner workspace. */
export function validateExercise(id, directory) {
  const lab = safeLab(id);
  const errors = validateLab(lab, directory);
  return errors.map((error) => error.startsWith('Workflow baseline needs') ? `${lab.success} (${lab.hint})` : error);
}
export function tempWorkspace() { return fs.mkdtempSync(path.join(os.tmpdir(), 'gh200-learning-')); }
