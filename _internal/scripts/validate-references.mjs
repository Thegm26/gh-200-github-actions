#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const catalogPath = path.join(root, '_internal/references', 'catalog.json');
const errors = [];
let catalog = [];
try { catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')); } catch (error) { errors.push(`cannot read _internal/references/catalog.json: ${error.message}`); }
if (!Array.isArray(catalog) || !catalog.length) errors.push('catalog must be a nonempty array');
const ids = new Set();
for (const entry of catalog) {
  const label = entry?.id || 'unknown entry';
  for (const field of ['id', 'title', 'url', 'kind', 'summary']) if (typeof entry?.[field] !== 'string' || !entry[field].trim()) errors.push(`${label} missing ${field}`);
  if (ids.has(entry?.id)) errors.push(`duplicate catalog id ${entry?.id}`); ids.add(entry?.id);
  if (!['primary', 'secondary'].includes(entry?.kind)) errors.push(`${label} has invalid kind`);
  if (!/^https:\/\//.test(entry?.url || '')) errors.push(`${label} needs an https URL`);
  if (entry?.localPath) {
    if (typeof entry.localPath !== 'string' || entry.localPath.startsWith('/') || entry.localPath.includes('..')) errors.push(`${label} has unsafe localPath`);
    const target = path.join(root, entry.localPath || '');
    if (!fs.existsSync(target)) errors.push(`${label} missing ${entry.localPath}`);
    else {
      const normalized = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
      const hash = crypto.createHash('sha256').update(normalized).digest('hex');
      if (!/^[a-f0-9]{64}$/.test(entry.sha256 || '')) errors.push(`${label} needs a normalized sha256`);
      else if (entry.sha256 !== hash) errors.push(`${label} sha256 mismatch`);
    }
    if (!['original-summary', 'source-snapshot'].includes(entry.contentType)) errors.push(`${label} needs contentType`);
  }
}
for (const id of ['ms-gh200-study-guide-2026-01', 'ms-learn-actions-part-1', 'ms-learn-actions-part-2', 'official-gh200-practice-assessment', 'official-exam-sandbox']) if (!ids.has(id)) errors.push(`catalog missing ${id}`);
for (const snapshot of catalog.filter((entry) => entry.contentType === 'source-snapshot')) {
  if (!/CC-BY-4\.0/.test(snapshot.license || '') || !/github\.com\/github\/docs\/blob\/[a-f0-9]{40}/.test(snapshot.url || '')) errors.push(`${snapshot.id} needs pinned GitHub Docs CC-BY attribution metadata`);
}
const blueprint = fs.readFileSync(path.join(root, '_internal/docs', 'BLUEPRINT.md'), 'utf8');
for (const heading of ['### Author and manage workflows', '### Consume and troubleshoot workflows', '### Author and maintain actions', '### Manage GitHub Actions for the enterprise', '### Secure and optimize automation']) if (!blueprint.includes(heading)) errors.push(`BLUEPRINT missing complete coverage heading ${heading}`);
let coverage = [];
try { coverage = JSON.parse(fs.readFileSync(path.join(root, '_internal/references', 'coverage.json'), 'utf8')); } catch (error) { errors.push(`cannot read coverage.json: ${error.message}`); }
const questions = JSON.parse(fs.readFileSync(path.join(root, '_internal/quiz', 'questions.json'), 'utf8'));
const questionIds = new Set(questions.map((question) => question.id));
const expectedCoverage = ['AM-01','AM-02','AM-03','AM-04','AM-05','AM-06','AM-07','AM-08','AM-09','AM-10','AM-11','AM-12','AM-13','AM-14','AM-15','AM-16','CT-01','CT-02','CT-03','CT-04','CT-05','CT-06','CT-07','CT-08','CT-09','CT-10','CT-11','AA-01','AA-02','AA-03','AA-04','AA-05','AA-06','AA-07','EN-01','EN-02','EN-03','EN-04','EN-05','EN-06','EN-07','EN-08','EN-09','SO-01','SO-02','SO-03','SO-04','SO-05','SO-06','SO-07','SO-08','SO-09','SO-10'];
if (!Array.isArray(coverage) || coverage.length !== expectedCoverage.length) errors.push(`coverage must contain exactly ${expectedCoverage.length} official objective rows`);
const cheat = fs.readFileSync(path.join(root, '_internal/docs', 'CHEAT_SHEET.md'), 'utf8');
for (const row of coverage) {
  if (!expectedCoverage.includes(row?.id)) errors.push(`unknown coverage id ${row?.id}`);
  if (!Array.isArray(row?.questions) || !row.questions.length || row.questions.some((id) => !questionIds.has(id))) errors.push(`${row?.id} has missing question mapping`);
  if (!Array.isArray(row?.references) || !row.references.length || row.references.some((id) => !ids.has(id))) errors.push(`${row?.id} has missing reference mapping`);
  if (typeof row?.practice !== 'string' || !row.practice) errors.push(`${row?.id} has no practice path`);
  else {
    const [relative, fragment] = row.practice.split('#');
    const practicePath = path.join(root, relative);
    if (!fs.existsSync(practicePath)) errors.push(`${row.id} practice path is missing: ${relative}`);
    else if (fragment) {
      const normalizeHeading = (value) => value.replace(/^#+\s+/, '').replace(/[`*_.,:/]/g, '').replace(/-/g, ' ').toLowerCase();
      const expectedHeading = normalizeHeading(fragment);
      const headings = fs.readFileSync(practicePath, 'utf8').match(/^#+\s+.+$/gm) || [];
      if (!headings.some((heading) => normalizeHeading(heading) === expectedHeading)) errors.push(`${row.id} practice anchor is missing: #${fragment}`);
    }
  }
  if (typeof row?.cheatSection !== 'string' || !cheat.includes(`## ${row.cheatSection}`)) errors.push(`${row?.id} has missing cheat-sheet section`);
  if (!/^(local|manual|hosted)(\+(local|manual|hosted))*$/.test(row?.mode || '')) errors.push(`${row?.id} has invalid practice mode`);
}
for (const id of expectedCoverage) if (!coverage.some((row) => row.id === id)) errors.push(`coverage missing ${id}`);
if (errors.length) { process.stderr.write(`${errors.join('\n')}\n`); process.exitCode = 1; }
else process.stdout.write(`Valid: ${catalog.length} catalog references with normalized local hashes.\n`);
