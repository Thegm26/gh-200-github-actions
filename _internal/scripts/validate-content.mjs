#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { loadQuestions, validateQuestions } from './quiz.mjs';
import { isIllustrativeTemplateUrl } from './link-policy.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const workflowRoot = path.join(root, '.github', 'workflows');
const expectedLabs = ['01-author-manage', '02-consume-troubleshoot', '03-author-actions', '04-enterprise', '05-secure-optimize'];
const requiredDocs = ['README.md', '_internal/docs/BLUEPRINT.md', '_internal/docs/CHEAT_SHEET.md', '_internal/docs/EXAM_STRATEGY.md', '_internal/docs/LAST_HOUR.md', '_internal/docs/SOURCES.md'];
const expectedModules = [
  '00-blueprint-recall',
  '01-triggers-contexts',
  '02-outputs-matrix-services',
  '03-author-manage-retrieval',
  '04-consume-troubleshoot',
  '05-custom-actions',
  '06-interleaved-debugging',
  '07-enterprise-policy-runners',
  '08-enterprise-secrets-api',
  '09-enterprise-retrieval',
  '10-security-identity',
  '11-cache-artifacts-attestations',
  '12-final-capstone',
];
const requiredModuleSections = [
  '## Prerequisites and focused goal',
  '## Objective and domain',
  '## Files to inspect or edit',
  '## Tasks',
  '## Expected observable result',
  '## Verification commands or checklist',
  '## Answer or solution location',
  '## Primary official links',
];
const questions = loadQuestions();
const errors = validateQuestions(questions);
const checkLinks = process.argv.includes('--links');
const minimumByDomain = { 'author-manage': 15, 'consume-troubleshoot': 11, 'author-actions': 11, enterprise: 15, 'secure-optimize': 8 };
for (const [domain, minimum] of Object.entries(minimumByDomain)) {
  const count = questions.filter((question) => question.domain === domain).length;
  if (count < minimum) errors.push(`${domain} has ${count} questions; requires at least ${minimum}`);
}

for (const item of requiredDocs) if (!fs.existsSync(path.join(root, item))) errors.push(`missing required ${item}`);
for (const lab of expectedLabs) {
  const labRoot = path.join(root, '_internal/labs', lab);
  if (!fs.existsSync(path.join(labRoot, 'README.md'))) errors.push(`missing ${lab}/README.md`);
  if (!fs.existsSync(path.join(labRoot, 'starter'))) errors.push(`missing ${lab}/starter`);
  if (!fs.existsSync(path.join(labRoot, 'solution'))) errors.push(`missing ${lab}/solution`);
  if (fs.existsSync(path.join(labRoot, 'starter')) && !walk(path.join(labRoot, 'starter')).some((file) => file.endsWith('.txt'))) errors.push(`${lab}/starter needs inactive .txt challenge material`);
}
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const examplesRoot = path.join(root, '_internal/examples');
for (const module of expectedModules) {
  const moduleRoot = path.join(examplesRoot, module);
  const readme = path.join(moduleRoot, 'README.md');
  if (!fs.existsSync(readme)) {
    errors.push(`missing _internal/examples/${module}/README.md`);
    continue;
  }
  const content = fs.readFileSync(readme, 'utf8');
  for (const section of requiredModuleSections) {
    if (!content.includes(section)) errors.push(`${module}/README.md missing section: ${section}`);
  }
  if (!/https:\/\/(docs\.github\.com|learn\.microsoft\.com)/.test(content)) {
    errors.push(`${module}/README.md needs a primary official link`);
  }
  const moduleFiles = walk(moduleRoot);
  if (!moduleFiles.some((file) => /solution/i.test(path.relative(moduleRoot, file)))) {
    errors.push(`${module} needs separated answer/solution material`);
  }
}
const timedInstruction = /## Exact target time|\bafter minute\b|\btimed\s+(?:study|retrieval|enterprise)|\buse a timer\b|\btime-ordered\b|\b4h45\b|\b285 minutes\b|\bemergency 3-hour\b|\bfinal 60 minutes\b|\b\d+[- ]minutes?\b/i;
for (const directory of ['_internal/docs', '_internal/examples', '_internal/labs']) {
  for (const file of walk(path.join(root, directory))) {
    if (file === path.join(root, '_internal/docs', 'SESSION_HANDOFF.md')) continue;
    if (timedInstruction.test(fs.readFileSync(file, 'utf8'))) errors.push(`${path.relative(root, file)} retains retired timed-course instructions`);
  }
}

const routeReadme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
for (const forbidden of ['4h45', '285 minutes', 'Emergency 3-hour', 'Use a timer']) {
  if (routeReadme.includes(forbidden)) errors.push(`README must not contain retired timed-route text: ${forbidden}`);
}
for (const module of expectedModules) {
  const readme = fs.readFileSync(path.join(examplesRoot, module, 'README.md'), 'utf8');
  if (/## Exact target time|\bafter minute\b|\btimed\s+(?:study|retrieval|enterprise)|\buse a timer\b/i.test(readme)) errors.push(`${module}/README.md retains timed-study instructions`);
}
for (const required of ['visual/README.md', 'hands-on/README.md', 'hands-on/SETUP.md', '_internal/docs/START_HERE.md']) {
  if (!fs.existsSync(path.join(root, required))) errors.push(`missing learner or maintainer route: ${required}`);
}
if (!/thegm26\.github\.io\/gh-200-github-actions/.test(routeReadme) || !routeReadme.includes('hands-on/README.md')) errors.push('README must expose the visual and hands-on routes');
const exerciseRoot = path.join(root, '_internal/exercises');
const exerciseReadmeRequirements = [/^# \d\d — /m, /## Do/, /node _internal\/exercises\//, /It fails[\s\S]*passes|It fails[\s\S]*Passes/i, /Hint:/, /Solution/, /Next:|You finished the canonical route/, /https:\/\/(docs\.github\.com|learn\.microsoft\.com)/];
for (const index of Array.from({ length: 17 }, (_, value) => value + 1)) {
  const id = String(index).padStart(2, '0');
  const directory = fs.readdirSync(exerciseRoot, { withFileTypes: true }).find((entry) => entry.isDirectory() && entry.name.startsWith(`${id}-`))?.name;
  if (!directory) { errors.push(`missing readable exercise ${id}`); continue; }
  const exercise = path.join(exerciseRoot, directory);
  const readme = path.join(exercise, 'README.md');
  const check = path.join(exercise, 'check.mjs');
  const yaml = fs.readdirSync(exercise).find((file) => file === 'workflow.yml' || file === 'action.yml');
  if (!fs.existsSync(readme) || !fs.existsSync(check) || !yaml) { errors.push(`${directory} needs README.md, check.mjs, and editable YAML`); continue; }
  const content = fs.readFileSync(readme, 'utf8');
  for (const requirement of exerciseReadmeRequirements) if (!requirement.test(content)) errors.push(`${directory}/README.md missing readable-exercise requirement: ${requirement}`);
}

const topicCoverage = {
  triggers: ['workflow_dispatch', 'branches:', 'paths:', 'github.event', '&run-defaults'],
  outputs: ['GITHUB_ENV', 'GITHUB_OUTPUT', 'GITHUB_STEP_SUMMARY', 'needs.prepare.outputs'],
  matrixServices: ['fail-fast', 'max-parallel', 'services:', 'health-cmd'],
  reuseTroubleshooting: ['starter workflow', 'reusable workflow', 'composite action', 'disable'],
  actions: ['using: composite', 'using: node24', 'using: docker'],
  enterprise: ['runner group', 'action policy', 'self-hosted', 'retention'],
  security: ['id-token: write', 'full SHA', 'environment: production', 'attestation'],
};
const exampleText = walk(examplesRoot).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
for (const [area, needles] of Object.entries(topicCoverage)) {
  const missing = needles.filter((needle) => !exampleText.toLowerCase().includes(needle.toLowerCase()));
  if (missing.length) errors.push(`${area} example coverage missing: ${missing.join(', ')}`);
}

const executableExampleWorkflows = walk(examplesRoot).filter((file) => /\.(ya?ml)$/i.test(file) && /(?:^|[.-])workflow\.(ya?ml)$/i.test(file));
if (executableExampleWorkflows.length) {
  errors.push(`example workflows must use an inactive .txt suffix: ${executableExampleWorkflows.map((file) => path.relative(root, file)).join(', ')}`);
}
const activeExampleReferences = fs.existsSync(workflowRoot)
  ? walk(workflowRoot).filter((file) => /\.(ya?ml)$/i.test(file) && /(?:examples\/|study example|broken final capstone)/i.test(fs.readFileSync(file, 'utf8')))
  : [];
if (activeExampleReferences.length) errors.push(`active workflows contain example content: ${activeExampleReferences.map((file) => path.relative(root, file)).join(', ')}`);
const executableStarters = walk(path.join(root, '_internal/labs')).filter((file) => file.includes(`${path.sep}starter${path.sep}`) && /\.(ya?ml)$/i.test(file));
if (executableStarters.length) errors.push(`broken starter YAML must be inactive extensions; found ${executableStarters.map((file) => path.relative(root, file)).join(', ')}`);
const activeLabFiles = fs.existsSync(workflowRoot) ? walk(workflowRoot).filter((file) => file.includes(`${path.sep}labs${path.sep}`)) : [];
if (activeLabFiles.length) errors.push(`lab content discovered under active workflows: ${activeLabFiles.join(', ')}`);

const triggerSolution = fs.readFileSync(path.join(examplesRoot, '01-triggers-contexts', 'solution.workflow.yml.txt'), 'utf8');
if (/^run-defaults:/m.test(triggerSolution) || !/^defaults:\s*&/m.test(triggerSolution) || !/^\s+defaults:\s*\*/m.test(triggerSolution)) {
  errors.push('01 solution must use valid defaults.run anchor/alias syntax, not unsupported run-defaults');
}
for (const relative of ['_internal/examples/02-outputs-matrix-services/solution.workflow.yml.txt', '_internal/labs/01-author-manage/solution/release.yml']) {
  const solution = fs.readFileSync(path.join(root, relative), 'utf8');
  if (/runs-on:\s*\$\{\{\s*matrix\.os\s*\}\}[\s\S]*?services:/m.test(solution)) {
    errors.push(`${relative} incorrectly combines a Windows-capable OS matrix with service containers`);
  }
  if (!/runs-on:\s*windows-latest/.test(solution) || !/runs-on:\s*ubuntu-latest[\s\S]*?services:/.test(solution)) {
    errors.push(`${relative} must demonstrate separate Linux service and Windows jobs`);
  }
}
const capstone = fs.readFileSync(path.join(examplesRoot, '12-final-capstone', 'solution', 'capstone.workflow.yml.txt'), 'utf8');
const reusableCapstone = fs.readFileSync(path.join(examplesRoot, '12-final-capstone', 'solution', 'reusable-risk.workflow.yml.txt'), 'utf8');
if (!/uses:\s*\.\/\.github\/workflows\/reusable-risk\.yml/.test(capstone) || !/needs\.risk\.outputs\.risk/.test(capstone) || !/on:\s*\n\s*workflow_call:/.test(reusableCapstone) || !/steps\.score\.outputs\.risk/.test(reusableCapstone)) {
  errors.push('final capstone must demonstrate caller and reusable workflow outputs');
}
const actionVerifier = fs.readFileSync(path.join(examplesRoot, '05-custom-actions', 'verify.mjs'), 'utf8');
if (!/process\.exitCode\s*=\s*1/.test(actionVerifier)) errors.push('custom-action verifier must fail incomplete work');
const securePattern = fs.readFileSync(path.join(root, '_internal/labs/05-secure-optimize/solution/secure-pattern.yml'), 'utf8');
if (/^permissions:\s*\{[^}]*?(?:id-token|attestations):\s*write/m.test(securePattern)) errors.push('Lab 05 must not grant OIDC or attestation permissions globally');

const instructionalYaml = [
  '_internal/labs/01-author-manage/solution/release.yml',
  '_internal/labs/05-secure-optimize/solution/secure-pattern.yml',
  '_internal/examples/12-final-capstone/solution/capstone.workflow.yml.txt',
];
for (const relative of instructionalYaml) {
  const text = fs.readFileSync(path.join(root, relative), 'utf8');
  const document = parseDocument(text, { merge: true });
  if (document.errors.length) {
    errors.push(`${relative} must parse as YAML: ${document.errors.map((error) => error.message).join('; ')}`);
  }
}
const mergeFragment = fs.readFileSync(path.join(root, '_internal/examples/04-consume-troubleshoot/workflow-fragment.yml.txt'), 'utf8');
const mergeDocument = parseDocument(mergeFragment, { merge: true });
if (mergeDocument.errors.length) {
  errors.push(`04 workflow fragment must parse with anchor/alias/merge-key syntax: ${mergeDocument.errors.map((error) => error.message).join('; ')}`);
} else {
  const mergedRun = mergeDocument.toJS({ merge: true })?.jobs?.lint?.defaults?.run;
  if (mergedRun?.['timeout-minutes'] !== 10 || mergedRun?.shell !== 'pwsh') {
    errors.push('04 workflow fragment must preserve timeout 10 while an explicit shell overrides the merged anchor value.');
  }
}

function primaryUrls() {
  const allowed = new Set(['docs.github.com', 'learn.microsoft.com', 'cli.github.com', 'github.com']);
  const files = [path.join(root, 'README.md'), ...walk(path.join(root, '_internal/docs')), ...walk(path.join(root, '_internal/labs')), ...walk(path.join(root, '_internal/examples')), ...walk(path.join(root, '_internal/exercises')), path.join(root, 'quiz', 'questions.json')];
  const urls = new Set();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const match of text.matchAll(/https:\/\/[^\s)"'`>]+/g)) {
      const url = match[0].replace(/[.,;]+$/, '');
      try { if (allowed.has(new URL(url).hostname) && !isIllustrativeTemplateUrl(url)) urls.add(url); } catch { errors.push(`invalid URL in ${path.relative(root, file)}: ${url}`); }
    }
  }
  return [...urls].sort();
}

async function verifyLinks() {
  const failures = [];
  for (const url of primaryUrls()) {
    let response;
    try {
      response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15_000) });
      if (response.status === 405 || response.status === 501) response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15_000) });
      if (!response.ok) failures.push(`${response.status} ${url}`);
    } catch (error) { failures.push(`${url}: ${error.message}`); }
  }
  if (failures.length) errors.push(`primary-link check failed:\n${failures.join('\n')}`);
  else console.log(`Primary links reachable: ${primaryUrls().length}.`);
}
if (checkLinks) await verifyLinks();
if (errors.length) { console.error(`Content validation failed:\n- ${errors.join('\n- ')}`); process.exitCode = 1; }
else console.log(`Content valid: ${questions.length} questions; ${expectedLabs.length} domain indexes; ${expectedModules.length} focused examples; inactive challenge YAML confirmed.`);
