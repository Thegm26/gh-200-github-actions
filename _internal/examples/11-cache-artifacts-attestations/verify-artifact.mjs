import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const directory = path.join(os.tmpdir(), 'gh200-attestation-simulation');
const bytes = fs.readFileSync(path.join(directory, 'training-artifact.txt'));
const statement = JSON.parse(fs.readFileSync(path.join(directory, 'training-artifact.sha256.json')));
assert.equal(statement.issuer, 'local-study-simulation');
const actual = crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(actual, statement.sha256, 'artifact digest mismatch');
console.log(`verified sha256=${actual}`);
console.log('This local digest statement is not a GitHub artifact attestation.');
