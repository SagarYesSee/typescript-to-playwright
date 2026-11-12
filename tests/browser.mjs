// Run with the local Worker (8787) and static server (8080) already running.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
const site = 'http://localhost:8080';
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  headless: true
});
const errors = [];
async function open(context) {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(site);
  await page.locator('[data-topic="d01-t01"]').waitFor({ state: 'attached' });
  return page;
}
async function expand(page, day) {
  await page.locator(`#day-${day}`).locator('..').locator('details').evaluate(el => { el.open = true; });
}
async function saved(page) {
  await page.waitForFunction(() => document.querySelector('#sync-status').textContent === 'Progress saved to cloud');
}
try {
  const local = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await local.addInitScript(() => {
    if (!localStorage.getItem('tsPwPath.v1')) localStorage.setItem('tsPwPath.v1', JSON.stringify({ done: [1], labs: [0], quiz: { 0: 2 }, theme: 'dark' }));
  });
  const page = await open(local);
  assert.equal(await page.locator('#day-1').isChecked(), true);
  await expand(page, 1);
  await page.locator('[data-topic="d01-t01"]').uncheck();
  assert.equal(await page.locator('#day-1').evaluate(el => el.indeterminate), true);
  assert.equal(await page.locator('[data-topic="d01-t01"]').evaluate(el => el === document.activeElement), true);
  assert.equal(await page.locator('#day-1').locator('..').locator('details').getAttribute('open'), '');
  assert.match(await page.locator('#day-1').locator('..').locator('summary').innerText(), /1\/2 topics/);
  await page.reload();
  await expand(page, 1);
  assert.equal(await page.locator('[data-topic="d01-t01"]').isChecked(), false);
  assert.equal(await page.locator('[data-topic="d01-t02"]').isChecked(), true);
  await page.locator('#day-2').check();
  assert.equal(await page.locator('[data-topic="d02-t01"]').isChecked(), true);
  assert.equal(await page.locator('[data-topic="d02-t02"]').isChecked(), true);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
  }
  const state = await page.evaluate(() => window.ProgressBridge.read());
  assert.deepEqual(state.labs, [0]);
  assert.deepEqual(state.quiz, { 0: 2 });
  assert.equal(state.theme, 'dark');
  await local.close();
  console.log('PASS: local legacy migration, topic reload, bulk days, counts, focus, responsive widths, labs/quiz/preferences');

  const layoutContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const layout = await open(layoutContext);
  const toggle = layout.locator('#sections-toggle');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await layout.locator('#section-panel').isVisible(), true);
  const expandedWidth = await layout.locator('#roadmap > .in').evaluate(el => el.getBoundingClientRect().width);
  assert.ok(expandedWidth > 1050, 'content uses the space beside the panel');
  const progressBefore = await layout.evaluate(() => window.ProgressBridge.read());
  await toggle.focus(); await layout.keyboard.press('Enter');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await layout.locator('#section-panel').isVisible(), false);
  const collapsedWidth = await layout.locator('#roadmap > .in').evaluate(el => el.getBoundingClientRect().width);
  assert.ok(collapsedWidth > expandedWidth + 200, 'collapsing gives the panel width to content');
  await layout.reload();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.deepEqual(await layout.evaluate(() => window.ProgressBridge.read()), progressBefore);
  await layout.setViewportSize({ width: 390, height: 844 });
  await toggle.click();
  await layout.locator('#section-panel a[href="#roadmap"]').click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await layout.evaluate(() => document.activeElement.id), 'roadmap');
  assert.equal(await layout.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await layoutContext.close();
  console.log('PASS: wide desktop content, collapsible panel, keyboard toggle, saved preference, mobile navigation and unchanged progress');

  const code = 'pw1_' + randomBytes(32).toString('hex');
  const created = await fetch('http://localhost:8787/api/progress', {
    method: 'POST', signal: AbortSignal.timeout(15000), headers: { Authorization: 'Bearer ' + code, 'Content-Type': 'application/json' },
    body: JSON.stringify({ changes: { 'day:1': true, 'lab:0': true, 'quiz:0': 2 } })
  });
  assert.equal(created.status, 201);
  const devices = [];
  for (let i = 0; i < 2; i++) {
    const context = await browser.newContext();
    await context.addInitScript(code => {
      if (!localStorage.getItem('tsPwPath.sync.v1')) localStorage.setItem('tsPwPath.sync.v1', JSON.stringify({ code, pending: {} }));
    }, code);
    devices.push({ context, page: await open(context) });
  }
  const [a, b] = devices;
  await saved(a.page); await saved(b.page);
  await a.context.route('**/api/progress', route => route.abort());
  await expand(a.page, 1);
  await a.page.locator('[data-topic="d01-t01"]').uncheck();
  await a.page.waitForFunction(() => document.querySelector('#sync-status').textContent.includes('Cloud unavailable'));
  await expand(b.page, 2);
  await b.page.locator('[data-topic="d02-t01"]').check();
  await saved(b.page);
  await a.page.reload();
  await a.page.waitForFunction(() => document.querySelector('#sync-status').textContent.includes('Cloud unavailable'));
  assert.equal(await a.page.locator('[data-topic="d01-t01"]').isChecked(), false);
  await a.context.unroute('**/api/progress');
  await a.page.locator('#sync-retry').click(); await saved(a.page);
  await b.page.locator('#sync-retry').click(); await saved(b.page);
  for (const device of devices) {
    assert.equal(await device.page.locator('[data-topic="d01-t01"]').isChecked(), false);
    assert.equal(await device.page.locator('[data-topic="d01-t02"]').isChecked(), true);
    assert.equal(await device.page.locator('[data-topic="d02-t01"]').isChecked(), true);
    const state = await device.page.evaluate(() => window.ProgressBridge.read());
    assert.deepEqual(state.labs, [0]); assert.deepEqual(state.quiz, { 0: 2 });
    assert.equal(await device.page.evaluate(() => JSON.parse(localStorage.getItem('tsPwPath.sync.v1')).code), code);
    await device.context.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: two real browsers, legacy sync code, offline topic uncheck/reload/retry, independent topic updates and preserved labs/quiz');
} finally { await browser.close(); }
