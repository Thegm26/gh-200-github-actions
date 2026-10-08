import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));

test('workflow safety and coverage validator passes', async () => {
  const result = await new Promise((resolve, reject) => {
    execFile(process.execPath, ['scripts/verify-workflows.mjs'], { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) reject(Object.assign(error, { stdout, stderr }));
      else resolve({ stdout, stderr });
    });
  });
  assert.match(result.stdout, /Workflow validation passed/);
  assert.equal(result.stderr, '');
});

test('workflow validator accepts CRLF workflow files without weakening permission checks', async () => {
  const mirror = await mkdtemp(join(tmpdir(), 'gh200-workflow-crlf-'));
  try {
    await cp(join(projectRoot, 'scripts'), join(mirror, 'scripts'), { recursive: true });
    await cp(join(projectRoot, '.github'), join(mirror, '.github'), { recursive: true });
    const workflowsDirectory = join(mirror, '.github', 'workflows');
    for (const name of await readdir(workflowsDirectory)) {
      const workflow = join(workflowsDirectory, name);
      await writeFile(workflow, (await readFile(workflow, 'utf8')).replace(/\r?\n/g, '\r\n'));
    }
    const result = await new Promise((resolve, reject) => {
      execFile(process.execPath, ['scripts/verify-workflows.mjs'], { cwd: mirror }, (error, stdout, stderr) => {
        if (error) reject(Object.assign(error, { stdout, stderr }));
        else resolve({ stdout, stderr });
      });
    });
    assert.match(result.stdout, /Workflow validation passed/);
    assert.equal(result.stderr, '');
    const learningWorkflow = join(workflowsDirectory, 'package-learning.yml');
    const unsafePermissions = (await readFile(learningWorkflow, 'utf8')).replace(
      'permissions:\r\n  contents: read',
      'permissions:\r\n  contents: read\r\n  id-token: write',
    );
    await writeFile(learningWorkflow, unsafePermissions);
    const failure = await new Promise((resolve) => {
      execFile(process.execPath, ['scripts/verify-workflows.mjs'], { cwd: mirror }, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr });
      });
    });
    assert.notEqual(failure.error, null);
    assert.match(failure.stderr, /must not grant unused OIDC/);
  } finally {
    await rm(mirror, { recursive: true, force: true });
  }
});

test('workflow validator enforces every CI job fork guard', async () => {
  const mirror = await mkdtemp(join(tmpdir(), 'gh200-workflow-fork-guard-'));
  try {
    await cp(join(projectRoot, 'scripts'), join(mirror, 'scripts'), { recursive: true });
    await cp(join(projectRoot, '.github'), join(mirror, '.github'), { recursive: true });
    const ciPath = join(mirror, '.github', 'workflows', 'ci.yml');
    const original = await readFile(ciPath, 'utf8');
    const guard = "    if: ${{ github.repository == 'Thegm26/gh-200-github-actions' || github.event_name == 'workflow_dispatch' }}\n";
    const run = async () => new Promise((resolve) => execFile(process.execPath, ['scripts/verify-workflows.mjs'], { cwd: mirror }, (error, stdout, stderr) => resolve({ error, stdout, stderr })));
    for (const name of ['test', 'risk', 'integration']) {
      await writeFile(ciPath, original.replace(`  ${name}:\n${guard}`, `  ${name}:\n`));
      const result = await run();
      assert.notEqual(result.error, null, `${name} missing guard fails`);
      assert.match(result.stderr, new RegExp(`CI job ${name} must be upstream-only`));
    }
    await writeFile(ciPath, original.replace("github.event_name == 'workflow_dispatch'", "github.event_name == 'push'"));
    let result = await run();
    assert.notEqual(result.error, null, 'weakened guard fails');
    await writeFile(ciPath, `${original}\n  extra:\n    runs-on: ubuntu-latest\n    steps:\n      - run: true\n`);
    result = await run();
    assert.notEqual(result.error, null, 'unguarded injected job fails');
    assert.match(result.stderr, /CI job extra must be upstream-only/);
    await writeFile(ciPath, `${original}\n  extra:\n${guard}    runs-on: ubuntu-latest\n    steps:\n      - run: true\n`);
    result = await run();
    assert.equal(result.error, null, 'guarded injected job remains valid');
  } finally {
    await rm(mirror, { recursive: true, force: true });
  }
});

test('lab-summary bridges its untrusted title through a quoted environment variable', async () => {
  const action = await readFile(join(projectRoot, '.github/actions/lab-summary/action.yml'), 'utf8');
  const runScript = action.slice(action.indexOf('      run: |'));

  assert.match(action, /LAB_SUMMARY_TITLE: \$\{\{ inputs\.title \}\}/);
  assert.match(runScript, /"\$LAB_SUMMARY_TITLE"/);
  assert.doesNotMatch(runScript, /\$\{\{\s*inputs\.title\s*\}\}/);
});

test('risk-summary action reads its declared input and writes GitHub output files', async () => {
  const tempDirectory = await mkdtemp(join(tmpdir(), 'gh200-risk-action-'));
  const outputPath = join(tempDirectory, 'output');
  const summaryPath = join(tempDirectory, 'summary');

  try {
    await new Promise((resolve, reject) => {
      execFile(
        process.execPath,
        ['.github/actions/risk-summary/index.cjs'],
        {
          cwd: projectRoot,
          env: {
            ...process.env,
            INPUT_SAMPLE_SIZE: '3',
            GITHUB_OUTPUT: outputPath,
            GITHUB_STEP_SUMMARY: summaryPath,
          },
        },
        (error) => (error ? reject(error) : resolve()),
      );
    });

    assert.equal(await readFile(outputPath, 'utf8'), 'score=15\nlevel=low\n');
    assert.match(await readFile(summaryPath, 'utf8'), /Score: \*\*15\*\*/);
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
});
