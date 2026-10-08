import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.env.GH200_ACTION_WORKSPACE
  ? path.resolve(process.env.GH200_ACTION_WORKSPACE)
  : fileURLToPath(new URL('./workspace/', import.meta.url));
const files = {
  composite: fs.readFileSync(path.join(root, 'composite/action.yml'), 'utf8'),
  javascript: fs.readFileSync(path.join(root, 'javascript/action.yml'), 'utf8'),
  docker: fs.readFileSync(path.join(root, 'docker/action.yml.txt'), 'utf8'),
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
