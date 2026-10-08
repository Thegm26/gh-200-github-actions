import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'gh200-action-'));
const output = path.join(directory, 'output.txt');
const result = spawnSync(process.execPath, [fileURLToPath(new URL('./index.cjs', import.meta.url))], {
  encoding: 'utf8',
  env: { ...process.env, INPUT_SAMPLE_SIZE: '9', GITHUB_OUTPUT: output },
});
assert.equal(result.status, 0, result.stderr);
assert.equal(fs.readFileSync(output, 'utf8'), 'score=45\nlevel=medium\n');
console.log('JavaScript action harness passed: score=45 level=medium');
