import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { lessons } from '../../learning/course-data.mjs';
import { courseCopy, courseInstructions, courseOutcomes, courseTasks } from '../../learning/course-copy.mjs';
import { cheatSheet, coverage, questions, references } from '../../visual-source/course-resources.mjs';
import { MAX_YAML_BYTES } from '../../scripts/learning-checks.mjs';

test('course data has all ordered lessons, readable YAML, and Node parity', () => {
  assert.equal(lessons.length, 17);
  assert.equal(Object.keys(courseCopy).length, 17);
  assert.equal(Object.keys(courseInstructions).length, 17);
  assert.equal(Object.keys(courseOutcomes).length, 17);
  assert.equal(Object.keys(courseTasks).length, 17);
  const manifest = JSON.parse(fs.readFileSync('_internal/learning/manifest.json', 'utf8'));
  assert.deepEqual(lessons.map((lesson) => lesson.stage), [...Array(4).fill('Foundations'), ...Array(4).fill('Connect jobs'), ...Array(3).fill('Reuse and debug'), ...Array(6).fill('Secure delivery')]);
  for (const lesson of lessons) {
    assert.equal(lesson.index, Number(lesson.id.slice(0, 2)));
    assert.ok(lesson.explanation.length >= 2 && lesson.task && lesson.source.url.startsWith('https://'));
    assert.deepEqual(Object.keys(courseTasks[lesson.id]).sort(), ['example', 'goal', 'keep', 'location']);
    assert.equal(lesson.task, courseTasks[lesson.id].goal);
    assert.equal(lesson.editLocation, courseTasks[lesson.id].location);
    assert.equal(lesson.keep, courseTasks[lesson.id].keep);
    assert.equal(lesson.editExample, courseTasks[lesson.id].example || '');
    assert.ok(lesson.instructions.length >= 2 && lesson.instructions.length <= 4 && lesson.instructions.every((step) => typeof step === 'string' && step.length > 10));
    assert.ok(typeof lesson.doneWhen === 'string' && lesson.doneWhen.length > 10);
    const legacy = manifest.labs.find((lab) => lab.id === lesson.id);
    assert.notEqual(lesson.title, legacy.title, `${lesson.id} must not surface terse manifest title`);
    assert.notEqual(lesson.summary, legacy.goal, `${lesson.id} must not surface terse manifest goal`);
    assert.match(lesson.starter, /\n/);
  }
  assert.match(lessons.find((lesson) => lesson.id === '15-sha-pin').starter, /Verified checkout release commit/);
  assert.match(lessons.find((lesson) => lesson.id === '03-push-filter').task, /src\//);
  assert.match(lessons.find((lesson) => lesson.id === '01-first-workflow').instructions.join(' '), /on: false/);
});

test('offline resource payload preserves quiz, catalog metadata, and local reading text', () => {
  const catalog = JSON.parse(fs.readFileSync('_internal/references/catalog.json', 'utf8'));
  const sourceQuestions = JSON.parse(fs.readFileSync('_internal/quiz/questions.json', 'utf8'));
  assert.deepEqual(questions, sourceQuestions);
  assert.equal(references.length, catalog.length);
  for (const reference of references) {
    assert.match(reference.url, /^https:\/\//);
    assert.ok(['primary', 'secondary'].includes(reference.kind));
    assert.equal(typeof reference.content, 'string');
    assert.equal(typeof reference.sourceVersion, 'string');
    if (reference.localPath) assert.ok(reference.content.length, `${reference.id} local reference text`);
  }
  assert.ok(references.some((reference) => reference.category === 'exam-practice' && reference.access));
  assert.match(cheatSheet.content, /GitHub Actions/i);
  assert.match(coverage.content, /GH-200/i);
});

test('offline browser bundle exposes check parity for every fixture and rejects bad YAML safely', () => {
  const context = vm.createContext({ console });
  vm.runInContext(fs.readFileSync('visual/web/course-runtime.js', 'utf8'), context, { filename: 'course-runtime.js' });
  const course = context.GH200Course;
  assert.equal(course.lessons.length, 17);
  assert.equal(course.questions.length, questions.length);
  assert.equal(course.references.length, references.length);
  assert.equal(course.cheatSheet.content, cheatSheet.content);
  assert.equal(course.coverage.content, coverage.content);
  for (const lesson of course.lessons) {
    assert.equal(course.check(lesson.id, lesson.starter).passed, false, `${lesson.id} starter`);
    assert.equal(course.check(lesson.id, lesson.solution).passed, true, `${lesson.id} solution`);
    assert.equal(course.check(lesson.id, `${lesson.solution}\nmalformed: [`).passed, false, `${lesson.id} mutation`);
    assert.deepEqual(course.check(lesson.id, lesson.solution.replace(/\n/g, '\r\n')).passed, true, `${lesson.id} CRLF`);
  }
  for (const source of ['[unterminated', 'plain scalar', 'jobs:\n  build:\n    steps: [null]', 'x'.repeat(MAX_YAML_BYTES + 1)]) {
    const result = course.check('01-first-workflow', source);
    assert.equal(result.passed, false);
    assert.ok(result.errors.length);
  }
  for (const [id, source] of [['10-composite-action', 'runs:\n  using: composite\n  steps: [null]\n'], ['03-push-filter', 'on:\n  push:\n    branches: {}\n    paths: {}\njobs: {}\n']]) {
    const result = course.check(id, source);
    assert.equal(result.passed, false);
    assert.ok(result.errors.length);
  }
  assert.deepEqual(course.check('not-a-lesson', 'name: nope').passed, false);
});

test('course verification accepts CRLF generated files in an isolated mirror', () => {
  const mirror = fs.mkdtempSync(path.join(os.tmpdir(), 'gh200-course-crlf-'));
  try {
    fs.cpSync('_internal', path.join(mirror, '_internal'), { recursive: true });
    fs.cpSync('visual', path.join(mirror, 'visual'), { recursive: true });
    fs.symlinkSync(path.resolve('node_modules'), path.join(mirror, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
    for (const file of ['_internal/learning/course-data.mjs', '_internal/visual-source/course-resources.mjs', 'visual/web/course-runtime.js']) {
      const target = path.join(mirror, file);
      fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'));
    }
    for (const reference of JSON.parse(fs.readFileSync(path.join(mirror, '_internal/references/catalog.json'), 'utf8'))) {
      if (!reference.localPath) continue;
      const target = path.join(mirror, reference.localPath);
      fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'));
    }
    const result = spawnSync(process.execPath, ['_internal/scripts/verify-course.mjs'], { cwd: mirror, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  } finally { fs.rmSync(mirror, { recursive: true, force: true }); }
});
