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

