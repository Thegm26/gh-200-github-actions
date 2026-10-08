import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const examples = path.join(root, 'examples');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

test('the beginner route is untimed and links to the canonical learning flow', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.doesNotMatch(readme, /4h45|285 minutes|Use a timer|Emergency 3-hour/i);
  assert.match(readme, /npm run learn -- start 01-first-workflow/);
  assert.match(readme, /docs\/START_HERE\.md/);
});

test('beginner-facing curriculum has no retired timer route language', () => {
  const retired = /Exact target time|\bafter minute\b|\btimed\s+(?:study|retrieval|enterprise)|\buse a timer\b|\btime-ordered\b|\b4h45\b|\b285 minutes\b|\bemergency 3-hour\b|\bfinal 60 minutes\b|\b\d+[- ]minutes?\b/i;
  for (const directory of ['docs', 'examples', 'labs']) {
    for (const file of walk(path.join(root, directory))) {
      if (file === path.join(root, 'docs', 'SESSION_HANDOFF.md')) continue;
      assert.doesNotMatch(fs.readFileSync(file, 'utf8'), retired, file);
    }
  }
});

test('supplementary drills are concrete manual extensions, not checker claims', () => {
  const drills = fs.readFileSync(path.join(root, 'docs/EXTRA_EXERCISES.md'), 'utf8');
  for (const file of [
    '.practice/extra-events/workflow.yml.txt',
    '.practice/extra-reusable/called.yml.txt',
    '.practice/extra-summary/workflow.yml.txt',
    '.practice/extra-storage/decision.md',
    '.practice/extra-scopes/scope-plan.md',
    '.practice/extra-action-release/plan.md',
    '.practice/extra-enterprise/access-plan.md',
    '.practice/extra-attestation/verification-notes.md',
  ]) assert.match(drills, new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(drills, /canonical lab checker does not inspect these drills/i);
  assert.match(drills, /repository_dispatch[\s\S]*release-ready/);
  assert.match(drills, /type` is `boolean/i);
  assert.match(drills, /deploy_token/);
  assert.match(drills, /GITHUB_ENV/);
  assert.match(drills, /retention-days: 14/);
  assert.match(drills, /GitHub-signed attestation/i);
});

test('all thirteen example modules have a study manifest and solution', () => {
  const modules = fs.readdirSync(examples, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  assert.equal(modules.length, 13);
  for (const module of modules) {
    const moduleRoot = path.join(examples, module.name);
    const readme = fs.readFileSync(path.join(moduleRoot, 'README.md'), 'utf8');
    for (const heading of ['Prerequisites and focused goal', 'Objective and domain', 'Files to inspect or edit', 'Tasks', 'Expected observable result', 'Verification commands or checklist', 'Answer or solution location', 'Primary official links']) {
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

test('custom-action verifier fails while the learner workspace is incomplete', () => {
  const fixture = fs.mkdtempSync(path.join(root, '.tmp action #fixture-'));
  try {
    for (const [relative, contents] of Object.entries({
      'composite/action.yml': 'name: incomplete composite\ndescription: fixture\nruns:\n  using: composite\n  steps: []\n',
      'javascript/action.yml': 'name: incomplete javascript\ndescription: fixture\nruns:\n  using: node24\n  main: index.cjs\n',
      'docker/action.yml.txt': 'name: inactive docker\ndescription: fixture\nruns:\n  using: docker\n  image: Dockerfile\n',
    })) {
      const target = path.join(fixture, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, contents);
    }
    const result = spawnSync(process.execPath, [path.join(examples, '05-custom-actions/verify.mjs')], { encoding: 'utf8', env: { ...process.env, GH200_ACTION_WORKSPACE: fixture } });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Exercise incomplete/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('instructional workflow solutions keep services on Linux and model reusable outputs', () => {
  for (const relative of ['examples/02-outputs-matrix-services/solution.workflow.yml.txt', 'labs/01-author-manage/solution/release.yml']) {
    const text = fs.readFileSync(path.join(root, relative), 'utf8');
    assert.doesNotMatch(text, /runs-on:\s*\$\{\{\s*matrix\.os\s*\}\}[\s\S]*?services:/m);
    assert.match(text, /runs-on:\s*ubuntu-latest[\s\S]*?services:/);
    assert.match(text, /runs-on:\s*windows-latest/);
  }
  const caller = fs.readFileSync(path.join(examples, '12-final-capstone/solution/capstone.workflow.yml.txt'), 'utf8');
  const reusable = fs.readFileSync(path.join(examples, '12-final-capstone/solution/reusable-risk.workflow.yml.txt'), 'utf8');
  assert.match(caller, /needs\.risk\.outputs\.risk/);
  assert.match(reusable, /workflow_call:/);
  assert.match(reusable, /steps\.score\.outputs\.risk/);
});

test('instructional YAML solutions parse and the troubleshooting fragment models merge precedence', () => {
  const yamlSolutions = [
    'labs/01-author-manage/solution/release.yml',
    'labs/05-secure-optimize/solution/secure-pattern.yml',
    'examples/12-final-capstone/solution/capstone.workflow.yml.txt',
  ];
  for (const relative of yamlSolutions) {
    const document = parseDocument(fs.readFileSync(path.join(root, relative), 'utf8'), { merge: true });
    assert.equal(document.errors.length, 0, `${relative}: ${document.errors.map((error) => error.message).join('; ')}`);
  }
  const mergeDocument = parseDocument(fs.readFileSync(path.join(examples, '04-consume-troubleshoot/workflow-fragment.yml.txt'), 'utf8'), { merge: true });
  assert.equal(mergeDocument.errors.length, 0, mergeDocument.errors.map((error) => error.message).join('; '));
  assert.deepEqual(mergeDocument.toJS({ merge: true }).jobs.lint.defaults.run, { 'timeout-minutes': 10, shell: 'pwsh' });
});
