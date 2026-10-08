import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'visual');
const moduleTarget = process.env.GH200_PLAYWRIGHT_MODULE || 'playwright-core';
const playwright = await import(moduleTarget.startsWith('.') || moduleTarget.startsWith('/') ? pathToFileURL(resolve(moduleTarget)).href : moduleTarget);
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.GH200_BROWSER_EXECUTABLE, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/plain' };
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const local = pathname === '/' || pathname === '/gh-200-github-actions/' ? '/index.html' : pathname.replace(/^\/gh-200-github-actions(?=\/)/, '');
    const file = resolve(root, '.' + local);
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
  await page.getByRole('heading', { name: 'Learning path' }).waitFor();
  return { context, page, errors, external };
}

async function assertNoOverflow(page) {
  const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(widths.document <= widths.viewport, `page horizontally overflows (${widths.document}px > ${widths.viewport}px)`);
}

async function assertLessonContained(page) {
  const bounds = await page.evaluate(() => [...document.querySelectorAll('.lesson-head, .lesson-columns > *')].map((node) => {
    const rect = node.getBoundingClientRect();
    return { label: node.id || node.className, left: rect.left, right: rect.right };
  }));
  bounds.forEach((bound) => {
    assert.ok(bound.left >= 0, `${bound.label} extends past the left viewport edge (${bound.left}px)`);
    assert.ok(bound.right <= 1440, `${bound.label} extends past the viewport edge (${bound.right}px)`);
  });
}

async function assertCenteredPath(page, nodeSelector, connectorSelector, label) {
  const geometry = await page.evaluate(({ nodeSelector, connectorSelector }) => {
    const rect = (node) => { const box = node.getBoundingClientRect(); return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height, center: box.left + box.width / 2 }; };
    return { viewport: window.innerWidth, overflow: document.documentElement.scrollWidth, nodes: [...document.querySelectorAll(nodeSelector)].map(rect), connectors: [...document.querySelectorAll(connectorSelector)].map(rect) };
  }, { nodeSelector, connectorSelector });
  assert.equal(geometry.overflow, geometry.viewport, `${label} has no horizontal overflow`);
  geometry.nodes.forEach((node, index) => {
    assert.ok(node.width >= 44 && node.height >= 44, `${label} node ${index + 1} keeps a 44px target`);
    assert.ok(Math.abs(node.width - node.height) <= 2, `${label} node ${index + 1} is circular`);
    assert.ok(node.left >= 0 && node.right <= geometry.viewport, `${label} node ${index + 1} stays contained`);
  });
  assert.equal(geometry.connectors.length, Math.max(geometry.nodes.length - 1, 0), `${label} has one connector between adjacent nodes`);
  geometry.connectors.forEach((connector, index) => {
    const above = geometry.nodes[index]; const below = geometry.nodes[index + 1];
    assert.ok(Math.abs(connector.center - above.center) <= 1 && Math.abs(connector.center - below.center) <= 1, `${label} connector ${index + 1} is centred`);
    assert.ok(Math.abs(connector.top - above.bottom) <= 1 && Math.abs(connector.bottom - below.top) <= 1, `${label} connector ${index + 1} meets both node boundaries`);
  });
}

async function start(page) {
  await page.locator('#path .stage-card').first().click();
  await page.locator('.lesson-bubble').first().click();
  await page.getByRole('button', { name: 'Test this YAML' }).waitFor();
}

try {
  for (const url of [fileUrl, httpUrl, `${httpUrl}gh-200-github-actions/`]) {
    const test = await freshPage(url, { width: 360, height: 740 });
    assert.equal(await test.page.locator('.stepper').count(), 0, 'numbered phase bar is absent');
    assert.equal(await test.page.locator('#path .stage-card').count(), 4, 'overview contains four topic bubbles');
    assert.deepEqual(await test.page.locator('#path .stage-card b').allTextContents(), ['Foundations', 'Connect jobs', 'Reuse and debug', 'Secure delivery'], 'overview has the requested topic order');
    assert.equal(await test.page.getByText(/\d+\/\d+ complete/).count(), 0, 'overview shows no visible numeric topic counters');
    await assertCenteredPath(test.page, '#path .stage-card', '#path .roadmap-connector', 'roadmap');
    assert.equal(await test.page.locator('#path .map-lesson').count(), 0, 'overview does not expose the lesson list');
    await start(test.page);
    assert.equal(await test.page.locator('.task-card').count(), 1, 'lesson has one concise task card');
    assert.equal(await test.page.locator('.learn-card .task').count(), 0, 'learn card has no buried task block');
    assert.equal(await test.page.locator('.editor-card .instructions').count(), 0, 'editor does not repeat task steps');
    assert.match(await test.page.locator('.task-card').textContent(), /Your goal[\s\S]*Make these changes/, 'task card has the required task hierarchy');
    assert.doesNotMatch(await test.page.locator('.task-card').textContent(), /Where to edit/, 'task card does not repeat the edit location');
    assert.doesNotMatch(await test.page.locator('.task-card').textContent(), /Keep unchanged|Match its indentation to the surrounding YAML\./, 'task card omits redundant guidance');
    assert.equal(await test.page.locator('.task-meta').count(), 0, 'task card has no duplicate file metadata');
    assert.equal(await test.page.locator('.task-indent-note, .task-keep').count(), 0, 'task card has no redundant guidance elements');
    assert.equal(await test.page.locator('#editor-card .file-label').textContent(), 'workflow.yml', 'editor has the single file label');
    assert.equal(await test.page.locator('#editor-card .editor-tools .reset').count(), 1, 'editor toolbar contains one reset control');
    assert.equal(await test.page.locator('.reset').count(), 1, 'reset is not duplicated elsewhere');
    assert.equal(await test.page.locator('.reset-row').count(), 0, 'standalone reset row is absent');
    const taskSource = test.page.locator('.task-card .source-link a');
    assert.ok(await taskSource.getAttribute('href'), 'official docs link is inside the task card');
    assert.equal(await taskSource.getAttribute('target'), '_blank', 'official docs opens in a new tab');
    assert.equal(await taskSource.getAttribute('rel'), 'noreferrer', 'official docs link keeps noreferrer');
    assert.equal(await test.page.locator('.task-card .hosted-link').count(), 0, 'browser lessons do not mix in the fork-and-VS-Code route');
    assert.equal(await test.page.getByText('Pass the current draft to mark this lesson done.', { exact: true }).count(), 0, 'removed completion prompt is absent on starter');
    const solution = test.page.locator('details').filter({ has: test.page.getByText('View solution', { exact: true }) });
    assert.equal(await solution.count(), 1, 'lesson has the renamed solution disclosure');
    assert.equal(await test.page.getByText('View a separate solution', { exact: true }).count(), 0, 'old solution disclosure is absent');
    assert.equal(await test.page.getByText('Checks your YAML; nothing is run on GitHub.', { exact: true }).count(), 0, 'removed check note is absent');
    await solution.locator('summary').click();
    assert.notEqual(await solution.getAttribute('open'), null, 'solution disclosure opens');
    assert.match(await solution.locator('.solution-code').textContent(), /name:/, 'open disclosure shows the answer');
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
  await assertCenteredPath(stages.page, '#path .stage-card', '#path .roadmap-connector', 'desktop roadmap');
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
    await assertCenteredPath(stages.page, '.lesson-bubble', '.lesson-connector', `${names[i]} lesson path`);
    const mapTitles = await stages.page.locator('.lesson-bubble b').allTextContents();
    const runtimeTitles = await stages.page.evaluate((stage) => window.GH200Course.lessons.filter((lesson) => lesson.stage === stage).map((lesson) => lesson.title), names[i]);
    assert.deepEqual(mapTitles, runtimeTitles, 'lesson map order matches runtime order');
    await stages.page.getByRole('button', { name: 'Back to roadmap' }).click();
    await stages.page.getByRole('heading', { name: 'Learning path' }).waitFor();
  }
  await assertNoOverflow(stages.page);
  await stages.context.close();

  const route = await freshPage(httpUrl, { width: 1440, height: 900 });
  await start(route.page);
  for (let index = 0; index < 17; index += 1) {
    const current = await route.page.evaluate((i) => window.GH200Course.lessons[i], index);
    assert.ok(current.task && current.file && current.editLocation && current.keep, `lesson ${index + 1} has a clear goal, file, edit location, and keep guidance`);
    assert.ok(Array.isArray(current.instructions) && current.instructions.length, `lesson ${index + 1} has actionable changes`);
    assert.equal(await route.page.locator('.task-card .hosted-link').count(), 0, `lesson ${index + 1} keeps the browser route separate`);
    assert.equal(await route.page.locator('.lesson-columns > .learn-card, .lesson-columns > .editor-card, .lesson-columns > .task-card').count(), 3, `lesson ${index + 1} has the three focused desktop columns`);
    assert.equal(await route.page.locator('.lesson-columns > #check-feedback, .lesson-columns > .hint-solution, .lesson-columns > .done-row').count(), 0, `lesson ${index + 1} keeps editor interaction inside the center column`);
    if (index === 0) assert.match(current.editExample || '', /^on:\n  /, 'lesson 01 example preserves two-space YAML indentation');
    if (index === 9) assert.equal(current.file, 'action.yml', 'lesson 10 targets action.yml');
    await route.page.locator('#yaml-editor').fill(current.solution);
    await route.page.getByRole('button', { name: 'Test this YAML' }).click();
    await route.page.getByText('Looks good — this draft meets the exercise checks.').waitFor();
    await route.page.getByRole('button', { name: 'Mark as done' }).click();
    if (index < 16) {
      const nextTitle = await route.page.evaluate((i) => window.GH200Course.lessons[i + 1].title, index);
      await route.page.getByRole('heading', { name: nextTitle }).waitFor();
      assert.equal(await route.page.locator('#lesson-continue').count(), 0, 'completion advances immediately without a continuation button');
    }
    else {
      await route.page.getByRole('heading', { name: 'Learning path' }).waitFor();
      assert.equal(await route.page.getByText('You have completed all 17 lessons.', { exact: true }).count(), 0, 'last completion returns directly to the roadmap');
    }
  }
  await route.page.reload();
  await route.page.getByRole('link', { name: 'GH-200 practice' }).click();
  assert.match(await route.page.locator('#path .stage-card').first().textContent(), /Done/, 'completion appears on the roadmap');
  await route.page.locator('#path .stage-card').last().click();
  await route.page.locator('.lesson-bubble').last().click();
  assert.equal(await route.page.locator('#lesson-continue').count(), 0, 'reopened final lesson has no continuation panel');
  assert.equal(await route.page.getByRole('button', { name: 'See your completion summary' }).count(), 0, 'reopened final lesson has no completion-summary action');
  assert.deepEqual(route.errors, [], 'route has no page errors');
  assert.deepEqual(route.external, [], 'route has no external requests');
  await route.context.close();

  const responsiveLesson = await freshPage(httpUrl, { width: 1440, height: 900 });
  await start(responsiveLesson.page);
  assert.ok(await responsiveLesson.page.locator('#editor-card').evaluate((node) => node.getBoundingClientRect().width >= 400), 'desktop editor remains at least 400px wide');
  assert.ok(await responsiveLesson.page.locator('#editor-card').evaluate((node) => node.getBoundingClientRect().top <= 280), 'desktop editor starts in the first useful viewport');
  assert.ok(await responsiveLesson.page.locator('.lesson-head h1').evaluate((node) => node.getBoundingClientRect().height <= 42), 'lesson heading remains compact on desktop');
  await responsiveLesson.page.locator('#yaml-editor').fill(await responsiveLesson.page.evaluate(() => window.GH200Course.lessons[0].solution));
  await responsiveLesson.page.getByRole('button', { name: 'Test this YAML' }).click();
  assert.equal(await responsiveLesson.page.locator('#editor-card > #check-feedback').count(), 1, 'lesson feedback stays with the editor');
  assert.equal(await responsiveLesson.page.locator('#editor-card > .hint-solution').count(), 1, 'lesson hints stay with the editor');
  assert.equal(await responsiveLesson.page.locator('#editor-card > #done-row').count(), 1, 'lesson completion stays with the editor');
  await assertNoOverflow(responsiveLesson.page);
  await assertLessonContained(responsiveLesson.page);
  for (const [width, columns] of [[360, 1], [700, 1], [720, 1], [740, 1], [760, 2], [768, 2], [1024, 2], [1180, 2], [1200, 3], [1440, 3]]) {
    await responsiveLesson.page.setViewportSize({ width, height: 900 });
    await assertNoOverflow(responsiveLesson.page);
    const layout = await responsiveLesson.page.locator('.lesson-columns').evaluate((node) => ({
      columns: getComputedStyle(node).gridTemplateColumns.split(' ').length,
      viewport: window.innerWidth,
      bounds: [...document.querySelectorAll('.lesson-head, .lesson-columns > *')].map((item) => {
        const rect = item.getBoundingClientRect();
        return { label: item.id || item.className, left: rect.left, right: rect.right };
      }),
    }));
    assert.equal(layout.columns, columns, `${width}px uses the intended lesson grid`);
    layout.bounds.forEach((bound) => {
      assert.ok(bound.left >= 0, `${width}px ${bound.label} remains inside the left edge`);
      assert.ok(bound.right <= layout.viewport, `${width}px ${bound.label} remains inside the right edge`);
    });
  }
  await responsiveLesson.context.close();

  const persistence = await freshPage(httpUrl, { width: 360, height: 740 });
  await start(persistence.page);
  const firstSolution = await persistence.page.evaluate(() => window.GH200Course.lessons[0].solution);
  await persistence.page.locator('#yaml-editor').fill(firstSolution);
  await persistence.page.getByRole('button', { name: 'Test this YAML' }).click();
  await persistence.page.getByRole('button', { name: 'Mark as done' }).click();
  await persistence.page.getByRole('heading', { name: await persistence.page.evaluate(() => window.GH200Course.lessons[1].title) }).waitFor();
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  assert.equal(await persistence.page.locator('.lesson-map-state.next-state').count(), 1, 'completion leaves exactly one next marker');
  assert.equal(await persistence.page.locator('.lesson-map-state.next-state').textContent(), 'Start', 'completion moves the minimal next marker to the following lesson');
  await persistence.page.locator('.lesson-bubble').first().click();
  await persistence.page.reload();
  assert.equal(await persistence.page.locator('#lesson-status').textContent(), 'Completed', 'completed state is shown once in the lesson header after reload');
  assert.equal(await persistence.page.locator('.completed-help').count(), 0, 'completed state has no repeated bottom message');
  await persistence.page.locator('#yaml-editor').fill('name: changed after completion');
  assert.equal(await persistence.page.locator('#lesson-continue').count(), 0, 'editing removes stale continuation');
  assert.equal(await persistence.page.locator('#lesson-status').textContent(), '', 'editing removes stale completed status');
  assert.equal(await persistence.page.locator('.completed-help').count(), 0, 'editing removes stale completed message');
  assert.equal(await persistence.page.getByRole('button', { name: 'Mark as done' }).isDisabled(), true, 'edited draft must pass again');
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  assert.equal(await persistence.page.locator('.lesson-map-state.next-state').textContent(), 'Start', 'editing invalidation restores the minimal next marker');
  await persistence.page.locator('.lesson-bubble').first().click();
  await persistence.page.locator('#yaml-editor').fill(firstSolution);
  await persistence.page.getByRole('button', { name: 'Test this YAML' }).click();
  assert.equal(await persistence.page.getByRole('button', { name: 'Mark as done' }).isDisabled(), false, 'passing the current edit enables completion');
  await persistence.page.getByRole('button', { name: 'Mark as done' }).click();
  await persistence.page.getByRole('heading', { name: await persistence.page.evaluate(() => window.GH200Course.lessons[1].title) }).waitFor();
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  await persistence.page.locator('.lesson-bubble').first().click();
  assert.equal(await persistence.page.locator('#lesson-status').textContent(), 'Completed', 'completion is restored after the edited draft passes');
  assert.equal(await persistence.page.locator('.completed-help').count(), 0, 'restored completion has no repeated bottom message');
  await persistence.page.locator('#yaml-editor').fill('name: unfinished draft');
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  await persistence.page.locator('.lesson-bubble').nth(1).click();
  await persistence.page.getByRole('button', { name: /Back to Foundations/ }).click();
  await persistence.page.locator('.lesson-bubble').first().click();
  assert.equal(await persistence.page.locator('#yaml-editor').inputValue(), 'name: unfinished draft');
  await persistence.page.reload();
  assert.equal(await persistence.page.locator('#yaml-editor').inputValue(), 'name: unfinished draft', 'unfinished draft survives reload');
  assert.equal(await persistence.page.getByText('Pass the current draft to mark this lesson done.', { exact: true }).count(), 0, 'removed completion prompt stays absent after editing a completed lesson');
  const sourceHref = await persistence.page.locator('.task-card .source-link a').getAttribute('href');
  assert.ok(sourceHref && /^https:\/\//.test(sourceHref), 'official source link is available');
  persistence.page.once('dialog', (dialog) => dialog.dismiss());
  await persistence.page.getByRole('button', { name: 'Reset', exact: true }).click();
  assert.equal(await persistence.page.locator('#yaml-editor').inputValue(), 'name: unfinished draft', 'cancel keeps draft');
  persistence.page.once('dialog', (dialog) => dialog.accept());
  await persistence.page.getByRole('button', { name: 'Reset', exact: true }).click();
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
    assert.equal(await library.page.getByRole('button', { name: 'Check answer' }).isDisabled(), true, 'Check answer is disabled until a choice is made');
    assert.equal(await library.page.getByRole('button', { name: 'Previous' }).isDisabled(), true, 'Previous is disabled on the first question');
    await library.page.locator('#question-domain').selectOption(firstQuestion.domain);
    await library.page.locator(`input[name="practice-answer"][value="${firstQuestion.correct}"]`).check();
    await library.page.getByRole('button', { name: 'Check answer' }).click();
    await library.page.getByText(firstQuestion.explanation).waitFor();
    assert.equal(await library.page.getByRole('button', { name: 'Checked' }).count(), 0, 'checked state does not leave a duplicate disabled action');
    assert.equal(await library.page.locator('.question-feedback h3').count(), 0, 'sources do not repeat a source heading');
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
  assert.equal(await retry.page.getByRole('button', { name: 'Try again' }).count(), 1, 'wrong answer offers one concise retry');
  await retry.page.locator('.review-toggle input').check();
  await retry.page.getByRole('button', { name: 'Try again' }).click();
  assert.equal(await retry.page.locator('[data-question-id]').getAttribute('data-question-id'), retryQuestion.id, 'retry stays in review queue');
  await retry.page.reload();
  await retry.page.locator(`input[name="practice-answer"][value="${retryQuestion.correct}"]`).check();
  await retry.page.getByRole('button', { name: 'Check answer' }).click();
  await retry.page.getByText('Correct.').waitFor();
  assert.equal(await retry.page.getByRole('button', { name: 'Try again' }).count(), 0, 'correct answer leaves Next as the primary progression');
  await retry.page.getByRole('button', { name: 'Next' }).click();
  await retry.page.getByRole('heading', { name: 'No matching questions' }).waitFor();
  await retry.context.close();

  const malformed = await browser.newContext({ viewport: { width: 360, height: 740 } });
  await malformed.addInitScript(() => localStorage.setItem('actions-academy-gh200-v1', JSON.stringify({ selected: 4, drafts: 'bad', completed: [] })));
  const malformedPage = await malformed.newPage();
  await malformedPage.goto(httpUrl);
  await malformedPage.getByRole('heading', { name: 'Learning path' }).waitFor();
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
