import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
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
