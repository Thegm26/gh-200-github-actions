import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);

test('root keeps the two learner routes and relocates maintenance material', () => {
  for (const name of ['visual', 'hands-on', '_internal', '.github', 'README.md', 'package.json', 'package-lock.json', 'LICENSE', 'Dockerfile']) assert.ok(fs.existsSync(path.join(root, name)), `${name} is present`);
  for (const name of ['docs', 'examples', 'exercises', 'labs', 'learning', 'quiz', 'references', 'scripts', 'src', 'test', 'web', 'index.html']) assert.ok(!fs.existsSync(path.join(root, name)), `${name} is not a root route`);
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.ok(readme.trim().split('\n').length <= 25);
  assert.match(readme, /thegm26\.github\.io\/gh-200-github-actions/);
  assert.match(readme, /hands-on\/README\.md/);
  assert.ok(fs.existsSync(path.join(root, 'visual/.nojekyll')));
});

test('authored markdown navigation resolves after the layout move', () => {
  const scopes = ['hands-on', '_internal/docs', '_internal/examples', '_internal/exercises', '_internal/labs'];
  for (const file of scopes.flatMap((scope) => walk(path.join(root, scope))).filter((file) => file.endsWith('.md'))) {
    if (file.endsWith('_internal/docs/SESSION_HANDOFF.md')) continue;
    const markdown = fs.readFileSync(file, 'utf8');
    for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].replace(/^<|>$/g, '').split('#')[0];
      if (!target || /^(?:https?:|mailto:|#)/.test(target)) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), target)), `${path.relative(root, file)} -> ${target}`);
    }
  }
});
