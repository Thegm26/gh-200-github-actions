import assert from 'node:assert/strict';
import test from 'node:test';
import { loadQuestions, parseArgs, selectQuestions, validateQuestions } from '../../scripts/quiz.mjs';

test('question bank validates and covers all domains', () => {
  const questions = loadQuestions();
  assert.equal(validateQuestions(questions).length, 0);
  assert.ok(questions.length >= 60);
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
