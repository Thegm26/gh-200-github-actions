import assert from 'node:assert/strict';
import test from 'node:test';
import { loadQuestions, parseArgs, selectQuestions, validateQuestions } from '../../scripts/quiz.mjs';
import { isIllustrativeTemplateUrl } from '../../scripts/link-policy.mjs';

test('link validation excludes only illustrative GitHub owner/repository placeholders', () => {
  assert.equal(isIllustrativeTemplateUrl('https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg?branch=main'), true);
  assert.equal(isIllustrativeTemplateUrl('https://github.com/actions/checkout'), false);
  assert.equal(isIllustrativeTemplateUrl('https://docs.github.com/actions'), false);
});

test('question bank validates and covers all domains', () => {
  const questions = loadQuestions();
  assert.equal(validateQuestions(questions).length, 0);
  assert.ok(questions.length >= 60);
});

test('correct choices are balanced and every question has distinct options', () => {
  const questions = loadQuestions();
  const positions = [0, 1, 2, 3].map((position) => questions.filter((question) => question.correct === position).length);
  assert.ok(positions.every((count) => count > 0));
  assert.ok(positions.every((count) => count / questions.length <= 0.4));
  for (const question of questions) {
    assert.equal(new Set(question.options.map((option) => option.toLowerCase())).size, 4);
    assert.ok(question.question.length >= 45);
    assert.match(question.question, /\?$/);
  }
});

test('filtering selects only the requested domain', () => {
  const result = selectQuestions(loadQuestions(), { domain: 'enterprise', count: 4, seed: 'filter' });
  assert.equal(result.length, 4);
  assert.ok(result.every((question) => question.domain === 'enterprise'));
});

test('a seed produces deterministic question order', () => {
  const questions = loadQuestions();
  const first = selectQuestions(questions, { count: 8, seed: 'same' }).map((question) => question.id);
  const second = selectQuestions(questions, { count: 8, seed: 'same' }).map((question) => question.id);
  assert.deepEqual(first, second);
});

test('argument parsing accepts quiz controls', () => {
  assert.deepEqual(parseArgs(['--count', '3', '--domain', 'enterprise', '--seed', 'x', '--review-wrong']), { seed: 'x', count: 3, domain: 'enterprise', reviewWrong: true, listDomains: false, validate: false });
});
