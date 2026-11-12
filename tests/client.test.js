import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const script = readFileSync(new URL('../cloud-sync.js', import.meta.url), 'utf8');
const code = 'pw1_' + 'a'.repeat(64);
const key = 'tsPwPath.sync.v1';
const tick = () => new Promise(resolve => setImmediate(resolve));

function client({ storage = new Map(), fetch, state = { done: [], labs: [], quiz: {} } }) {
  const elements = new Map(), listeners = {}, timers = new Map();
  let timerID = 0;
  const el = id => {
    if (!elements.has(id)) elements.set(id, { textContent: '', value: '', checked: true, type: 'password', addEventListener(event, fn) { this[event] = fn; }, querySelectorAll() { return []; } });
    return elements.get(id);
  };
  const window = {
    PROGRESS_API_URL: 'https://api.example',
    ProgressBridge: { read: () => structuredClone(state), apply: next => { state = structuredClone(next); } },
    addEventListener: (event, fn) => { listeners[event] = fn; }
  };
  const context = vm.createContext({
    window, document: { hidden: false, getElementById: el, addEventListener(event, fn) { listeners[event] = fn; } },
    location: { hostname: 'example.org' }, navigator: { onLine: true },
    localStorage: { getItem: k => storage.get(k), setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
    fetch, AbortSignal, crypto, setInterval() {},
    setTimeout: (fn, ms) => { timers.set(++timerID, { fn, ms }); return timerID; },
    clearTimeout: id => timers.delete(id)
  });
  vm.runInContext(readFileSync(new URL("../topic-progress.js", import.meta.url), "utf8"), context);
  window.TopicProgress = context.TopicProgress;
  vm.runInContext(script, context);
  return {
    el, storage,
    get state() { return state; },
    change(fn) { fn(state); listeners['progress-change'](); },
    runTimer() { const entry = [...timers.entries()].find(([, t]) => t.ms === 700); if (entry) { timers.delete(entry[0]); return entry[1].fn(); } },
    retry: () => el('sync-retry').click()
  };
}
function ok(values) { return Promise.resolve({ ok: true, json: async () => ({ values }) }); }

test('offline edits survive reload and send only changed fields', async () => {
  const storage = new Map([[key, JSON.stringify({ code, pending: {} })]]);
  const offline = client({ storage, fetch: () => Promise.reject(new Error('offline')) });
  await tick();
  offline.change(state => { state.done.push(5); state.quiz[0] = 1; });
  assert.deepEqual(JSON.parse(storage.get(key)).pending, { 'day:5': true, 'quiz:0': 1, 'topic:d05-t01': true, 'topic:d05-t02': true, 'topic:d05-t03': true });
  const requests = [];
  const restored = client({ storage, state: offline.state, fetch: async (_, init) => {
    requests.push(init);
    return ok({ 'day:2': true, 'day:5': true, 'quiz:0': 1 });
  } });
  await tick();
  assert.equal(requests[0].method, 'PATCH');
  assert.deepEqual(JSON.parse(requests[0].body).changes, { 'day:5': true, 'quiz:0': 1, 'topic:d05-t01': true, 'topic:d05-t02': true, 'topic:d05-t03': true });
  assert.deepEqual(restored.state.done, [2, 5]);
  assert.deepEqual(JSON.parse(storage.get(key)).pending, {});
});

test('changes during a request stay queued instead of being overwritten', async () => {
  const storage = new Map([[key, JSON.stringify({ code, pending: {} })]]);
  let complete;
  const device = client({ storage, fetch: () => new Promise(resolve => { complete = resolve; }) });
  device.change(state => { state.done.push(7); });
  complete(await ok({ 'day:1': true }));
  await tick();
  assert.deepEqual(device.state.done, [1, 7]);
  assert.deepEqual(JSON.parse(storage.get(key)).pending, { 'day:7': true, 'topic:d07-t01': true, 'topic:d07-t02': true, 'topic:d07-t03': true });
});

test('unchecks and quiz resets remain explicit queued changes', async () => {
  const storage = new Map([[key, JSON.stringify({ code, pending: {} })]]);
  const device = client({ storage, state: { done: [1], labs: [0], quiz: { 0: 2 } }, fetch: () => Promise.reject(new Error('offline')) });
  await tick();
  device.change(state => { state.done = []; state.labs = []; state.quiz = {}; });
  assert.deepEqual(JSON.parse(storage.get(key)).pending, { 'day:1': false, 'lab:0': false, 'quiz:0': null, 'topic:d01-t01': false, 'topic:d01-t02': false });
});


test('legacy completed cloud day expands topics; explicit uncheck survives reload and offline sync', async () => {
  const storage = new Map([[key, JSON.stringify({ code, pending: {} })]]);
  const device = client({ storage, fetch: () => ok({ 'day:1': true, 'lab:2': true, 'quiz:1': 3 }) });
  await tick();
  assert.equal(device.state.topics['d01-t01'], true);
  assert.equal(device.state.topics['d01-t02'], true);
  assert.deepEqual(device.state.labs, [2]);
  assert.deepEqual(device.state.quiz, { 1: 3 });
  device.change(state => { state.topics['d01-t01'] = false; });
  assert.deepEqual(JSON.parse(storage.get(key)).pending, { 'topic:d01-t01': false });
  const restored = client({ storage, state: device.state, fetch: () => ok({ 'day:1': true, 'topic:d01-t01': false, 'lab:2': true, 'quiz:1': 3 }) });
  await tick();
  assert.equal(restored.state.topics['d01-t01'], false);
  assert.equal(restored.state.topics['d01-t02'], true);
  assert.deepEqual(JSON.parse(storage.get(key)).pending, {});
});

test('topic edits during a request remain visible and queued', async () => {
  const storage = new Map([[key, JSON.stringify({ code, pending: {} })]]);
  let complete;
  const device = client({ storage, state: { done: [], labs: [], quiz: {}, topics: {} }, fetch: () => new Promise(resolve => { complete = resolve; }) });
  device.change(state => { state.topics['d02-t01'] = true; });
  complete(await ok({ 'topic:d03-t01': true }));
  await tick();
  assert.equal(device.state.topics['d02-t01'], true);
  assert.equal(device.state.topics['d03-t01'], true);
  assert.deepEqual(JSON.parse(storage.get(key)).pending, { 'topic:d02-t01': true });
});

test('connect without merge loads cloud only; with merge preserves local topics', async () => {
  for (const merge of [false, true]) {
    const storage = new Map();
    const device = client({ storage, state: { done: [1], labs: [0], quiz: { 0: 1 }, topics: { 'd02-t01': true } }, fetch: () => ok({ 'day:3': true, 'quiz:0': 2 }) });
    device.el('sync-code').value = code;
    device.el('sync-merge').checked = merge;
    device.el('sync-connect').click();
    await tick();
    assert.equal(device.state.topics['d02-t01'], merge);
    assert.equal(device.state.topics['d01-t01'], merge);
    assert.equal(device.state.topics['d03-t01'], true);
    assert.equal(device.state.quiz[0], 2);
    assert.equal(JSON.parse(storage.get(key)).code, code);
  }
});
