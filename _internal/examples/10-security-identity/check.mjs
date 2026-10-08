import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('usage: node check.mjs <workflow.yml.txt>');
const text = fs.readFileSync(file, 'utf8');
const problems = [];
if (/write-all/.test(text)) problems.push('write-all remains');
if (/uses:\s*[^\s]+@(main|master|v\d+)\b/.test(text)) problems.push('mutable action ref remains');
if (/run:[^\n]*github\.event/.test(text)) problems.push('untrusted context is directly interpolated into run');
if (/CLOUD_SECRET|client-secret/.test(text)) problems.push('long-lived cloud-secret pattern remains');
if (!/permissions:/.test(text)) problems.push('no explicit permissions');
if (!/environment:\s*production/.test(text)) problems.push('no production environment gate');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Security exercise passes the local structural checks.');
}

