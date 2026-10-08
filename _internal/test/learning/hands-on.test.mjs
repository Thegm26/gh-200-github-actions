import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import YAML from 'yaml';
import test from 'node:test';

const run = (command, args, options = {}) => spawnSync(command, args, { encoding: 'utf8', ...options });
const workflow = (id, file) => YAML.parse(readFileSync(`hands-on/${id}/${file}`, 'utf8'));

test('hands-on structural verifier accepts all inactive templates', () => {
  const checked = run(process.execPath, ['_internal/scripts/verify-hands-on.mjs']);
  assert.equal(checked.status, 0, checked.stderr);
});

test('08 Redis repair changes the socket target, waits for health, and sends CRLF bytes', () => {
  const starter = workflow('08-service-linux', 'workflow.yml.txt');
  const solution = workflow('08-service-linux', 'solution.yml.txt');
  const starterRun = starter.jobs.redis.steps[0].run;
  const solutionRun = solution.jobs.redis.steps[0].run;
  assert.match(starterRun, /socket\.create_connection\(\(\"127\.0\.0\.1\",6380\),2\)/);
  assert.match(solutionRun, /socket\.create_connection\(\(\"127\.0\.0\.1\",6379\),2\)/);
  assert.deepEqual(starter.jobs.redis.services.redis.ports, ['6379:6379']);
  assert.deepEqual(solution.jobs.redis.services.redis.ports, ['6379:6379']);
  assert.match(solution.jobs.redis.services.redis.options, /--health-cmd "redis-cli ping"/);
  for (const runText of [starterRun, solutionRun]) {
    const literal = runText.match(/s\.sendall\((b"[^"]+")\)/)?.[1];
    assert.ok(literal, 'Redis probe has a bytes payload');
    assert.equal(Buffer.from(JSON.parse(literal.slice(1)), 'ascii').toString('hex'), '50494e470d0a', 'Redis probe sends PING followed by CRLF bytes');
  }
});

test('04, 05, 06, 07, 11, 14, 16, and 17 retain concrete local evidence models', () => {
  const four = workflow('04-context-as-data', 'workflow.yml.txt');
  const fourFixed = workflow('04-context-as-data', 'solution.yml.txt');
  assert.match(four.jobs.lab.steps[0].run, /actual="\$\{\{ inputs\.message \}\}"/);
  assert.equal(fourFixed.jobs.lab.steps[0].env.EVENT_TEXT, '${{ inputs.message }}');
  const unsafe = run('bash', ['-c', "actual=\"$(printf changed)\"; test \"$actual\" = '$(printf changed)'"]);
  const safe = run('bash', ['-c', "EVENT_TEXT='$(printf changed)'; test \"$EVENT_TEXT\" = '$(printf changed)'"]);
  assert.notEqual(unsafe.status, 0);
  assert.equal(safe.status, 0);

  const five = workflow('05-job-output', 'solution.yml.txt');
  const six = workflow('06-needs-output', 'solution.yml.txt');
  assert.equal(five.jobs.prepare.outputs.version, '${{ steps.version.outputs.version }}');
  assert.equal(six.jobs.report.needs, 'prepare');
  const outputHarness = run('bash', ['-c', 'value=1; test "$value" = 1']);
  assert.equal(outputHarness.status, 0);

  const seven = workflow('07-matrix', 'workflow.yml.txt');
  assert.equal(seven.jobs.node.steps[0].with['node-version'], 20);
  assert.match(seven.jobs.node.steps[1].run, /process\.versions\.node\.split/);
  const major = process.versions.node.split('.')[0];
  assert.notEqual(run('bash', ['-c', 'test "$ACTUAL" = "$REQUESTED"'], { env: { ...process.env, ACTUAL: major, REQUESTED: major === '20' ? '22' : '20' } }).status, 0);
  assert.equal(run('bash', ['-c', 'test "$ACTUAL" = "$REQUESTED"'], { env: { ...process.env, ACTUAL: major, REQUESTED: major } }).status, 0);

  const eleven = workflow('11-failure-evidence', 'solution.yml.txt');
  assert.equal(eleven.jobs.lab.steps[1].if, '${{ always() }}');
  assert.match(eleven.jobs.lab.steps[1].run, /GITHUB_STEP_SUMMARY/);
  const fourteen = workflow('14-oidc-job', 'solution.yml.txt');
  assert.equal(fourteen.jobs.deploy.permissions['id-token'], 'write');
  assert.notEqual(run('bash', ['-c', 'test -n "$ACTIONS_ID_TOKEN_REQUEST_URL"'], { env: { ...process.env, ACTIONS_ID_TOKEN_REQUEST_URL: '' } }).status, 0);
  assert.equal(run('bash', ['-c', 'test -n "$ACTIONS_ID_TOKEN_REQUEST_URL"'], { env: { ...process.env, ACTIONS_ID_TOKEN_REQUEST_URL: 'https://example.invalid' } }).status, 0);
  for (const file of ['workflow.yml.txt', 'solution.yml.txt']) assert.equal(workflow('16-upload-artifact', file).jobs.artifact.steps.find((step) => step.uses?.startsWith('actions/upload-artifact')).with['if-no-files-found'], 'error');
  assert.equal(workflow('17-capstone-gate', 'solution.yml.txt').jobs.deploy.needs, 'build');
  assert.match(workflow('17-capstone-gate', 'solution.yml.txt').jobs.deploy.steps[0].run, /needs\.build\.outputs\.result/);
});

test('12, 13, and 15 policy scripts reject bad candidates and accept exact repairs', () => {
  const temp = mkdtempSync(join(tmpdir(), 'gh200-policy-'));
  try {
    assert.notEqual(run(process.execPath, ['hands-on/12-runner-policy/check-policy.js', 'hands-on/12-runner-policy/candidate.json']).status, 0);
    assert.equal(run(process.execPath, ['hands-on/12-runner-policy/check-policy.js', 'hands-on/12-runner-policy/candidate.solution.json']).status, 0);
    assert.notEqual(run(process.execPath, ['hands-on/15-sha-pin/check-pin.js', 'hands-on/15-sha-pin/action-candidate.json']).status, 0);
    assert.equal(run(process.execPath, ['hands-on/15-sha-pin/check-pin.js', 'hands-on/15-sha-pin/action-candidate.solution.json']).status, 0);
    const candidate = join(temp, 'candidate.yml');
    writeFileSync(candidate, 'permissions:\n  contents: write\n');
    assert.notEqual(run(process.execPath, ['hands-on/13-least-privilege/check-policy.mjs', candidate]).status, 0);
    writeFileSync(candidate, 'permissions:\n  contents: read\n');
    assert.equal(run(process.execPath, ['hands-on/13-least-privilege/check-policy.mjs', candidate]).status, 0);
    writeFileSync(candidate, 'permissions:\n  contents: read\n  actions: read\n');
    assert.notEqual(run(process.execPath, ['hands-on/13-least-privilege/check-policy.mjs', candidate]).status, 0);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test('verifier rejects helper, action, trigger, and job-shape regressions in isolated mirrors', () => {
  const mutate = (relativePath, transform) => {
    const mirror = mkdtempSync(join(tmpdir(), 'gh200-verifier-'));
    try {
      cpSync('hands-on', join(mirror, 'hands-on'), { recursive: true });
      const target = join(mirror, relativePath);
      writeFileSync(target, transform(readFileSync(target, 'utf8')));
      const checked = run(process.execPath, ['_internal/scripts/verify-hands-on.mjs'], { env: { ...process.env, GH200_ROOT: mirror } });
      assert.notEqual(checked.status, 0, relativePath);
    } finally {
      rmSync(mirror, { recursive: true, force: true });
    }
  };
  mutate('hands-on/09-reusable-call/gh200-called.yml.txt', (text) => text.replace('contents: read', 'contents: write'));
  mutate('hands-on/09-reusable-call/gh200-called.yml.txt', (text) => text.replace('workflow_call: {}', 'workflow_dispatch: {}'));
  mutate('hands-on/09-reusable-call/gh200-called.yml.txt', () => 'name: bad\non:\n  workflow_call: {}\npermissions:\n  contents: read\njobs: []\n');
  mutate('hands-on/09-reusable-call/gh200-called.yml.txt', (text) => text.replace('      - shell: bash', '      - uses: actions/checkout@v4'));
  for (const file of ['hands-on/10-composite-action/action.starter.yml.txt', 'hands-on/10-composite-action/action.yml.txt']) mutate(file, (text) => text.replace('    - id: greeting', '    - uses: actions/checkout@v4'));
  mutate('hands-on/04-context-as-data/workflow.yml.txt', (text) => text.replace('  workflow_dispatch:', '  workflow_dispatch:\n  push:'));
  mutate('hands-on/04-context-as-data/workflow.yml.txt', (text) => text.replace('jobs:\n  lab:', 'jobs: {}\n#  lab:'));
});
