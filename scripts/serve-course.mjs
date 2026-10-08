import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
const allowed = new Set(['index.html', 'web/app.js', 'web/styles.css', 'web/course-runtime.js', 'web/ui-state.js', 'docs/START_HERE.md']);
const port = Number(process.env.PORT || 4173);
http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method || '')) { response.writeHead(405, { allow: 'GET, HEAD' }); response.end(); return; }
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  let relative;
  try { relative = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, ''); } catch { response.writeHead(400); response.end('Bad request'); return; }
  if (!allowed.has(relative)) { response.writeHead(404); response.end('Not found'); return; }
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) { response.writeHead(404); response.end('Course files are not built yet.'); return; }
  response.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  if (request.method === 'HEAD') { response.end(); return; }
  fs.createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`GH-200 course: http://127.0.0.1:${port}`));
