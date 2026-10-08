import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateExercise } from '../../scripts/learn-lib.mjs';

try {
  const errors = validateExercise('06-needs-output', path.dirname(fileURLToPath(import.meta.url)));
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Passed: report depends on prepare and reads its output.');
} catch (error) {
  console.error(`Not yet. ${error.message}\nRead README.md and edit workflow.yml.`);
  process.exitCode = 1;
}
