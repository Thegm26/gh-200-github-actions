import fs from 'node:fs';

const root = process.env.GH200_ACTION_WORKSPACE
  ? new URL(`${process.env.GH200_ACTION_WORKSPACE.replace(/\/$/, '')}/`, 'file:')
  : new URL('./workspace/', import.meta.url);
const files = {
  composite: fs.readFileSync(new URL('composite/action.yml', root), 'utf8'),
  javascript: fs.readFileSync(new URL('javascript/action.yml', root), 'utf8'),
  docker: fs.readFileSync(new URL('docker/action.yml.txt', root), 'utf8'),
};
for (const [name, text] of Object.entries(files)) {
  for (const key of ['name:', 'description:', 'runs:']) {
    if (!text.includes(key)) throw new Error(`${name} missing ${key}`);
  }
}
let incomplete = false;
if (!files.composite.includes('outputs:')) { console.error('Exercise incomplete: composite output is not mapped yet.'); incomplete = true; }
else console.log('Composite metadata includes an output mapping.');
if (!files.javascript.includes('outputs:')) { console.error('Exercise incomplete: JavaScript outputs are not documented yet.'); incomplete = true; }
else console.log('JavaScript metadata includes output contracts.');
console.log('Docker metadata remains safely inactive (.txt).');
if (incomplete) process.exitCode = 1;
