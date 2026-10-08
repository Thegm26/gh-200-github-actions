import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = process.env.GH200_ROOT ? resolve(process.env.GH200_ROOT) : resolve(fileURLToPath(new URL('../..', import.meta.url)));
const manifest = JSON.parse(readFileSync(resolve(root, 'hands-on/manifest.json'), 'utf8'));
const errors = [];
const ids = manifest.labs.map((lab) => lab.id);
const expectedIds = Array.from({ length: 17 }, (_, index) => String(index + 1).padStart(2, '0'));
const approvedActions = new Set([
  'actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803',
  'actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38',
  'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02',
  'actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093',
]);

const checkUses = (value, label) => {
  if (typeof value !== 'string' || value.startsWith('./')) return;
  if (!/^[\w-]+\/[\w.-]+@[0-9a-f]{40}$/.test(value)) errors.push(`${label}: non-local action must use a full SHA`);
  else if (!approvedActions.has(value)) errors.push(`${label}: action SHA is not an approved revision`);
};
const visitUses = (value, label) => {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) return value.forEach((item, index) => visitUses(item, `${label}[${index}]`));
  if ('uses' in value) checkUses(value.uses, label);
  for (const [key, child] of Object.entries(value)) if (key !== 'uses') visitUses(child, `${label}.${key}`);
};
const readYaml = (path, label) => {
  try { return YAML.parse(readFileSync(path, 'utf8')); }
  catch { errors.push(`${label}: invalid YAML`); return null; }
};
const readOnlyPermissions = (permissions, label) => {
  if (!permissions || permissions.contents !== 'read' || Object.keys(permissions).length !== 1) errors.push(`${label}: permissions must be contents: read only`);
};
const validateCompositeAction = (path, label) => {
  const action = readYaml(path, label);
  if (!action || typeof action !== 'object') return;
  if (!action.name || !action.description || action?.outputs?.message?.value !== '${{ steps.greeting.outputs.message }}' || action?.runs?.using !== 'composite' || !Array.isArray(action?.runs?.steps)) errors.push(`${label}: required composite metadata is incomplete`);
  visitUses(action, label);
};

if (manifest.labs.length !== 17 || new Set(ids).size !== 17) errors.push('manifest must list 17 unique labs');
if (ids.map((id) => id.slice(0, 2)).sort().join(',') !== expectedIds.join(',')) errors.push('manifest has missing or duplicate numeric IDs');

for (const lab of manifest.labs) {
  const dir = resolve(root, 'hands-on', lab.id);
  const files = ['README.md', 'workflow.yml.txt', 'solution.yml.txt'];
  for (const file of files) if (!existsSync(resolve(dir, file))) errors.push(`${lab.id}: missing ${file}`);
  if (files.some((file) => !existsSync(resolve(dir, file)))) continue;
  const readme = readFileSync(resolve(dir, 'README.md'), 'utf8');
  if (!readme.includes('.github/workflows/gh200-lab.yml') || !/First hosted result/.test(readme) || !/Exact repair/.test(readme) || !/New evidence/.test(readme) || !/Preserve and clean up/.test(readme)) errors.push(`${lab.id}: incomplete runbook`);
  for (const file of ['workflow.yml.txt', 'solution.yml.txt']) {
    const path = resolve(dir, file);
    const text = readFileSync(path, 'utf8');
    if (text.includes('\\${{')) errors.push(`${lab.id}: escaped expression in ${file}`);
    const parsed = readYaml(path, `${lab.id}: ${file}`);
    if (!parsed || typeof parsed !== 'object') { errors.push(`${lab.id}: ${file} must be a workflow mapping`); continue; }
    readOnlyPermissions(parsed.permissions, `${lab.id}: ${file}`);
    if (lab.id === '01-first-workflow' && file === 'workflow.yml.txt') {
      if (parsed.on) errors.push('01: starter must have no trigger');
    } else if (lab.id === '03-push-filter') {
      if (!parsed.on?.workflow_dispatch || !parsed.on?.push || Object.keys(parsed.on).length !== 2) errors.push(`03: ${file} must use only workflow_dispatch and push`);
    } else if (!parsed.on?.workflow_dispatch || Object.keys(parsed.on).length !== 1) errors.push(`${lab.id}: ${file} must use workflow_dispatch only`);
    if (!parsed.jobs || typeof parsed.jobs !== 'object' || Array.isArray(parsed.jobs) || Object.keys(parsed.jobs).length === 0) { errors.push(`${lab.id}: ${file} needs a nonempty jobs mapping`); continue; }
    for (const [jobId, job] of Object.entries(parsed.jobs)) {
      if (!job.uses && job['timeout-minutes'] !== 5 && !(lab.id === '02-job-and-runner' && file === 'workflow.yml.txt')) errors.push(`${lab.id}: ${file} ${jobId} needs five minute timeout`);
      if (!job.uses && !job['runs-on'] && !(lab.id === '02-job-and-runner' && file === 'workflow.yml.txt')) errors.push(`${lab.id}: ${file} ${jobId} needs a runner`);
      if (!job.uses && (!Array.isArray(job.steps) || job.steps.length === 0)) errors.push(`${lab.id}: ${file} ${jobId} needs nonempty steps`);
      if (job.uses && (job.steps || job['runs-on'])) errors.push(`${lab.id}: ${file} ${jobId} reusable job cannot define runner steps`);
      if (job.permissions) {
        const oidcOnly = lab.id === '14-oidc-job' && file === 'solution.yml.txt' && jobId === 'deploy' && job.permissions.contents === 'read' && job.permissions['id-token'] === 'write' && Object.keys(job.permissions).length === 2;
        if (!oidcOnly) errors.push(`${lab.id}: ${file} unexpected job permission on ${jobId}`);
      }
    }
    visitUses(parsed, `${lab.id}: ${file}`);
  }
}

const pushStarter = readYaml(resolve(root, 'hands-on/03-push-filter/workflow.yml.txt'), '03 starter');
const pushSolution = readYaml(resolve(root, 'hands-on/03-push-filter/solution.yml.txt'), '03 solution');
for (const [label, workflow, path] of [['starter', pushStarter, '_internal/docs/**'], ['solution', pushSolution, 'lab-inputs/**']]) {
  const push = workflow?.on?.push;
  if (!push || JSON.stringify(push.branches) !== JSON.stringify(['gh200-path-lab']) || JSON.stringify(push.paths) !== JSON.stringify([path])) errors.push(`03 ${label}: must use the precise opt-in branch and path filter`);
}
const calledPath = resolve(root, 'hands-on/09-reusable-call/gh200-called.yml.txt');
if (!existsSync(calledPath)) errors.push('missing helper hands-on/09-reusable-call/gh200-called.yml.txt');
else {
  const called = readYaml(calledPath, '09 called helper');
  if (!called || typeof called !== 'object') errors.push('09 called helper: must be a workflow mapping');
  else {
    if (!called.on?.workflow_call || Object.keys(called.on).length !== 1) errors.push('09 called helper: must use workflow_call only');
    readOnlyPermissions(called.permissions, '09 called helper');
    if (!called.jobs || typeof called.jobs !== 'object' || Array.isArray(called.jobs)) errors.push('09 called helper: needs a jobs mapping');
    else if (Object.keys(called.jobs).length === 0) errors.push('09 called helper: needs a nonempty jobs mapping');
    else for (const [jobId, job] of Object.entries(called.jobs)) {
      if (job['timeout-minutes'] !== 5) errors.push(`09 called helper: ${jobId} needs five minute timeout`);
      if (!job['runs-on']) errors.push(`09 called helper: ${jobId} needs a runner`);
      if (!Array.isArray(job.steps) || job.steps.length === 0) errors.push(`09 called helper: ${jobId} needs nonempty steps`);
      if (job.permissions) errors.push(`09 called helper: unexpected job permission on ${jobId}`);
    }
    visitUses(called, '09 called helper');
  }
}
for (const actionFile of ['action.starter.yml.txt', 'action.yml.txt']) {
  const actionPath = resolve(root, 'hands-on/10-composite-action', actionFile);
  if (!existsSync(actionPath)) errors.push(`missing helper hands-on/10-composite-action/${actionFile}`);
  else validateCompositeAction(actionPath, `10 ${actionFile}`);
}
for (const candidate of ['hands-on/13-least-privilege/candidate.yml.txt', 'hands-on/13-least-privilege/candidate.solution.yml.txt']) {
  const policy = readYaml(resolve(root, candidate), candidate);
  if (!policy?.permissions || typeof policy.permissions !== 'object') errors.push(`${candidate}: invalid candidate policy`);
}
if (existsSync(resolve(root, '.github/workflows/gh200-lab.yml'))) errors.push('learner workflow must remain inactive');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`hands-on verification passed (${manifest.labs.length}/17)`);
