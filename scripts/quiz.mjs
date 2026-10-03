#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const questionPath = path.join(root, 'quiz', 'questions.json');
const domains = ['author-manage', 'consume-troubleshoot', 'author-actions', 'enterprise', 'secure-optimize'];

export function loadQuestions(file = questionPath) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function validateQuestions(questions) {
  const errors = [];
  const seen = new Set();
  if (!Array.isArray(questions) || questions.length < 60) errors.push('questions.json must contain at least 60 questions');
  for (const [index, q] of questions.entries()) {
    const label = `question[${index}]`;
    if (!q || typeof q !== 'object') { errors.push(`${label} must be an object`); continue; }
    for (const key of ['id', 'question', 'explanation', 'domain', 'objective', 'options', 'correct', 'sources']) if (!(key in q)) errors.push(`${label} missing ${key}`);
    if (seen.has(q.id)) errors.push(`${label} duplicate id ${q.id}`); seen.add(q.id);
    if (!domains.includes(q.domain)) errors.push(`${label} invalid domain ${q.domain}`);
    if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((v) => typeof v !== 'string' || !v.trim())) errors.push(`${label} needs exactly four nonempty options`);
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) errors.push(`${label} correct must be 0–3`);
    if (!Array.isArray(q.sources) || !q.sources.length || q.sources.some((url) => !/^https:\/\/(?:docs\.github\.com|learn\.microsoft\.com)\/|^https:\/\/github\.com\/actions\/runner-images(?:\/|$)/.test(url))) errors.push(`${label} needs primary https source URL(s)`);
  }
  for (const domain of domains) if (!questions.some((q) => q.domain === domain)) errors.push(`missing ${domain} coverage`);
  return errors;
}

function seededRandom(seed) {
  let value = 2166136261;
  for (const character of String(seed)) { value ^= character.charCodeAt(0); value = Math.imul(value, 16777619); }
  return () => { value += 0x6D2B79F5; let t = value; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function selectQuestions(questions, { count, domain, seed }) {
  const filtered = domain ? questions.filter((q) => q.domain === domain) : [...questions];
  const random = seededRandom(seed ?? 'gh-200');
  for (let index = filtered.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [filtered[index], filtered[target]] = [filtered[target], filtered[index]];
  }
  return filtered.slice(0, Math.min(count ?? filtered.length, filtered.length));
}

function usage() {
  return `Usage: npm run quiz -- [--count N] [--domain ${domains.join('|')}] [--seed TEXT] [--review-wrong] [--list-domains] [--validate]`;
}

export function parseArgs(args) {
  const options = { seed: 'gh-200', count: undefined, domain: undefined, reviewWrong: false, listDomains: false, validate: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--review-wrong') options.reviewWrong = true;
    else if (arg === '--list-domains') options.listDomains = true;
    else if (arg === '--validate') options.validate = true;
    else if (arg === '--count' || arg === '--domain' || arg === '--seed') {
      const value = args[++index];
      if (value === undefined) throw new Error(`${arg} needs a value`);
      if (arg === '--count') { options.count = Number(value); if (!Number.isInteger(options.count) || options.count < 1) throw new Error('--count must be a positive integer'); }
      if (arg === '--domain') { options.domain = value; if (!domains.includes(value)) throw new Error(`unknown domain: ${value}`); }
      if (arg === '--seed') options.seed = value;
    } else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return options;
}

async function askQuestion(rl, q, position, total) {
  process.stdout.write(`\n${position}/${total} [${q.domain}] ${q.question}\n`);
  q.options.forEach((option, index) => process.stdout.write(`  ${String.fromCharCode(65 + index)}. ${option}\n`));
  const answer = (await rl.question('Answer (A-D): ')).trim().toUpperCase();
  const selected = /^[A-D]$/.test(answer) ? answer.charCodeAt(0) - 65 : Number.parseInt(answer, 10) - 1;
  const right = selected === q.correct;
  process.stdout.write(`${right ? 'Correct.' : `Incorrect. Correct: ${String.fromCharCode(65 + q.correct)}.`} ${q.explanation}\n`);
  return right;
}

function report(results, total) {
  const byDomain = Object.fromEntries(domains.map((domain) => [domain, { asked: 0, right: 0 }]));
  for (const result of results) { byDomain[result.q.domain].asked += 1; if (result.right) byDomain[result.q.domain].right += 1; }
  const correct = results.filter((result) => result.right).length;
  process.stdout.write(`\nScore: ${correct}/${total}\nDomain breakdown:\n`);
  for (const domain of domains) {
    const value = byDomain[domain];
    if (!value.asked) continue;
    const percent = Math.round((value.right / value.asked) * 100);
    process.stdout.write(`  ${domain}: ${value.right}/${value.asked} (${percent}%)\n`);
  }
  const weak = domains.filter((domain) => byDomain[domain].asked && byDomain[domain].right / byDomain[domain].asked < 0.7);
  process.stdout.write(weak.length ? `Weak-area recommendation: revisit ${weak.join(', ')} labs and run a seeded domain quiz.\n` : 'Weak-area recommendation: increase count and keep interleaving domains.\n');
}

export async function main(args = process.argv.slice(2)) {
  let options;
  try { options = parseArgs(args); } catch (error) { process.stderr.write(`${error.message}\n${usage()}\n`); process.exitCode = 1; return; }
  if (options.help) { process.stdout.write(`${usage()}\n`); return; }
  const questions = loadQuestions();
  const errors = validateQuestions(questions);
  if (options.validate) { process.stdout.write(errors.length ? `${errors.join('\n')}\n` : `Valid: ${questions.length} questions across ${domains.length} domains.\n`); if (errors.length) process.exitCode = 1; return; }
  if (errors.length) { process.stderr.write(`Question bank invalid:\n${errors.join('\n')}\n`); process.exitCode = 1; return; }
  if (options.listDomains) { domains.forEach((domain) => process.stdout.write(`${domain}\n`)); return; }
  const selected = selectQuestions(questions, options);
  if (!selected.length) { process.stderr.write('No questions match the requested filter.\n'); process.exitCode = 1; return; }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const results = [];
  try {
    for (const [index, q] of selected.entries()) results.push({ q, right: await askQuestion(rl, q, index + 1, selected.length) });
    report(results, selected.length);
    if (options.reviewWrong) {
      const wrong = results.filter((result) => !result.right);
      if (wrong.length) {
        process.stdout.write('\nReview wrong answers (answer again):\n');
        for (const [index, result] of wrong.entries()) await askQuestion(rl, result.q, index + 1, wrong.length);
      } else process.stdout.write('\nNo wrong answers to review.\n');
    }
  } finally { rl.close(); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
