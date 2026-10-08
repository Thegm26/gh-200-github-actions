import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateExercise } from '../../scripts/learn-lib.mjs';

try {
  const errors = validateExercise('10-composite-action', path.dirname(fileURLToPath(import.meta.url)));
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Passed: the composite action has an explicit Bash step.');
} catch (error) {
  console.error(`Not yet. ${error.message}\nRead README.md and edit action.yml.`);
  process.exitCode = 1;
}
