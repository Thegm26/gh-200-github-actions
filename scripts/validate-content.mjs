#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadQuestions, validateQuestions } from './quiz.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedLabs = ['01-author-manage', '02-consume-troubleshoot', '03-author-actions', '04-enterprise', '05-secure-optimize'];
const requiredDocs = ['README.md', 'docs/BLUEPRINT.md', 'docs/CHEAT_SHEET.md', 'docs/EXAM_STRATEGY.md', 'docs/LAST_HOUR.md', 'docs/SOURCES.md'];
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
const workflowRoot = path.join(root, '.github', 'workflows');
const executableStarters = walk(path.join(root, 'labs')).filter((file) => file.includes(`${path.sep}starter${path.sep}`) && /\.(ya?ml)$/i.test(file));
if (executableStarters.length) errors.push(`broken starter YAML must be inactive extensions; found ${executableStarters.map((file) => path.relative(root, file)).join(', ')}`);
const activeLabFiles = fs.existsSync(workflowRoot) ? walk(workflowRoot).filter((file) => file.includes(`${path.sep}labs${path.sep}`)) : [];
if (activeLabFiles.length) errors.push(`lab content discovered under active workflows: ${activeLabFiles.join(', ')}`);
if (errors.length) { console.error(`Content validation failed:\n- ${errors.join('\n- ')}`); process.exitCode = 1; }
else console.log(`Content valid: ${questions.length} questions; ${expectedLabs.length} labs; inactive lab YAML confirmed.`);
