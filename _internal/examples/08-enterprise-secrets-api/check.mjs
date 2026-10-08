import fs from 'node:fs';

const plan = JSON.parse(fs.readFileSync(new URL('./scope-plan.json', import.meta.url)));
const serialized = JSON.stringify(plan);
const api = fs.readFileSync(new URL('./api-plan.sh.txt', import.meta.url), 'utf8');
const problems = [];
if (serialized.includes('TODO')) problems.push('scope-plan.json still has TODOs');
if (api.includes('TODO')) problems.push('api-plan.sh.txt still has TODOs');
if (/ghp_|github_pat_|BEGIN [A-Z ]*PRIVATE KEY/.test(serialized + api)) problems.push('possible literal credential detected');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Enterprise scope/API plan is complete and contains no obvious literal credential.');
}

