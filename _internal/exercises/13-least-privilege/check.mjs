import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateExercise } from '../../scripts/learn-lib.mjs';

try {
  const errors = validateExercise('13-least-privilege', path.dirname(fileURLToPath(import.meta.url)));
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Passed: the workflow token is read-only.');
} catch (error) {
  console.error(`Not yet. ${error.message}\nRead README.md and edit workflow.yml.`);
  process.exitCode = 1;
}
