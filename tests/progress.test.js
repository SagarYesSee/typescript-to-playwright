import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { validateChanges } from '../cloudflare/worker.js';

const base = process.env.TEST_API_URL || 'http://localhost:8787';
const makeCode = () => 'pw1_' + randomBytes(32).toString('hex');
async function call(method, code, changes, origin = 'http://localhost:8080') {
  const response = await fetch(base + '/api/progress', {
    method, headers: { Authorization: 'Bearer ' + code, Origin: origin, 'Content-Type': 'application/json' },
    body: method === 'GET' ? undefined : JSON.stringify({ changes })
  });
  return { status: response.status, body: await response.json(), headers: response.headers };
}

test('validation rejects unknown fields, wrong types and out-of-range indices', () => {
  for (const bad of [null, [], { 'day:0': true }, { 'day:71': true }, { 'day:1': 'true' }, { 'quiz:0': 4 }, { 'lab:16': true }, { password: 'secret' }]) {
    assert.equal(validateChanges(bad), false);
  }
  assert.equal(validateChanges({ 'day:70': false, 'lab:15': true, 'quiz:10': null }), true);
});

test('real D1: two devices preserve independent updates, unchecks and quiz resets', async () => {
  const code = makeCode();
  let result = await call('POST', code, { 'day:1': true, 'quiz:0': 2, 'lab:0': true });
  assert.equal(result.status, 201);
  assert.equal(result.headers.get('Cache-Control'), 'no-store');
  assert.equal(result.headers.get('Access-Control-Allow-Origin'), 'http://localhost:8080');
  await Promise.all([
    call('PATCH', code, { 'day:2': true }),
    call('PATCH', code, { 'day:3': true, 'quiz:1': 1 })
  ]);
  result = await call('GET', code);
  assert.deepEqual(result.body.values, { 'day:1': true, 'day:2': true, 'day:3': true, 'quiz:0': 2, 'quiz:1': 1, 'lab:0': true });
  result = await call('PATCH', code, { 'day:1': false, 'quiz:0': null });
  assert.equal(result.body.values['day:1'], false);
  assert.equal(result.body.values['quiz:0'], null);
  assert.equal(result.body.values['day:2'], true);
  assert.equal((await call('POST', code, {})).status, 409);
});

test('real D1: full 97-field snapshot fits in one write statement', async () => {
  const values = {};
  for (let i = 1; i <= 70; i++) values['day:' + i] = i % 2 === 0;
  for (let i = 0; i < 16; i++) values['lab:' + i] = true;
  for (let i = 0; i < 11; i++) values['quiz:' + i] = i % 4;
  const result = await call('POST', makeCode(), values);
  assert.equal(result.status, 201);
  assert.deepEqual(result.body.values, values);
});

test('real D1: bearer isolation, missing codes, invalid data and CORS', async () => {
  const first = makeCode(), second = makeCode();
  await call('POST', first, { 'day:1': true });
  await call('POST', second, { 'day:2': true });
  assert.deepEqual((await call('GET', second)).body.values, { 'day:2': true });
  assert.equal((await call('GET', makeCode())).status, 404);
  assert.equal((await call('GET', 'wrong')).status, 401);
  assert.equal((await call('PATCH', first, { 'day:71': true })).status, 400);
  assert.equal((await call('GET', first, undefined, 'https://untrusted.example')).status, 403);
  const huge = await fetch(base + '/api/progress', {
    method: 'PATCH', headers: { Authorization: 'Bearer ' + first }, body: 'x'.repeat(20000)
  });
  assert.equal(huge.status, 413);
  const invalid = await fetch(base + '/api/progress', {
    method: 'PATCH', headers: { Authorization: 'Bearer ' + first }, body: 'null'
  });
  assert.equal(invalid.status, 400);
});


test('topic IDs and boolean values are validated against the catalog', () => {
  assert.equal(validateChanges({ 'topic:d01-t01': false }), true);
  for (const changes of [{ 'topic:d01-t01': 1 }, { 'topic:d01-t99': true }, { 'topic:d71-t01': true }]) assert.equal(validateChanges(changes), false);
});

test('real D1: legacy vault, topic migration, independent devices and explicit false', async () => {
  const code = makeCode();
  await call('POST', code, { 'day:1': true, 'lab:0': true, 'quiz:0': 2 });
  let legacy = (await call('GET', code)).body.values;
  assert.equal(globalThis.TopicProgress.expand(legacy)['topic:d01-t01'], true);
  const results = await Promise.all([
    call('PATCH', code, { 'topic:d01-t01': false }),
    call('PATCH', code, { 'topic:d02-t01': true })
  ]);
  results.forEach(result => assert.equal(result.status, 200));
  let values = (await call('GET', code)).body.values;
  const migrated = globalThis.TopicProgress.expand(values);
  assert.equal(migrated['topic:d01-t01'], false);
  assert.equal(migrated['topic:d01-t02'], true);
  assert.equal(migrated['topic:d02-t01'], true);
  assert.equal(values['day:1'], true);
  assert.equal(values['lab:0'], true);
  assert.equal(values['quiz:0'], 2);
});

test('real D1: complete topic snapshot fits request limit and persists', async () => {
  const values = globalThis.TopicProgress.expand({});
  for (let d = 1; d <= 70; d++) values['day:' + d] = false;
  for (let l = 0; l < 16; l++) values['lab:' + l] = true;
  for (let q = 0; q < 11; q++) values['quiz:' + q] = null;
  assert.ok(Buffer.byteLength(JSON.stringify({ changes: values })) < 16384);
  const result = await call('POST', makeCode(), values);
  assert.equal(result.status, 201);
  assert.deepEqual(result.body.values, values);
});
