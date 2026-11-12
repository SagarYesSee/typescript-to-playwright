import '../topic-progress.js';
const topicIDs = new Set(globalThis.TopicProgress.ids.map(id => 'topic:' + id));
const CODE = /^pw1_[a-f0-9]{64}$/;

export function validateChanges(changes) {
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) return false;
  const fields = Object.entries(changes);
  if (fields.length > 97 + topicIDs.size) return false;
  return fields.every(([field, value]) => {
    if (topicIDs.has(field)) return typeof value === "boolean";
    let match;
    if ((match = /^day:([1-9]\d?)$/.exec(field)))
      return Number(match[1]) <= 70 && typeof value === 'boolean';
    if ((match = /^lab:(0|[1-9]\d?)$/.exec(field)))
      return Number(match[1]) < 16 && typeof value === 'boolean';
    if ((match = /^quiz:(0|[1-9]\d?)$/.exec(field)))
      return Number(match[1]) < 11 && (value === null || (Number.isInteger(value) && value >= 0 && value < 4));
    return false;
  });
}

async function digest(code) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowed = (env.ALLOWED_ORIGINS || '').split(',');
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Vary': 'Origin'
    };
    if (origin && allowed.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    }
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    if (origin && !allowed.includes(origin)) return json({ error: 'Origin not allowed' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const path = new URL(request.url).pathname;
    if (path === '/api/health' && request.method === 'GET') return json({ ok: true });
    if (path !== '/api/progress') return json({ error: 'Not found' }, 404);
    if (!['GET', 'POST', 'PATCH'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
    const auth = request.headers.get('Authorization') || '';
    const code = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!CODE.test(code)) return json({ error: 'A valid private sync code is required' }, 401);
    const id = await digest(code);
    try {
      const exists = await env.DB.prepare('SELECT id FROM vaults WHERE id = ?').bind(id).first();
      if (request.method !== 'POST' && !exists) return json({ error: 'Sync code not found. Check the complete code.' }, 404);
      if (request.method === 'POST' && exists) return json({ error: 'This sync code already exists' }, 409);
      const statements = [];
      if (request.method !== 'GET') {
        if (Number(request.headers.get('Content-Length') || 0) > 16384) return json({ error: 'Request too large' }, 413);
        // Read at most 16 KiB, including for requests without Content-Length.
        const reader = request.body?.getReader();
        let text = '', size = 0;
        const decoder = new TextDecoder();
        if (reader) {
          while (true) {
            const part = await reader.read();
            if (part.done) break;
            size += part.value.byteLength;
            if (size > 16384) { await reader.cancel(); return json({ error: 'Request too large' }, 413); }
            text += decoder.decode(part.value, { stream: true });
          }
        }
        text += decoder.decode();
        let body;
        try { body = JSON.parse(text); } catch { return json({ error: 'Invalid JSON' }, 400); }
        if (!validateChanges(body?.changes)) return json({ error: 'Invalid progress data' }, 400);
        if (request.method === 'POST') statements.push(env.DB.prepare('INSERT INTO vaults (id) VALUES (?)').bind(id));
        const entries = Object.entries(body.changes).map(([key, value]) => ({ key, value: JSON.stringify(value) }));
        // One statement handles all supported fields, within D1's free query limit.
        statements.push(env.DB.prepare(`
          INSERT INTO progress (vault_id, field, value)
          SELECT ?, json_extract(value, '$.key'), json_extract(value, '$.value')
          FROM json_each(?) WHERE true
          ON CONFLICT(vault_id, field) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
        `).bind(id, JSON.stringify(entries)));
      }
      statements.push(env.DB.prepare('SELECT field, value FROM progress WHERE vault_id = ?').bind(id));
      const results = await env.DB.batch(statements);
      const rows = results[results.length - 1].results;
      return json({ values: Object.fromEntries(rows.map(row => [row.field, JSON.parse(row.value)])) }, request.method === 'POST' ? 201 : 200);
    } catch (error) {
      console.error('Progress storage failed:', error.message);
      return json({ error: 'Cloud saving is temporarily unavailable. Your browser copy is safe.' }, 503);
    }
  }
};
