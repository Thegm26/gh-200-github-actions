import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { copyStarter, labById, learningRoot, resetStarter, tempWorkspace, validateLab } from '../../scripts/learn-lib.mjs';

test('list includes each lab goal as a catalog column', () => {
  const result = spawnSync(process.execPath, ['scripts/learn.mjs', 'list'], { cwd: process.cwd(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^ID\tDOMAIN\tMODE\tGOAL\tTITLE$/m);
  assert.match(result.stdout, /^09-reusable-call\tconsume-troubleshoot\tGitHub exercise\tCall a reusable workflow\.\tReusable call$/m);
});

function alteredSolution(id, from, to) {
  const lab = labById(id); const directory = tempWorkspace(); const target = path.join(directory, lab.file);
  fs.cpSync(path.join(learningRoot, 'solutions', id, lab.file), target);
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace(from, to));
  return { lab, directory };
}

test('start never overwrites an existing lab', () => {
  const base = tempWorkspace(); const lab = labById('01-first-workflow');
  try { copyStarter(lab, base); assert.throws(() => copyStarter(lab, base), /already exists/); } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
test('reset requires confirmation and refuses symbolic-link targets', (t) => {
  const base = tempWorkspace(); const outside = tempWorkspace(); const lab = labById('01-first-workflow');
  try { assert.throws(() => resetStarter(lab, base, false), /Reset refused/); try { fs.symlinkSync(outside, path.join(base, lab.id)); } catch (error) { if (error.code === 'EPERM') return t.skip('This Windows environment cannot create symbolic links; runtime guard remains covered where supported.'); throw error; } assert.throws(() => resetStarter(lab, base, true), /symbolic-link lab/); assert.ok(fs.existsSync(outside)); } finally { fs.rmSync(base, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});
test('workspace root symbolic links are refused before writes', (t) => {
  const parent = tempWorkspace(); const outside = tempWorkspace(); const lab = labById('01-first-workflow');
  try { const link = path.join(parent, 'workspace'); try { fs.symlinkSync(outside, link); } catch (error) { if (error.code === 'EPERM') return t.skip('This Windows environment cannot create symbolic links; runtime guard remains covered where supported.'); throw error; } assert.throws(() => copyStarter(lab, link), /symbolic-link workspace root/); assert.deepEqual(fs.readdirSync(outside), []); } finally { fs.rmSync(parent, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});
test('output, evidence, and OIDC validators reject semantic bypasses', () => {
  const cases = [
    ['05-job-output', '$GITHUB_OUTPUT', '$NOT_OUTPUT'],
    ['06-needs-output', '$GITHUB_OUTPUT', '$NOT_OUTPUT'],
    ['11-failure-evidence', '>> "$GITHUB_STEP_SUMMARY"', '"$GITHUB_STEP_SUMMARY"'],
    ['11-failure-evidence', 'always()', 'always() && false'],
    ['14-oidc-job', 'contents: read}', 'contents: read, packages: write}'],
    ['13-least-privilege', 'steps: [{run: echo ready}]', 'permissions: {contents: write}, steps: [{run: echo ready}]'],
  ];
  for (const [id, from, to] of cases) { const item = alteredSolution(id, from, to); try { assert.notEqual(validateLab(item.lab, item.directory).length, 0, `${id} accepted ${to}`); } finally { fs.rmSync(item.directory, { recursive: true, force: true }); } }
});
test('permission maps ignore key order', () => {
  const oidc = alteredSolution('14-oidc-job', 'permissions: {id-token: write, contents: read}', 'permissions: {contents: read, id-token: write}');
  try { assert.deepEqual(validateLab(oidc.lab, oidc.directory), []); } finally { fs.rmSync(oidc.directory, { recursive: true, force: true }); }
});
test('workflow baseline accepts event shorthand but rejects malformed triggers and invalid steps', () => {
  const shorthand = alteredSolution('02-job-and-runner', 'on: {workflow_dispatch: {}}', 'on: push');
  const trigger = alteredSolution('01-first-workflow', 'workflow_dispatch: {}', 'workflow_dispatch: false');
  const step = alteredSolution('02-job-and-runner', 'run: echo build', 'run: ""');
  const both = alteredSolution('02-job-and-runner', 'run: echo build', 'run: echo build, uses: actions/checkout@v4');
  const malformed = alteredSolution('02-job-and-runner', 'on: {workflow_dispatch: {}}', 'on: [workflow_dispatch, 2]');
  const nullStep = alteredSolution('02-job-and-runner', 'steps: [{run: echo build}]', 'steps: [null]');
  try {
    assert.deepEqual(validateLab(shorthand.lab, shorthand.directory), []);
    assert.ok(validateLab(trigger.lab, trigger.directory).length);
    assert.ok(validateLab(step.lab, step.directory).length);
    assert.ok(validateLab(both.lab, both.directory).length);
    assert.doesNotThrow(() => validateLab(malformed.lab, malformed.directory));
    assert.ok(validateLab(malformed.lab, malformed.directory).length);
    assert.doesNotThrow(() => validateLab(nullStep.lab, nullStep.directory));
    assert.ok(validateLab(nullStep.lab, nullStep.directory).length);
  } finally { for (const item of [shorthand, trigger, step, both, malformed, nullStep]) fs.rmSync(item.directory, { recursive: true, force: true }); }
});
