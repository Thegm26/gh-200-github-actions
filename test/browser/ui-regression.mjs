import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const moduleTarget = process.env.GH200_PLAYWRIGHT_MODULE || 'playwright-core';
const playwright = await import(moduleTarget.startsWith('.') || moduleTarget.startsWith('/') ? pathToFileURL(resolve(moduleTarget)).href : moduleTarget);
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.GH200_BROWSER_EXECUTABLE, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/plain' };
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root)) throw new Error('bad path');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': mime[file.slice(file.lastIndexOf('.'))] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const httpUrl = `http://127.0.0.1:${server.address().port}/`;
const fileUrl = pathToFileURL(resolve(root, 'index.html')).href;

async function freshPage(url, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    const requestUrl = request.url();
    if (!requestUrl.startsWith(url.startsWith('file:') ? 'file:' : `http://127.0.0.1:${server.address().port}`)) external.push(requestUrl);
  });
  await page.goto(url);
  await page.getByRole('heading', { name: 'Your GitHub Actions learning path' }).waitFor();
  return { context, page, errors, external };
}

async function assertNoOverflow(page) {
  const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(widths.document <= widths.viewport, `page horizontally overflows (${widths.document}px > ${widths.viewport}px)`);
}

async function start(page) {
  await page.locator('#path .stage-card').first().click();
  await page.locator('.lesson-bubble').first().click();
  await page.getByRole('button', { name: 'Test this YAML' }).waitFor();
}

try {
  for (const url of [fileUrl, httpUrl]) {
    const test = await freshPage(url, { width: 360, height: 740 });
    assert.equal(await test.page.locator('.stepper').count(), 0, 'numbered phase bar is absent');
    assert.equal(await test.page.locator('#path .stage-card').count(), 4, 'overview contains four topic bubbles');
    assert.equal(await test.page.locator('#path .map-lesson').count(), 0, 'overview does not expose the lesson list');
    await start(test.page);
    await test.page.locator('#yaml-editor').focus();
    await test.page.locator('#yaml-editor').press('End');
    await test.page.locator('#yaml-editor').press(' ');
    await test.page.getByRole('button', { name: 'Test this YAML' }).click();
    assert.equal(await test.page.getByRole('button', { name: 'Mark as done' }).isDisabled(), true, 'starter must not be marked complete');
    await assertNoOverflow(test.page);
    assert.deepEqual(test.errors, [], 'page errors');
    assert.deepEqual(test.external, [], 'no external network requests');
    await test.context.close();
  }

  const stages = await freshPage(httpUrl, { width: 1440, height: 900 });
  const names = await stages.page.evaluate(() => [...new Set(window.GH200Course.lessons.map((lesson) => lesson.stage))]);
  assert.equal(await stages.page.locator('#path .stage-card').count(), 4, 'roadmap contains only topics');
  assert.equal(await stages.page.locator('#progress-count').count(), 0, 'top bar does not duplicate lesson progress');
  for (let i = 0; i < names.length; i += 1) {
    await stages.page.goto(httpUrl);
    await stages.page.locator('#path .stage-card').nth(i).click();
    await stages.page.getByRole('heading', { name: names[i] }).waitFor();
    assert.ok(await stages.page.locator('.lesson-bubble').count() > 0, 'stage exposes its lesson bubbles');
    assert.equal(await stages.page.locator('.bubble-number').count(), 0, 'lesson map has no numbered badges');
    assert.equal(await stages.page.locator('.lesson-bubble').evaluateAll((nodes) => nodes.filter((node) => /^Lesson \d/.test(node.getAttribute('aria-label') || '')).length), 0, 'lesson map aria labels have no numeric lesson prefixes');
    assert.equal(await stages.page.locator('.lesson-flow').evaluate((node) => /\b(null|undefined|After the lesson above)\b/.test(node.textContent)), false, 'lesson map omits empty and redundant helper text');
    assert.equal(await stages.page.locator('.lesson-map-state.next-state').count(), 1, 'exactly one unfinished lesson is marked next');
    assert.equal(await stages.page.locator('.lesson-connector').count(), (await stages.page.locator('.lesson-bubble').count()) - 1, 'adjacent lessons are linked by downward connectors');
    const mapTitles = await stages.page.locator('.lesson-bubble b').allTextContents();
    const runtimeTitles = await stages.page.evaluate((stage) => window.GH200Course.lessons.filter((lesson) => lesson.stage === stage).map((lesson) => lesson.title), names[i]);
    assert.deepEqual(mapTitles, runtimeTitles, 'lesson map order matches runtime order');
    await stages.page.getByRole('button', { name: '← Back to roadmap' }).click();
    await stages.page.getByRole('heading', { name: 'Your GitHub Actions learning path' }).waitFor();
  }
  await assertNoOverflow(stages.page);
  await stages.context.close();

  const route = await freshPage(httpUrl, { width: 1440, height: 900 });
  await start(route.page);
  for (let index = 0; index < 17; index += 1) {
    const current = await route.page.evaluate((i) => window.GH200Course.lessons[i], index);
    await route.page.locator('#yaml-editor').fill(current.solution);
    await route.page.getByRole('button', { name: 'Test this YAML' }).click();
    await route.page.getByText('Looks good — this draft meets the exercise checks.').waitFor();
    await route.page.getByRole('button', { name: 'Mark as done' }).click();
    if (index < 16) {
      const nextTitle = await route.page.evaluate((i) => window.GH200Course.lessons[i + 1].title, index);
      await route.page.getByRole('button', { name: 'Continue: ' + nextTitle }).click();
    }
    else await route.page.getByRole('button', { name: 'See your completion summary' }).click();
  }
  await route.page.getByRole('heading', { name: 'You have completed all 17 lessons.' }).waitFor();
  await route.page.reload();
  await route.page.getByRole('link', { name: 'GH-200 practice' }).click();
  assert.match(await route.page.locator('#path .stage-card').first().textContent(), /✓ Complete/, 'completion appears on the roadmap');
  assert.deepEqual(route.errors, [], 'route has no page errors');
  assert.deepEqual(route.external, [], 'route has no external requests');
  await route.context.close();

  const persistence = await freshPage(httpUrl, { width: 360, height: 740 });
  await start(persistence.page);
  const firstSolution = await persistence.page.evaluate(() => window.GH200Course.lessons[0].solution);
  await persistence.page.locator('#yaml-editor').fill(firstSolution);
  await persistence.page.getByRole('button', { name: 'Test this YAML' }).click();
  await persistence.page.getByRole('button', { name: 'Mark as done' }).click();
  assert.equal(await persistence.page.getByRole('button', { name: 'Mark as done' }).count(), 0, 'completed lesson needs no repeat confirmation');
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  assert.equal(await persistence.page.locator('.lesson-map-state.next-state').count(), 1, 'completion leaves exactly one next marker');
  assert.equal(await persistence.page.locator('.lesson-map-state.next-state').textContent(), 'Up next', 'completion moves next marker to the following lesson');
  await persistence.page.locator('.lesson-bubble').first().click();
  await persistence.page.reload();
  assert.match(await persistence.page.locator('.completed-help').textContent(), /Completed\./, 'completed state is unambiguous after reload');
  await persistence.page.locator('#yaml-editor').fill('name: changed after completion');
  assert.equal(await persistence.page.locator('#lesson-continue').count(), 0, 'editing removes stale continuation');
  assert.equal(await persistence.page.locator('#lesson-status').textContent(), 'Practice now', 'editing removes stale completed status');
  assert.equal(await persistence.page.locator('.completed-help').count(), 0, 'editing removes stale completed message');
  assert.equal(await persistence.page.getByRole('button', { name: 'Mark as done' }).isDisabled(), true, 'edited draft must pass again');
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  assert.equal(await persistence.page.locator('.lesson-map-state.next-state').textContent(), 'Start here', 'editing invalidation restores the earlier next marker');
  await persistence.page.locator('.lesson-bubble').first().click();
  await persistence.page.locator('#yaml-editor').fill(firstSolution);
  await persistence.page.getByRole('button', { name: 'Test this YAML' }).click();
  assert.equal(await persistence.page.getByRole('button', { name: 'Mark as done' }).isDisabled(), false, 'passing the current edit enables completion');
  await persistence.page.getByRole('button', { name: 'Mark as done' }).click();
  assert.match(await persistence.page.locator('.completed-help').textContent(), /Completed\./, 'completion is restored after the edited draft passes');
  await persistence.page.locator('#yaml-editor').fill('name: unfinished draft');
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  await persistence.page.locator('.lesson-bubble').nth(1).click();
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  await persistence.page.locator('.lesson-bubble').first().click();
  assert.equal(await persistence.page.locator('#yaml-editor').inputValue(), 'name: unfinished draft');
  await persistence.page.reload();
  assert.equal(await persistence.page.locator('#yaml-editor').inputValue(), 'name: unfinished draft', 'unfinished draft survives reload');
  const sourceHref = await persistence.page.locator('.source-link a').getAttribute('href');
  assert.ok(sourceHref && /^https:\/\//.test(sourceHref), 'official source link is available');
  persistence.page.once('dialog', (dialog) => dialog.dismiss());
  await persistence.page.getByRole('button', { name: 'Reset this exercise' }).click();
  assert.equal(await persistence.page.locator('#yaml-editor').inputValue(), 'name: unfinished draft', 'cancel keeps draft');
  persistence.page.once('dialog', (dialog) => dialog.accept());
  await persistence.page.getByRole('button', { name: 'Reset this exercise' }).click();
  assert.notEqual(await persistence.page.locator('#yaml-editor').inputValue(), 'name: unfinished draft', 'accept restores starter');
  await persistence.context.close();

  for (const url of [fileUrl, httpUrl]) {
    const library = await freshPage(url, { width: 360, height: 740 });
    await library.page.getByRole('button', { name: 'Practice questions' }).click();
    await library.page.getByRole('heading', { name: 'Practice questions' }).waitFor();
    const firstQuestion = await library.page.evaluate(() => window.GH200Course.questions && window.GH200Course.questions[0]);
    assert.ok(firstQuestion, 'runtime publishes source-derived practice questions');
    assert.ok(Array.isArray(firstQuestion.sources) && firstQuestion.sources.length, 'questions include official sources');
    assert.ok(await library.page.locator('#question-domain option').count() > 1, 'domain filter is populated');
    assert.ok(await library.page.locator('#question-domain option', { hasText: 'Author and manage workflows' }).count(), 'domain option uses an official readable name');
    await library.page.locator('#question-domain').selectOption(firstQuestion.domain);
    await library.page.locator(`input[name="practice-answer"][value="${firstQuestion.correct}"]`).check();
    await library.page.getByRole('button', { name: 'Check answer' }).click();
    await library.page.getByText(firstQuestion.explanation).waitFor();
    assert.ok(await library.page.locator('.question-sources a').count() > 0, 'checked answer exposes source links');
    await library.page.reload();
    assert.equal(await library.page.locator(`input[name="practice-answer"][value="${firstQuestion.correct}"]`).isChecked(), true, 'practice answer survives reload');
    await library.page.getByRole('button', { name: 'Open exam practice resources' }).click();
    await library.page.getByRole('heading', { name: 'References' }).waitFor();
    await library.page.getByRole('heading', { name: 'Exam practice resources' }).waitFor();
    assert.match(await library.page.locator('#exam-practice').textContent(), /not released past exam papers/i, 'exam area rejects past-paper claim');
    assert.ok(await library.page.locator('.compact-reference .reference-open').count() >= 2, 'exam resources expose their external links');
    assert.equal(await library.page.locator('#exam-practice .reference-details').count(), 0, 'links-only exam resources have no fake offline content or downloads');
    const snapshot = library.page.locator('[data-reference-id="github-docs-workflow-syntax-snapshot"]');
    await assert.equal(await snapshot.locator('details.reference-details').getAttribute('open'), null, 'content-backed reference details start closed');
    await assert.match(await snapshot.locator('.reference-badge').textContent(), /Official/, 'primary reference has an official badge');
    const download = library.page.waitForEvent('download');
    await snapshot.locator('details.reference-details > summary').click();
    await snapshot.getByRole('button', { name: /Download source snapshot/ }).click();
    const artifact = await download;
    assert.match(artifact.suggestedFilename(), /\.md$/, 'reference download is Markdown');
    const downloaded = await readFile(await artifact.path(), 'utf8');
    assert.match(downloaded, /Source: https:/, 'download includes source metadata');
    assert.match(downloaded, /Content: (source-snapshot|original-summary)/, 'download records content classification');
    assert.match(await library.page.locator('.reference-card button').first().getAttribute('aria-label'), /Download .+: .+/, 'reference download has a unique title-aware accessible name');
    await assertNoOverflow(library.page);
    assert.deepEqual(library.errors, [], 'practice/library has no page errors');
    assert.deepEqual(library.external, [], 'practice/library makes no external requests until learner opens a source');
    await library.context.close();
  }

  const retry = await freshPage(httpUrl, { width: 360, height: 740 });
  await retry.page.getByRole('button', { name: 'Practice questions' }).click();
  const retryQuestion = await retry.page.evaluate(() => window.GH200Course.questions[0]);
  const wrong = retryQuestion.correct === 0 ? 1 : 0;
  await retry.page.locator(`input[name="practice-answer"][value="${wrong}"]`).focus();
  await retry.page.locator(`input[name="practice-answer"][value="${wrong}"]`).press(' ');
  await retry.page.waitForTimeout(20);
  assert.equal(await retry.page.evaluate(() => document.activeElement.value), String(wrong), 'keyboard/radio selection retains focus after rerender');
  await retry.page.getByRole('button', { name: 'Check answer' }).click();
  await retry.page.locator('.review-toggle input').check();
  await retry.page.getByRole('button', { name: 'Try again' }).click();
  assert.equal(await retry.page.locator('[data-question-id]').getAttribute('data-question-id'), retryQuestion.id, 'retry stays in review queue');
  await retry.page.reload();
  await retry.page.locator(`input[name="practice-answer"][value="${retryQuestion.correct}"]`).check();
  await retry.page.getByRole('button', { name: 'Check answer' }).click();
  await retry.page.getByText('Correct.').waitFor();
  await retry.page.getByRole('button', { name: 'Next' }).click();
  await retry.page.getByRole('heading', { name: 'No matching questions' }).waitFor();
  await retry.context.close();

  const malformed = await browser.newContext({ viewport: { width: 360, height: 740 } });
  await malformed.addInitScript(() => localStorage.setItem('actions-academy-gh200-v1', JSON.stringify({ selected: 4, drafts: 'bad', completed: [] })));
  const malformedPage = await malformed.newPage();
  await malformedPage.goto(httpUrl);
  await malformedPage.getByRole('heading', { name: 'Your GitHub Actions learning path' }).waitFor();
  await malformed.close();

  const blocked = await browser.newContext({ viewport: { width: 360, height: 740 } });
  await blocked.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(httpUrl);
  await start(blockedPage);
  await blockedPage.locator('#yaml-editor').fill('name: still usable');
  assert.equal(await blockedPage.locator('#yaml-editor').inputValue(), 'name: still usable');
  await blocked.close();
  console.log('UI regression passed: file, HTTP, mobile, lessons, practice, references, downloads, and storage recovery.');
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
