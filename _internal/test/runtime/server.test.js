import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer, scoreBuildRisk } from '../../src/server.js';

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('health endpoint returns service state', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'gh-200-build-risk');
    assert.match(body.requestId, /^[0-9a-f-]{36}$/);
  });
});

test('build-risk endpoint produces deterministic score and factors', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/v1/build-risk`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ failedJobs: 2, totalJobs: 10, openIncidents: 3, changeFailureRate: 0.1 })
    });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual({ score: body.score, level: body.level, factors: body.factors }, {
      score: 25,
      level: 'low',
      factors: { failedJobRate: 0.2, openIncidents: 3, changeFailureRate: 0.1 }
    });
  });
});

test('build-risk rejects invalid metrics and unexpected routes', async () => {
  await withServer(async (baseUrl) => {
    const invalid = await fetch(`${baseUrl}/v1/build-risk`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ failedJobs: 3, totalJobs: 2, openIncidents: 0, changeFailureRate: 0 })
    });
    assert.equal(invalid.status, 400);
    assert.match((await invalid.json()).message, /cannot exceed/);

    const missing = await fetch(`${baseUrl}/missing`);
    assert.equal(missing.status, 404);
  });
});

test('build-risk returns a JSON 413 response for bodies larger than 16 KiB', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/v1/build-risk`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ padding: 'x'.repeat((16 * 1024) + 1) })
    });

    assert.equal(response.status, 413);
    assert.match(response.headers.get('content-type'), /^application\/json/);
    const body = await response.json();
    assert.equal(body.error, 'invalid_request');
    assert.equal(body.message, 'Request body exceeds 16 KiB.');
    assert.match(body.requestId, /^[0-9a-f-]{36}$/);
  });
});

test('scoreBuildRisk validates direct callers', () => {
  assert.throws(() => scoreBuildRisk({ failedJobs: 0, totalJobs: 0, openIncidents: 0, changeFailureRate: 0 }), /greater than zero/);
});
