import fs from 'node:fs';

const evidence = JSON.parse(fs.readFileSync(new URL('./run-evidence.json', import.meta.url)));
const failed = evidence.jobs.filter((job) => job.conclusion === 'failure');
console.log(`run=${evidence.runId} failed=${failed.map((job) => job.name).join(', ')}`);
console.log(`artifact=${evidence.artifacts[0].name} retention=${evidence.artifacts[0].retentionDays}d`);
if (failed.length !== 1 || !failed[0].name.includes('ubuntu-latest, 22')) {
  throw new Error('unexpected simulated evidence');
}

