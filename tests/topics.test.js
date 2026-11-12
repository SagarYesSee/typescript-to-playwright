import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../topic-progress.js';
const { days, ids, expand } = globalThis.TopicProgress;

test('70 study days have unique fixed IDs, clear names and tasks', () => {
  assert.equal(Object.keys(days).length, 70);
  assert.equal(ids.length, new Set(ids).size);
  for (let d = 1; d <= 70; d++) {
    assert.ok(days[d].length >= 2, `day ${d} needs separate topics`);
    for (const topic of days[d]) {
      assert.match(topic.id, new RegExp(`^d${String(d).padStart(2, '0')}-(t\\d{2}|extension)$`));
      assert.ok(topic.name.length > 3 && topic.name.length < 70);
      assert.ok(topic.task.length > 10);
    }
  }
});

test('legacy migration is deterministic, idempotent and respects explicit topic false', () => {
  const legacy = { 'day:1': true, 'day:2': false, 'topic:d01-t01': false, 'quiz:0': 2, 'lab:0': true };
  const migrated = expand(legacy);
  assert.equal(migrated['topic:d01-t01'], false);
  assert.equal(migrated['topic:d01-t02'], true);
  assert.equal(migrated['topic:d02-t01'], false);
  assert.equal(migrated['quiz:0'], 2);
  assert.equal(migrated['lab:0'], true);
  assert.deepEqual(expand(migrated), migrated);
  assert.equal(Object.keys(legacy).length, 5);
});
