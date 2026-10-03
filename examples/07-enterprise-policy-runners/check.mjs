import fs from 'node:fs';

const decision = JSON.parse(fs.readFileSync(new URL('./decision.json', import.meta.url)));
const todo = Object.entries(decision).filter(([, value]) => value === 'TODO').map(([key]) => key);
if (todo.length) {
  console.error(`Complete decision fields: ${todo.join(', ')}`);
  process.exitCode = 1;
} else if (decision.contractorProductionAccess !== 'denied') {
  throw new Error('contractor production access must be denied');
} else {
  console.log('Enterprise runner decision is complete. Compare reasoning, not wording, with solution.');
}

