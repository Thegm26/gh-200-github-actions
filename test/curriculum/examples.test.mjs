import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const examples = path.join(root, 'examples');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

test('the route totals 285 minutes and every active block links to an example', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const rows = [...readme.matchAll(/^\|\s*\d{2}:\d{2}–\d{2}:\d{2}\s*\|\s*(\d+)\s*\|([^\n]+)$/gm)];
  assert.equal(rows.reduce((sum, row) => sum + Number(row[1]), 0), 285);
  assert.equal(rows.length, 18);
  for (const [, , activity] of rows) {
    if (!/\bbreak\b/i.test(activity)) assert.match(activity, /\]\(examples\/[^)]+\/README\.md/);
  }
});

test('all thirteen example modules have a study manifest and solution', () => {
  const modules = fs.readdirSync(examples, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  assert.equal(modules.length, 13);
  for (const module of modules) {
    const moduleRoot = path.join(examples, module.name);
    const readme = fs.readFileSync(path.join(moduleRoot, 'README.md'), 'utf8');
    for (const heading of ['Exact target time', 'Objective and domain', 'Files to inspect or edit', 'Tasks', 'Expected observable result', 'Verification commands or checklist', 'Answer or solution location', 'Primary official links']) {
      assert.match(readme, new RegExp(`## ${heading}`), `${module.name} missing ${heading}`);
    }
    assert.ok(walk(moduleRoot).some((file) => /solution/i.test(path.relative(moduleRoot, file))), `${module.name} missing solution material`);
  }
});

test('dangerous workflow examples are inactive and active workflows do not import examples', () => {
  const activeWorkflowExtensions = walk(examples).filter((file) => /(?:^|[.-])workflow\.ya?ml$/i.test(file));
  assert.deepEqual(activeWorkflowExtensions, []);
  for (const file of walk(path.join(root, '.github', 'workflows'))) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /examples\//);
  }
});

test('custom action examples cover composite, JavaScript, and inactive Docker metadata', () => {
  const actionRoot = path.join(examples, '05-custom-actions');
  assert.match(fs.readFileSync(path.join(actionRoot, 'solution/composite/action.yml'), 'utf8'), /using:\s*composite/);
  assert.match(fs.readFileSync(path.join(actionRoot, 'solution/javascript/action.yml'), 'utf8'), /using:\s*node24/);
  assert.match(fs.readFileSync(path.join(actionRoot, 'solution/docker/action.yml.txt'), 'utf8'), /using:\s*docker/);
});
