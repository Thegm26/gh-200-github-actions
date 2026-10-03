#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadQuestions, validateQuestions } from './quiz.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowRoot = path.join(root, '.github', 'workflows');
const expectedLabs = ['01-author-manage', '02-consume-troubleshoot', '03-author-actions', '04-enterprise', '05-secure-optimize'];
const requiredDocs = ['README.md', 'docs/BLUEPRINT.md', 'docs/CHEAT_SHEET.md', 'docs/EXAM_STRATEGY.md', 'docs/LAST_HOUR.md', 'docs/SOURCES.md'];
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
  '## Exact target time',
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
const minimumByDomain = { 'author-manage': 15, 'consume-troubleshoot': 11, 'author-actions': 11, enterprise: 15, 'secure-optimize': 8 };
for (const [domain, minimum] of Object.entries(minimumByDomain)) {
  const count = questions.filter((question) => question.domain === domain).length;
  if (count < minimum) errors.push(`${domain} has ${count} questions; requires at least ${minimum}`);
}

for (const item of requiredDocs) if (!fs.existsSync(path.join(root, item))) errors.push(`missing required ${item}`);
for (const lab of expectedLabs) {
  const labRoot = path.join(root, 'labs', lab);
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

const examplesRoot = path.join(root, 'examples');
for (const module of expectedModules) {
  const moduleRoot = path.join(examplesRoot, module);
  const readme = path.join(moduleRoot, 'README.md');
  if (!fs.existsSync(readme)) {
    errors.push(`missing examples/${module}/README.md`);
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

const routeReadme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const routeRows = [...routeReadme.matchAll(/^\|\s*\d{2}:\d{2}–\d{2}:\d{2}\s*\|\s*(\d+)\s*\|([^\n]+)$/gm)];
const routeMinutes = routeRows.reduce((sum, match) => sum + Number(match[1]), 0);
if (routeMinutes !== 285) errors.push(`4h45 route totals ${routeMinutes} minutes; expected 285`);
if (routeRows.length !== 18) errors.push(`4h45 route has ${routeRows.length} blocks; expected 18`);
for (const [, minutes, activity] of routeRows) {
  const isBreak = /\bbreak\b/i.test(activity);
  const hasExerciseLink = /\]\(examples\/[^)]+\/README\.md(?:#[^)]+)?\)/.test(activity);
  if (!isBreak && !hasExerciseLink) errors.push(`active ${minutes}-minute route block does not link to an example: ${activity.trim()}`);
}
for (const module of expectedModules) {
  if (!routeReadme.includes(`examples/${module}/README.md`)) errors.push(`route does not link to examples/${module}`);
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
const executableStarters = walk(path.join(root, 'labs')).filter((file) => file.includes(`${path.sep}starter${path.sep}`) && /\.(ya?ml)$/i.test(file));
if (executableStarters.length) errors.push(`broken starter YAML must be inactive extensions; found ${executableStarters.map((file) => path.relative(root, file)).join(', ')}`);
const activeLabFiles = fs.existsSync(workflowRoot) ? walk(workflowRoot).filter((file) => file.includes(`${path.sep}labs${path.sep}`)) : [];
if (activeLabFiles.length) errors.push(`lab content discovered under active workflows: ${activeLabFiles.join(', ')}`);
if (errors.length) { console.error(`Content validation failed:\n- ${errors.join('\n- ')}`); process.exitCode = 1; }
else console.log(`Content valid: ${questions.length} questions; ${expectedLabs.length} labs; ${expectedModules.length} timed example modules; route=285 minutes; inactive challenge YAML confirmed.`);
