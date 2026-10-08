import fs from 'node:fs';

const axes = {
  os: ['ubuntu-latest', 'windows-latest'],
  node: [20, 22],
};
const excluded = new Set(['windows-latest/22']);
const combinations = axes.os.flatMap((os) => axes.node.map((node) => ({ os, node })))
  .filter(({ os, node }) => !excluded.has(`${os}/${node}`));
combinations.push({ os: 'ubuntu-latest', node: 24, experimental: true });
console.log(JSON.stringify(combinations, null, 2));
if (combinations.length !== 4) throw new Error('expected four combinations');

const solution = fs.readFileSync(new URL('./solution.workflow.yml.txt', import.meta.url), 'utf8');
if (/runs-on:\s*\$\{\{\s*matrix\.os\s*\}\}[\s\S]*?services:/m.test(solution)) {
  throw new Error('service containers cannot share a matrix that includes Windows runners');
}
if (!/test-linux:[\s\S]*?runs-on:\s*ubuntu-latest[\s\S]*?services:/m.test(solution) || !/test-windows:[\s\S]*?runs-on:\s*windows-latest/m.test(solution)) {
  throw new Error('solution must keep the service job on Linux and show a Windows job without services');
}
console.log('Service-container placement is valid: Linux service job plus Windows job without services.');
