import { parseDocument } from 'yaml';
import { lessons } from '../learning/course-data.mjs';
import { cheatSheet, coverage, questions, references } from './course-resources.mjs';
import { MAX_YAML_BYTES, validateLearningSource } from '../scripts/learning-checks.mjs';

function parseYaml(source) {
  const document = parseDocument(source, { merge: true });
  if (document.errors.length) throw new Error(document.errors[0].message);
  return document.toJS({ merge: true });
}
function check(id, source) {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) return { passed: false, errors: [`Unknown exercise: ${id}`] };
  let errors = validateLearningSource(lesson, source, parseYaml);
  if (errors.some((error) => error.startsWith('Workflow baseline needs'))) errors = [`Not yet: ${lesson.task} Hint: ${lesson.hint}`];
  return { passed: errors.length === 0, errors };
}

globalThis.GH200Course = Object.freeze({ lessons: Object.freeze(lessons.map(({ rules, ...lesson }) => Object.freeze(lesson))), check, questions: Object.freeze(questions), references: Object.freeze(references), cheatSheet: Object.freeze(cheatSheet), coverage: Object.freeze(coverage), maxYamlBytes: MAX_YAML_BYTES });
