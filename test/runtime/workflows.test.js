import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
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
