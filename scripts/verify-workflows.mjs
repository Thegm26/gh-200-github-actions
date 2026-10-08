import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const workflowsDir = resolve(root, '.github/workflows');
const requiredFiles = ['ci.yml', 'reusable-risk.yml', 'package-learning.yml'];
const checkoutV6 = 'actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803';
const setupNodeV6 = 'actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38';
const failures = [];

function requireMatch(text, pattern, description) {
  if (!pattern.test(text)) failures.push(description);
}

function file(name) {
  const path = resolve(workflowsDir, name);
  if (!existsSync(path)) {
    failures.push(`Missing required workflow: ${name}`);
    return '';
  }
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
}

if (!existsSync(workflowsDir)) failures.push('Missing .github/workflows directory.');

const activeFiles = existsSync(workflowsDir)
  ? readdirSync(workflowsDir).filter((name) => /\.ya?ml$/i.test(name)).sort()
  : [];
for (const name of requiredFiles) {
  if (!activeFiles.includes(name)) failures.push(`Required active workflow is absent: ${name}`);
}

const allWorkflows = activeFiles.map((name) => ({ name, text: file(name) }));
const allText = allWorkflows.map(({ text }) => text).join('\n');
const ci = file('ci.yml');
const reusable = file('reusable-risk.yml');
const learning = file('package-learning.yml');

requireMatch(ci, /\bpush:/, 'CI must trigger on push.');
requireMatch(ci, /\bpull_request:/, 'CI must trigger on pull_request.');
requireMatch(ci, /\bworkflow_dispatch:/, 'CI must offer workflow_dispatch.');
requireMatch(ci, /permissions:\s*\n\s+contents:\s*read/, 'CI must declare least-privilege contents: read.');
requireMatch(ci, /fail-fast:\s*false/, 'CI must demonstrate fail-fast.');
requireMatch(ci, /max-parallel:\s*2/, 'CI must limit matrix parallelism.');
requireMatch(ci, /\binclude:/, 'CI matrix must include an include example.');
requireMatch(ci, /\bexclude:/, 'CI matrix must include an exclude example.');
requireMatch(ci, /cache:\s*npm/, 'CI must use setup-node npm caching.');
requireMatch(ci, /npm run validate:content/, 'CI must run content validation once on the Linux Node 22 matrix row.');
requireMatch(ci, new RegExp(setupNodeV6.replace('/', '\\/'), 'g'), 'CI must use the approved pinned setup-node v6 revision.');
requireMatch(ci, /services:\s*\n\s+redis:/, 'CI must provide a service container.');
requireMatch(ci, /--health-cmd/, 'Service container must have a health check.');
requireMatch(ci, /outputs:\s*\n\s+smoke_result:/, 'CI must map a step output to a job output.');
requireMatch(ci, /GITHUB_STEP_SUMMARY/, 'CI must write a job summary.');
requireMatch(ci, /actions\/upload-artifact@/, 'CI must upload an artifact.');
requireMatch(ci, /actions\/download-artifact@/, 'CI must download an artifact.');
requireMatch(ci, /test-evidence-node-\$\{\{ matrix\.node \}\}\.txt/, 'CI matrix evidence files must be unique per Node version.');
requireMatch(ci, /for node_version in 20 22;/, 'CI integration must verify both matrix evidence records.');
requireMatch(ci, /\.\/\.github\/workflows\/reusable-risk\.yml/, 'CI must call the reusable workflow.');
requireMatch(reusable, /workflow_call:/, 'Reusable workflow must use workflow_call.');
requireMatch(reusable, /type:\s*number/, 'Reusable workflow input must be typed.');
requireMatch(reusable, /secrets:\s*\n\s+optional_token:/, 'Reusable workflow must declare its optional secret.');
requireMatch(reusable, /\.\/\.github\/actions\/risk-summary/, 'Reusable workflow must run the local JavaScript action.');
requireMatch(reusable, /sample_size:\s*\$\{\{ inputs\.sample_size \}\}/, 'Reusable workflow must pass the underscore-safe JavaScript action input.');
requireMatch(ci, /\.\/\.github\/actions\/lab-summary/, 'CI must run the local composite action.');
requireMatch(allText, /concurrency:/, 'At least one active workflow must use concurrency.');
requireMatch(learning, /environment:\s*\n\s+name:\s*training/, 'Manual learning workflow must demonstrate a non-blocking environment.');
requireMatch(learning, /^permissions:\n  contents: read\n\nconcurrency:/m, 'Manual learning workflow must keep active permissions at contents: read only.');
requireMatch(learning, /`id-token: write`/, 'Manual learning workflow must teach the OIDC permission in its job summary.');
requireMatch(learning, /`attestations: write`/, 'Manual learning workflow must teach the attestation permission in its job summary.');
if (/^  (?:id-token|attestations):\s*write\s*$/m.test(learning)) {
  failures.push('Manual learning workflow must not grant unused OIDC or attestation write permissions.');
}

for (const { name, text } of allWorkflows) {
  if (/pull_request_target\s*:/.test(text)) failures.push(`${name} must not use pull_request_target.`);
  if (/permissions:\s*(?:write-all|\{\s*\})/.test(text)) failures.push(`${name} has unsafe permissions.`);
  if (!/\bpermissions:/.test(text)) failures.push(`${name} must declare permissions explicitly.`);
  if (/::set-output|::add-path/.test(text)) failures.push(`${name} uses a deprecated workflow command.`);
  if (!text.includes(checkoutV6)) failures.push(`${name} must use the approved pinned checkout v6 revision.`);
  if (/actions\/setup-node@/.test(text) && !text.includes(setupNodeV6)) {
    failures.push(`${name} must use the approved pinned setup-node v6 revision.`);
  }
  for (const match of text.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm)) {
    const reference = match[1];
    if (reference.startsWith('./')) continue;
    const revision = reference.slice(reference.lastIndexOf('@') + 1);
    if (!/^[0-9a-f]{40}$/i.test(revision)) failures.push(`${name} has an unpinned action reference: ${reference}`);
    if (reference.startsWith('actions/checkout@') && reference !== checkoutV6) {
      failures.push(`${name} has an unapproved checkout revision: ${reference}`);
    }
    if (reference.startsWith('actions/setup-node@') && reference !== setupNodeV6) {
      failures.push(`${name} has an unapproved setup-node revision: ${reference}`);
    }
  }
}

for (const actionPath of ['.github/actions/risk-summary/action.yml', '.github/actions/lab-summary/action.yml']) {
  if (!existsSync(resolve(root, actionPath))) failures.push(`Missing local action: ${actionPath}`);
}

const riskAction = existsSync(resolve(root, '.github/actions/risk-summary/action.yml'))
  ? readFileSync(resolve(root, '.github/actions/risk-summary/action.yml'), 'utf8')
  : '';
requireMatch(riskAction, /inputs:\s*\n\s+sample_size:/, 'Risk action must declare its underscore-safe sample_size input.');
requireMatch(riskAction, /using:\s*node24/, 'Risk action must use the supported Node 24 runtime.');

const labAction = existsSync(resolve(root, '.github/actions/lab-summary/action.yml'))
  ? readFileSync(resolve(root, '.github/actions/lab-summary/action.yml'), 'utf8')
  : '';
requireMatch(labAction, /env:\s*\n\s+LAB_SUMMARY_TITLE:\s*\$\{\{ inputs\.title \}\}/, 'Lab summary action must bridge its title input through the environment.');
requireMatch(labAction, /printf '### %s\\n' "\$LAB_SUMMARY_TITLE"/, 'Lab summary action must quote the bridged title variable.');
if (/run:\s*\|[\s\S]*\$\{\{\s*inputs\./.test(labAction)) {
  failures.push('Lab summary action must not interpolate untrusted inputs directly into run scripts.');
}

if (failures.length) {
  console.error('Workflow validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Workflow validation passed (${activeFiles.length} active workflows checked).`);
}
