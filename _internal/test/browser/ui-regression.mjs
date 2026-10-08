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
  await page.getByRole('heading', { name: 'GitHub Actions roadmap' }).waitFor();
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

async function assertRoadmapGeometry(page, label) {
  await page.waitForFunction(() => document.querySelectorAll('#path .map-lines path').length === 20);
  const geometry = await page.evaluate(({ nodeSelector, connectorSelector }) => {
    const rect = (node) => { const box = node.getBoundingClientRect(); return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height, center: box.left + box.width / 2 }; };
    const paths = [...document.querySelectorAll('#path .map-lines path')];
    return { viewport: window.innerWidth, overflow: document.documentElement.scrollWidth, topics: [...document.querySelectorAll('#path .stage-card')].map(rect), lessons: [...document.querySelectorAll('#path .map-lesson')].map(rect), paths: paths.map((path) => path.getTotalLength()) };
  }, { nodeSelector: '#path .stage-card', connectorSelector: '#path .roadmap-connector' });
  assert.equal(geometry.overflow, geometry.viewport, `${label} has no horizontal overflow`);
  assert.equal(geometry.topics.length, 4, `${label} has four topic nodes`);
  assert.equal(geometry.lessons.length, 17, `${label} exposes every lesson as a branch`);
  geometry.topics.concat(geometry.lessons).forEach((node, index) => {
    assert.ok(node.width >= 44 && node.height >= 34, `${label} node ${index + 1} keeps a usable rectangle target`);
    assert.ok(node.width > node.height, `${label} node ${index + 1} is a horizontal rectangle, not a circle`);
    assert.ok(node.left >= 0 && node.right <= geometry.viewport, `${label} node ${index + 1} stays contained`);
  });
  assert.equal(geometry.paths.length, 20, `${label} has three trunk and seventeen measured branch paths`);
  geometry.paths.forEach((length, index) => assert.ok(length > 8, `${label} SVG path ${index + 1} has visible length`));
}

async function assertMapNoOverlap(page, label) {
  const nodes = await page.locator('#path .stage-card, #path .map-lesson').evaluateAll((items) => items.map((item) => {
    const rect = item.getBoundingClientRect();
    return { label: item.getAttribute('aria-label') || item.textContent, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  }));
  for (let index = 0; index < nodes.length; index += 1) for (let other = index + 1; other < nodes.length; other += 1) {
    const a = nodes[index]; const b = nodes[other];
    assert.equal(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom, false, `${label}: ${a.label} overlaps ${b.label}`);
  }
}

async function start(page) {
  await page.locator('#path .map-lesson').first().click();
  await page.getByRole('button', { name: 'Test this YAML' }).waitFor();
}

try {
  for (const url of [fileUrl, httpUrl, `${httpUrl}gh-200-github-actions/`]) {
    const test = await freshPage(url, { width: 360, height: 740 });
    assert.equal(await test.page.locator('.stepper').count(), 0, 'numbered phase bar is absent');
    assert.equal(await test.page.locator('#path .stage-card').count(), 4, 'overview contains four topic rectangles');
    assert.deepEqual(await test.page.locator('#path .stage-card b').allTextContents(), ['Foundations', 'Connect jobs', 'Reuse and debug', 'Secure delivery'], 'overview has the requested topic order');
    assert.equal(await test.page.getByText(/\d+\/\d+ complete/).count(), 0, 'overview shows no visible numeric topic counters');
    await assertRoadmapGeometry(test.page, 'roadmap');
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
  const names = await stages.page.evaluate(() => window.GH200Course.lessons.map((lesson) => lesson.title));
  assert.equal(await stages.page.locator('button.stage-card').count(), 0, 'chapter headings do not create an intermediate menu');
  await assertRoadmapGeometry(stages.page, 'desktop roadmap');
  assert.equal(await stages.page.locator('#progress-count').count(), 0, 'top bar does not duplicate lesson progress');
  for (let i = 0; i < names.length; i += 1) {
    await stages.page.goto(httpUrl);
    const branch = stages.page.locator('#path .map-lesson').nth(i);
    await branch.click();
    await stages.page.getByRole('heading', { name: names[i] }).waitFor();
    await stages.page.getByRole('button', { name: 'Back to roadmap' }).click();
    await stages.page.locator('#path .map-lesson').nth(i).waitFor();
    assert.equal(await stages.page.locator('#path .map-lesson').count(), 17, 'Back returns to the full root map');
  }
  await assertNoOverflow(stages.page);
  await stages.context.close();

  const mobileMap = await freshPage(httpUrl, { width: 360, height: 740 });
  await assertMapNoOverlap(mobileMap.page, '360px root map');
  for (let index = 0; index < 17; index += 1) {
    const branch = mobileMap.page.locator('#path .map-lesson').nth(index);
    await branch.click();
    await mobileMap.page.getByRole('button', { name: 'Back to roadmap' }).click();
    await mobileMap.page.locator('#path .map-lesson').nth(index).waitFor();
    await mobileMap.page.waitForTimeout(30);
    assert.equal(await mobileMap.page.evaluate((i) => document.activeElement === document.querySelectorAll('#path .map-lesson')[i], index), true, `360px Back restores focus to branch ${index + 1}`);
    await assertMapNoOverlap(mobileMap.page, `360px map after branch ${index + 1}`);
  }
  await mobileMap.context.close();

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
      await route.page.getByRole('heading', { name: 'GitHub Actions roadmap' }).waitFor();
      assert.equal(await route.page.getByText('You have completed all 17 lessons.', { exact: true }).count(), 0, 'last completion returns directly to the roadmap');
    }
  }
  await route.page.reload();
  await route.page.getByRole('link', { name: 'GH-200 practice' }).click();
  assert.match(await route.page.locator('#path .stage-card').first().textContent(), /✓/, 'completion appears on the roadmap');
  assert.match(await route.page.locator('#path .stage-card').first().evaluate((node) => getComputedStyle(node).backgroundColor), /rgb\(233, 247, 239\)/, 'fully completed chapter is green');
  await route.page.locator('#path .stage-card').first().hover();
  assert.match(await route.page.locator('#path .stage-card').first().evaluate((node) => getComputedStyle(node).backgroundColor), /rgb\(233, 247, 239\)/, 'completed chapter remains green on hover');
  await route.page.locator('#path .map-lesson').first().click();
  await route.page.locator('#yaml-editor').fill('name: invalidated chapter');
  await route.page.getByRole('button', { name: 'Back to roadmap' }).click();
  assert.match(await route.page.locator('#path .stage-card').first().evaluate((node) => getComputedStyle(node).backgroundColor), /rgb\(255, 235, 59\)/, 'editing a completed lesson returns its chapter heading to yellow');
  await route.page.locator('#path .map-lesson').last().click();
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
  await persistence.page.getByRole('button', { name: 'Back to roadmap' }).click();
  assert.equal(await persistence.page.getByText('Start', { exact:true }).count(), 0, 'roadmap has no progress text labels');
  await persistence.page.locator('#path .map-lesson').first().click();
  await persistence.page.reload();
  assert.equal(await persistence.page.locator('#lesson-status').textContent(), 'Completed', 'completed state is shown once in the lesson header after reload');
  assert.equal(await persistence.page.locator('.completed-help').count(), 0, 'completed state has no repeated bottom message');
  await persistence.page.locator('#yaml-editor').fill('name: changed after completion');
  assert.equal(await persistence.page.locator('#lesson-continue').count(), 0, 'editing removes stale continuation');
  assert.equal(await persistence.page.locator('#lesson-status').textContent(), '', 'editing removes stale completed status');
  assert.equal(await persistence.page.locator('.completed-help').count(), 0, 'editing removes stale completed message');
  assert.equal(await persistence.page.getByRole('button', { name: 'Mark as done' }).isDisabled(), true, 'edited draft must pass again');
  await persistence.page.getByRole('button', { name: 'Back to roadmap' }).click();
  assert.equal(await persistence.page.getByText('Start', { exact:true }).count(), 0, 'editing invalidation keeps the map free of progress labels');
  await persistence.page.locator('#path .map-lesson').first().click();
  await persistence.page.locator('#yaml-editor').fill(firstSolution);
  await persistence.page.getByRole('button', { name: 'Test this YAML' }).click();
  assert.equal(await persistence.page.getByRole('button', { name: 'Mark as done' }).isDisabled(), false, 'passing the current edit enables completion');
  await persistence.page.getByRole('button', { name: 'Mark as done' }).click();
  await persistence.page.getByRole('heading', { name: await persistence.page.evaluate(() => window.GH200Course.lessons[1].title) }).waitFor();
  await persistence.page.getByRole('button', { name: 'Back to roadmap' }).click();
  await persistence.page.locator('#path .map-lesson').first().click();
  assert.equal(await persistence.page.locator('#lesson-status').textContent(), 'Completed', 'completion is restored after the edited draft passes');
  assert.equal(await persistence.page.locator('.completed-help').count(), 0, 'restored completion has no repeated bottom message');
  await persistence.page.locator('#yaml-editor').fill('name: unfinished draft');
  await persistence.page.getByRole('button', { name: 'Back to roadmap' }).click();
  await persistence.page.locator('#path .map-lesson').nth(1).click();
  await persistence.page.getByRole('button', { name: 'Back to roadmap' }).click();
  await persistence.page.locator('#path .map-lesson').first().click();
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
    assert.equal(await library.page.locator('.question-sources a').first().textContent(), 'Source', 'answer links use the concise Source label');
    await library.page.getByRole('button', { name: 'Exam practice resources' }).click();
    await library.page.getByRole('heading', { name: 'References' }).waitFor();
    await library.page.getByRole('heading', { name: 'Exam practice' }).waitFor();
    assert.equal(await library.page.locator('.reference-badge, .reference-details, .download-card, .offline-read').count(), 0, 'references omit badges, disclosures, offline readers, and downloads');
    const catalog = await library.page.evaluate(() => window.GH200Course.references.filter((reference) => /^https:\/\//.test(reference.url)).map((reference) => reference.url));
    const links = library.page.locator('.reference-title-link');
    assert.equal(await links.count(), catalog.length, 'every catalog URL is rendered as a title link');
    const renderedUrls = await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
    assert.deepEqual([...renderedUrls].sort(), [...catalog].sort(), 'reference title links preserve every catalog URL');
    for (let index = 0; index < catalog.length; index += 1) {
      assert.equal(await links.nth(index).getAttribute('target'), '_blank', 'reference opens in a new tab');
      assert.equal(await links.nth(index).getAttribute('rel'), 'noreferrer', 'reference retains noreferrer');
    }
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
  await malformed.addInitScript(() => localStorage.setItem('actions-academy-gh200-v1', JSON.stringify({ selected: 4, stage: 'Foundations', drafts: 'bad', completed: [] })));
  const malformedPage = await malformed.newPage();
  await malformedPage.goto(httpUrl);
  await malformedPage.getByRole('heading', { name: 'GitHub Actions roadmap' }).waitFor();
  assert.equal(await malformedPage.locator('#path .map-lesson').count(), 17, 'legacy saved stage recovers to the one root roadmap');
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
