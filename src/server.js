import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MAX_BODY_BYTES = 16 * 1024;
const ALLOWED_FIELDS = new Set([
  'failedJobs',
  'totalJobs',
  'openIncidents',
  'changeFailureRate'
]);

function json(response, statusCode, body) {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function requestId() {
  return randomUUID();
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = '';

    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body exceeds 16 KiB.'), { statusCode: 413 }));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on('end', () => {
      if (!body) {
        reject(Object.assign(new Error('Request body must contain JSON.'), { statusCode: 400 }));
        return;
      }
      try {
        const parsed = JSON.parse(body);
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          throw new Error('Request body must be a JSON object.');
        }
        resolve(parsed);
      } catch (error) {
        reject(Object.assign(new Error(error.message === 'Request body must be a JSON object.' ? error.message : 'Request body must be valid JSON.'), { statusCode: 400 }));
      }
    });
    request.on('error', reject);
  });
}

function validateMetrics(metrics) {
  const unknown = Object.keys(metrics).filter((key) => !ALLOWED_FIELDS.has(key));
  if (unknown.length) return `Unknown field: ${unknown[0]}.`;

  for (const field of ['failedJobs', 'totalJobs', 'openIncidents']) {
    if (!Number.isSafeInteger(metrics[field]) || metrics[field] < 0) {
      return `${field} must be a non-negative safe integer.`;
    }
  }
  if (metrics.totalJobs === 0) return 'totalJobs must be greater than zero.';
  if (metrics.failedJobs > metrics.totalJobs) return 'failedJobs cannot exceed totalJobs.';
  if (typeof metrics.changeFailureRate !== 'number' || !Number.isFinite(metrics.changeFailureRate) || metrics.changeFailureRate < 0 || metrics.changeFailureRate > 1) {
    return 'changeFailureRate must be a finite number from 0 through 1.';
  }
  return null;
}

/**
 * Calculate a deterministic 0–100 build risk score from recent delivery metrics.
 */
export function scoreBuildRisk(metrics) {
  const validationError = validateMetrics(metrics);
  if (validationError) throw new TypeError(validationError);

  const failedJobRate = metrics.failedJobs / metrics.totalJobs;
  const score = Math.min(100, Math.round(
    (failedJobRate * 45) +
    (metrics.changeFailureRate * 35) +
    (Math.min(metrics.openIncidents, 5) * 4)
  ));
  const level = score >= 70 ? 'high' : score >= 35 ? 'medium' : 'low';

  return {
    score,
    level,
    factors: {
      failedJobRate: Number(failedJobRate.toFixed(4)),
      openIncidents: metrics.openIncidents,
      changeFailureRate: metrics.changeFailureRate
    }
  };
}

export function createServer() {
  return http.createServer(async (request, response) => {
    const id = requestId();
    const path = new URL(request.url, 'http://localhost').pathname;

    if (path === '/health') {
      if (request.method !== 'GET') {
        json(response, 405, { error: 'method_not_allowed', message: 'Use GET for /health.', requestId: id });
        return;
      }
      json(response, 200, { status: 'ok', service: 'gh-200-build-risk', requestId: id });
      return;
    }

    if (path === '/v1/build-risk') {
      if (request.method !== 'POST') {
        json(response, 405, { error: 'method_not_allowed', message: 'Use POST for /v1/build-risk.', requestId: id });
        return;
      }
      try {
        const metrics = await readJson(request);
        const result = scoreBuildRisk(metrics);
        json(response, 200, { ...result, requestId: id });
      } catch (error) {
        json(response, error.statusCode || 400, { error: 'invalid_request', message: error.message, requestId: id });
      }
      return;
    }

    json(response, 404, { error: 'not_found', message: 'Route not found.', requestId: id });
  });
}

export function startServer(port = Number(process.env.PORT || 3000)) {
  const server = createServer();
  server.listen(port, () => console.log(`gh-200-build-risk listening on ${port}`));
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer();
}
