import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const directory = path.join(os.tmpdir(), 'gh200-attestation-simulation');
fs.mkdirSync(directory, { recursive: true });
const artifact = path.join(directory, 'training-artifact.txt');
const statement = path.join(directory, 'training-artifact.sha256.json');
const bytes = Buffer.from('GH-200 deterministic training artifact\n');
fs.writeFileSync(artifact, bytes);
const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
fs.writeFileSync(statement, `${JSON.stringify({ artifact: 'training-artifact.txt', sha256, issuer: 'local-study-simulation' }, null, 2)}\n`);
console.log(`created sha256=${sha256}`);
console.log(`workspace=${directory}`);
