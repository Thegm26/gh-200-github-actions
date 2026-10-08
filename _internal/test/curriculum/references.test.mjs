import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, '_internal/references/catalog.json'), 'utf8'));

test('reference validator accepts the catalog and offline files', () => {
  const output = execFileSync(process.execPath, ['_internal/scripts/validate-references.mjs'], { cwd: root, encoding: 'utf8' });
  assert.match(output, /Valid:/);
});

test('local reference hashes are stable across LF and CRLF checkouts', () => {
  for (const entry of catalog.filter((item) => item.localPath)) {
    const source = fs.readFileSync(path.join(root, entry.localPath), 'utf8');
    const lf = source.replace(/\r\n/g, '\n');
    const crlf = lf.replace(/\n/g, '\r\n');
    const hash = (text) => crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
    assert.equal(hash(lf), entry.sha256, entry.id);
    assert.equal(hash(crlf), entry.sha256, entry.id);
  }
});

test('catalog labels source snapshots, summaries, and honest exam-practice resources', () => {
  assert.ok(catalog.some((item) => item.contentType === 'source-snapshot'));
  assert.ok(catalog.some((item) => item.contentType === 'original-summary'));
  const practice = catalog.filter((item) => item.category === 'exam-practice');
  assert.ok(practice.some((item) => item.access === 'free'));
  assert.ok(practice.some((item) => item.access === 'paid' && item.kind === 'secondary'));
  assert.ok(practice.every((item) => /not a past exam|not a released past exam|not GH-200 question practice/i.test(item.summary)));
});
