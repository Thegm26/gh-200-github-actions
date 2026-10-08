import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('usage: node check.mjs <workflow.yml.txt>');
const text = fs.readFileSync(file, 'utf8');
const required = [
  ['typed Boolean', /type:\s*boolean/],
  ['choice input', /type:\s*choice/],
  ['branch filter', /branches:/],
  ['path filter', /paths:/],
  ['expression', /\$\{\{/],
  ['anchor', /&[\w-]+/],
  ['alias', /\*[\w-]+/],
  ['safe env bridge', /EVENT_TEXT:[\s\S]*github\.event/],
];
const missing = required.filter(([, pattern]) => !pattern.test(text)).map(([label]) => label);
if (missing.length) {
  console.error(`Missing: ${missing.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('Trigger/context exercise structure complete.');
}

