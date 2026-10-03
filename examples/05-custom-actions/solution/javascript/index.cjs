const fs = require('node:fs');
const sampleSize = Number(process.env.INPUT_SAMPLE_SIZE);
if (!Number.isSafeInteger(sampleSize) || sampleSize < 0 || sampleSize > 20) throw new Error('sample_size must be 0..20');
const score = sampleSize * 5;
const level = score >= 70 ? 'high' : score >= 35 ? 'medium' : 'low';
fs.appendFileSync(process.env.GITHUB_OUTPUT, `score=${score}\nlevel=${level}\n`);

