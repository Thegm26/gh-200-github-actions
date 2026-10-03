import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('usage: node check.mjs <capstone.workflow.yml.txt>');
const text = fs.readFileSync(file, 'utf8');
const required = [
  ['typed dispatch', /workflow_dispatch:[\s\S]*type:\s*boolean/],
  ['filters', /branches:[\s\S]*paths:/],
  ['step output', /GITHUB_OUTPUT/],
  ['job output', /outputs:[\s\S]*steps\.meta\.outputs/],
  ['needs output', /needs\.prepare\.outputs/],
  ['matrix completion', /fail-fast:\s*false/],
  ['parallel cap', /max-parallel:/],
  ['artifact', /upload-artifact@[0-9a-f]{40}/],
  ['minimum permissions', /permissions:[\s\S]*contents:\s*read/],
  ['safe env bridge', /PR_TITLE:[\s\S]*github\.event/],
  ['environment', /environment:\s*production/],
  ['OIDC permission', /id-token:\s*write/],
];
const problems = required.filter(([, pattern]) => !pattern.test(text)).map(([label]) => `missing ${label}`);
if (/write-all|uses:\s*[^\s]+@(main|v\d+)\b|run:[^\n]*github\.event|actions\/cache[^\n]*[\s\S]{0,120}path:\s*report/.test(text)) {
  problems.push('an insecure or incorrect starter pattern remains');
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Capstone structural checks pass. Explain every choice aloud.');
}

