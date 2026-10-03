const sampleSize = Number(process.env.INPUT_SAMPLE_SIZE);

if (!Number.isSafeInteger(sampleSize) || sampleSize < 0 || sampleSize > 20) {
  throw new Error('sample_size must be an integer from 0 through 20.');
}

const score = Math.min(100, sampleSize * 5);
const level = score >= 70 ? 'high' : score >= 35 ? 'medium' : 'low';

require('node:fs').appendFileSync(process.env.GITHUB_OUTPUT, `score=${score}\nlevel=${level}\n`);
require('node:fs').appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Reusable workflow risk\n\n- Score: **${score}**\n- Level: **${level}**\n`);
